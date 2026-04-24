
/* eslint-disable */
/* prettier-ignore-file */
// @ts-nocheck
import { z } from 'zod';
import { ProtocolResourceSchema } from '../DeviceProtocolConfiguration/ProtocolRegistry';
import { TypeConstraintsMap } from './schemas/DeviceResources/ResourcePropertiesValidator';

export type SchemaAttribute = {
    name: string;
    required: boolean;
    defaultValue?: unknown;
    description?: string;
    schema?: z.ZodType;
};

// Helper to unwrap ZodEffects to get the inner ZodObject
const unwrapSchema = (schema: ProtocolResourceSchema | z.ZodObject<any>): z.ZodObject<any> => {
    let current: any = schema;
    while (current instanceof z.ZodEffects) {
        current = current._def.schema;
    }
    return current;
};

export const constrainSchemaProperties = (
    schema: ProtocolResourceSchema,
    constraints: TypeConstraintsMap,
    pointType: string
): z.ZodObject<any> => {
    const unwrapped = unwrapSchema(schema);
    const applicableConstraints = constraints[pointType];
    return z.object({
        ...unwrapped.shape,
        properties: z.object({
            ...unwrapped.shape.properties.shape,
            valueType: Array.isArray(applicableConstraints.valueType)
                ? z.enum(applicableConstraints.valueType).default(applicableConstraints.valueType[0])
                : z
                      .literal(applicableConstraints.valueType as string)
                      .default(applicableConstraints.valueType as string),
            readWrite: z.literal(applicableConstraints.readWrite).default(applicableConstraints.readWrite),
        }),
    });
};

export const extractAttributesFromSchema = (schema: z.ZodObject<any>, pointType: string): SchemaAttribute[] => {
    const unwrapped = unwrapSchema(schema);
    // Filter union options that match the point type
    const matchingOptions = unwrapped.shape.attributes.options.filter(
        (option: z.ZodObject<any>) => option.shape.type.value === pointType
    );

    // Extract attributes and default values from matching schema options
    return matchingOptions.flatMap((option: z.ZodObject<any>) => {
        const attributesShape = option.shape;
        const attributes = Object.entries(attributesShape)
            .filter(([attrName]) => attrName !== 'type')
            .map(([name, attrSchema]) => {
                let field = attrSchema as z.ZodType;
                let defaultValue;
                let description = field.description ?? '';
                let required = true;

                while (
                    field instanceof z.ZodDefault ||
                    field instanceof z.ZodOptional ||
                    field instanceof z.ZodNullable
                ) {
                    if (field instanceof z.ZodOptional || field instanceof z.ZodNullable) {
                        required = false;
                    }

                    if (field instanceof z.ZodDefault) {
                        defaultValue = field.def.defaultValue;
                    }
                    field = field.unwrap() as z.ZodType;

                    if (field.description) {
                        description = field.description;
                    }
                }

                return { name, required, defaultValue, description, schema: attrSchema };
            });

        return [
            {
                name: 'name',
                required: true,
                defaultValue: '',
                description: 'Name of the data point',
                schema: unwrapped.shape.name,
            },
            {
                name: 'description',
                required: false,
                defaultValue: '',
                description: 'Description of the data point',
                schema: unwrapped.shape.description,
            },
            ...(!pointType.includes('binary') && !pointType.includes(`logical`)
                ? [
                      {
                          name: 'scale',
                          required: true,
                          description: 'Scale factor applied to the input to generate the reported value.',
                          schema: unwrapped.shape.properties.shape.scale,
                      },
                      {
                          name: 'offset',
                          required: true,
                          description: 'Offset applied to the input to generate the reported value.',
                          schema: unwrapped.shape.properties.shape.offset,
                      },
                  ]
                : []),
            // The units column is present for analog inputs and outputs only
            // This check is not super robust but is simpler than parsing the entire schema
            ...(pointType === 'analog-input' || pointType === 'analog-output'
                ? [
                      {
                          name: 'units',
                          required: false,
                          description: 'Units for the resource value.',
                          schema: unwrapped.shape.properties.shape.units,
                      },
                  ]
                : []),
            // Based on the option schema type, set the readWrite and valueType schemas for those properties
            // The properties columns are hidden when there is only one possible value.
            ...(unwrapped.shape.properties.shape.readWrite.unwrap() instanceof z.ZodEnum
                ? [
                      {
                          name: 'readWrite',
                          required: true,
                          description: 'Read/Write permissions of the resource.',
                          schema: unwrapped.shape.properties.shape.readWrite,
                      },
                  ]
                : []),
            ...(unwrapped.shape.properties.shape.valueType.unwrap() instanceof z.ZodEnum
                ? [
                      {
                          name: 'valueType',
                          required: true,
                          description: 'Data type of the resource value.',
                          schema: unwrapped.shape.properties.shape.valueType,
                      },
                  ]
                : []),
            ...attributes,
        ];
    });
};

export const formatAttributeName = (name: string): string =>
    // Convert kebab-case to Title Case
    // Also convert camelCase to Title Case
    name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export const formatPointTypeName = (type: string): string =>
    // Convert kebab-case to Title Case with plural
    `${type
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}s`;

export type SchemaInfo = { type: 'string' | 'boolean' | 'number' | 'enum'; enumOptions?: string[] };

// Helper function to determine the schema type and extract enum options if applicable
export const getSchemaInfo = (schema?: z.ZodType): SchemaInfo => {
    if (!schema) {
        return { type: 'string' };
    }

    // Handle wrappers
    if (schema instanceof z.ZodDefault || schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
        return getSchemaInfo(schema.unwrap() as z.ZodType);
    }

    // Check for boolean
    if (schema instanceof z.ZodBoolean) {
        return { type: 'boolean' };
    }

    // Check for enum and literal unions
    if (schema instanceof z.ZodEnum) {
        return { type: 'enum', enumOptions: schema.options as string[] };
    }

    if (schema instanceof z.ZodUnion && schema.options.every((opt) => opt instanceof z.ZodLiteral)) {
        return { type: 'enum', enumOptions: schema.options.map((opt) => opt.values.values().next().value) as string[] };
    }

    // Check for number
    if (schema instanceof z.ZodNumber) {
        return { type: 'number' };
    }

    // Default to string
    return { type: 'string' };
};

export const getUniquePointTypes = (schema: ProtocolResourceSchema): string[] => {
    const unwrapped = unwrapSchema(schema);
    return unwrapped.shape.attributes.options
        .flatMap((option: any) => {
            const typeValue = option.shape.type?.value;
            if (typeof typeValue === 'string') {
                return [typeValue];
            }
            return [];
        })
        .filter(Boolean)
        .sort();
};
