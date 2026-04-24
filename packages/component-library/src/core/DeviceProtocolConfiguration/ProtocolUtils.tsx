import { z } from 'zod';
import { ProtocolType } from '../DataPointsTable/schemas/ProtocolSchemas';

export type FieldData = {
    description?: string;
    defaultValue?: any;
    options?: string[];
    label?: string;
    getOptionLabel?: (option: string | number) => string;
    required?: boolean;
    type: 'text' | 'number' | 'switch' | 'autocomplete';
    inputProps?: object;
    helperText?: string;
};

const extractFieldData = (shape: z.core.$ZodLooseShape, key: string, data?: any, index?: number): FieldData => {
    if (!shape[key]) {
        throw new Error(`Field "${key}" not found in schema`);
    }
    const rawField = shape[key] as z.ZodType;
    let field = rawField;
    let defaultValue: unknown;
    let description = field.description ?? '';

    while (field instanceof z.ZodDefault || field instanceof z.ZodOptional || field instanceof z.ZodNullable) {
        if (field instanceof z.ZodDefault) {
            defaultValue = field.def.defaultValue;
        }
        field = field.unwrap() as z.ZodType;

        if (field.description) {
            description = field.description;
        }
    }

    let options: string[] | undefined;

    if (field instanceof z.ZodEnum) {
        options = field.options as string[];
        if (key === 'parameter-type' && index !== undefined && data) {
            const asduType = data['parameter-loading'][index]['asdu-type'];
            if (asduType !== 'cyclic-report') {
                options = options.filter((option) => option !== 'enable' && option !== 'disable');
            }
        }
    }

    if (field instanceof z.ZodUnion && field.options.every((opt) => opt instanceof z.ZodLiteral)) {
        options = field.options.map((opt) => opt.values.values().next().value) as string[];
    }

    let type: 'text' | 'number' | 'switch' | 'autocomplete' = 'text';

    if (field instanceof z.ZodNumber) {
        type = 'number';
    } else if (field instanceof z.ZodBoolean) {
        type = 'switch';
    } else if (field instanceof z.ZodEnum || (field instanceof z.ZodUnion && options)) {
        type = 'autocomplete';
    }

    return { description, defaultValue, options, type };
};

export const getFieldData = (key: string, schema: z.ZodType): FieldData => {
    let innerSchema = schema;
    // Unwrap defaults and optionals
    while (innerSchema instanceof z.ZodDefault || innerSchema instanceof z.ZodOptional) {
        innerSchema = innerSchema.unwrap() as z.ZodType;
    }

    let schemas = [innerSchema];
    // Handle discriminated unions
    if (innerSchema instanceof z.ZodDiscriminatedUnion) {
        schemas = innerSchema.def.options as z.ZodObject[];
    }

    const keyParts = key.split('.');
    const shapeKey = keyParts[0];

    let matchingSchema = schemas.find((s) => s instanceof z.ZodObject && s.shape[shapeKey]);

    if (!matchingSchema || !(matchingSchema instanceof z.ZodObject)) {
        throw new Error(`No matching schema found for field "${key}"`);
    }

    let shape = matchingSchema.shape;
    if (!shape[shapeKey]) {
        throw new Error(`Field "${key}" not found in schema`);
    }

    if (innerSchema instanceof z.ZodDiscriminatedUnion) {
        const discriminator = innerSchema.def.discriminator;
        if (discriminator === shapeKey) {
            const discriminatorOptions = schemas.map((s) => (s as z.ZodObject).shape[discriminator] as z.ZodLiteral);
            const description = discriminatorOptions
                .map((opt) => opt.description)
                .filter((desc) => desc)
                .join(', ');
            matchingSchema = z.object({
                ...matchingSchema.shape,
                [innerSchema.def.discriminator]: z.union(discriminatorOptions).describe(description),
            });
            shape = (matchingSchema as z.ZodObject).shape;
        }
    }

    if (keyParts.length === 1) {
        return extractFieldData(shape as any, shapeKey);
    }

    const nestedSchema = shape[shapeKey] as z.ZodType;

    return getFieldData(keyParts.splice(1).join('.'), nestedSchema);
};

export const getArrayData = (key: string, arrayName: any, schema: any, data?: any, index?: number): FieldData => {
    const arraySchema = schema.shape[arrayName];
    const shape = arraySchema.def.innerType.def.element.shape;

    return extractFieldData(shape, key, data, index);
};

export const getConnectionFieldData = (key: string, schema: z.ZodTypeAny, connectionType: string): FieldData => {
    const fieldKey = key.replace('connection.', '');
    const schemaDef = (schema as any).def;
    const unionSchema = schemaDef.options.find(
        (option: any) => option.shape?.type?.def?.values?.[0] === connectionType
    );

    if (!unionSchema.shape?.[fieldKey]) {
        throw new Error(`Invalid schema for connection field "${fieldKey}"`);
    }

    return extractFieldData(unionSchema.shape, fieldKey);
};

export const formatTitle = (key: string): string => {
    let fieldName = key.includes('.') ? key.split('.').pop()! : key;
    if (key.split('.').shift() === 'event-queues') {
        fieldName = key.split('.').splice(-2).join('-');
    }
    return fieldName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const shouldShowField = (
    key: string,
    data: any,
    arrayName?: string,
    index?: number,
    protocolType?: ProtocolType
): boolean => {
    let shouldShow = true;

    if (key === 'connection.host' && (protocolType === 'iec60870-104-server' || protocolType === 'dnp3-server')) {
        return false;
    }

    // Discriminated union (connection) visibility
    if (key.startsWith('connection.')) {
        const currentType = data?.connection?.type ?? 'tcp';
        if (key === 'connection.type') {
            return true;
        }
        const tcpFields = new Set(['connection.host', 'connection.port', 'connection.bind-addr']);
        const serialFields = new Set([
            'connection.path',
            'connection.link-type',
            'connection.baud-rate',
            'connection.byte-size',
            'connection.parity',
            'connection.stop-bits',
            'connection.rts-config',
            'connection.dtr-config',
        ]);
        if (currentType === 'tcp') {
            if (!tcpFields.has(key)) return false;
        } else {
            if (!serialFields.has(key)) return false;
        }
    }

    if (key === 'ignore-tx-crc' || key === 'ignore-rx-crc') {
        return data['modbus-type'] === 'rtu-over-tcpip' || data['modbus-type'] === 'modbus-tcp';
    }
    if (key === 'sync-interval') {
        return data['sync-type'] === 'cyclic';
    }

    if (arrayName && index !== undefined) {
        const arrayItem = data[arrayName][index];
        switch (key) {
            case 'delay-parameter':
                shouldShow = arrayItem.transaction === 'delay';
                break;
            case 'reset-counter':
                shouldShow = arrayItem['freeze-counter'];
                break;
            case 'raw':
                shouldShow = arrayItem['asdu-type'] === 'normalized' || arrayItem['asdu-type'] === 'scaled';
                break;
            case 'float':
                shouldShow = arrayItem['asdu-type'] === 'floating-point';
                break;
            case 'freeze-cycle':
            case 'reset':
                shouldShow =
                    arrayItem.mode === 'local-freeze-remote-request' ||
                    arrayItem.mode === 'local-freeze-spontaneous-request';
                break;
            default:
                shouldShow = true;
        }
        return shouldShow;
    }
    return shouldShow;
};

export const isArrayLengthFixed = (schema: z.ZodObject, config: { arrayName: string }): boolean => {
    const shape = schema.shape;
    let arrayField = shape[config.arrayName];

    // Handle optional arrays
    if (arrayField instanceof z.ZodOptional) {
        arrayField = arrayField.unwrap();
    }

    // Ensure it's an array
    if (!(arrayField instanceof z.ZodArray)) {
        return false;
    }

    const checks = arrayField._zod.def.checks;

    const minCheck = checks?.find((check) => check instanceof z.core.$ZodCheckMinLength);
    const maxCheck = checks?.find((check) => check instanceof z.core.$ZodCheckMaxLength);

    const minValue = minCheck?._zod.def.minimum;
    const maxValue = maxCheck?._zod.def.maximum;

    return minValue === maxValue && minValue !== undefined && maxValue !== undefined;
};

export const getArrayBounds = (
    schema: z.ZodObject,
    config: { arrayName: string }
): { minItems: number; maxItems: number } | null => {
    const shape = schema.shape;
    let arrayField = shape[config.arrayName];

    // Handle optional arrays
    if (arrayField instanceof z.ZodOptional) {
        arrayField = arrayField.unwrap();
    }

    // Ensure it's an array
    if (!(arrayField instanceof z.ZodArray)) {
        return null;
    }

    const checks = arrayField._zod.def.checks;

    const minCheck = checks?.find((check) => check instanceof z.core.$ZodCheckMinLength);
    const maxCheck = checks?.find((check) => check instanceof z.core.$ZodCheckMaxLength);

    const minItems = minCheck?._zod.def.minimum ?? 0;
    const maxItems = maxCheck?._zod.def.maximum ?? Infinity;

    return { minItems, maxItems };
};

export const extractArrayFields = (
    schema: z.ZodObject
): Array<{
    arrayName: string;
    title: string;
    keys: string[];
}> => {
    const result: Array<{
        arrayName: string;
        title: string;
        keys: string[];
    }> = [];

    const shape = schema.shape;

    Object.entries(shape).forEach(([key, fieldSchema]) => {
        // Check if it's an optional field wrapping an array
        let arraySchema = fieldSchema;
        if (fieldSchema instanceof z.ZodOptional) {
            arraySchema = fieldSchema.unwrap();
        }

        if (!(arraySchema instanceof z.ZodArray)) {
            return;
        }

        const elementSchema = arraySchema.element;

        // Check if array elements are objects
        if (elementSchema instanceof z.ZodObject) {
            const keys = Object.keys(elementSchema.shape);
            result.push({
                arrayName: key,
                title: formatTitle(key),
                keys,
            });
        }
    });

    return result;
};
