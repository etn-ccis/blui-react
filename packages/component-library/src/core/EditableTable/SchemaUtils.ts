import { z } from 'zod';

export type ResourceSchema = z.ZodType<any>;
export type ResourcePropertiesConstraints = Record<string, any>;

export type SchemaAttribute = {
    name: string;
    required: boolean;
    defaultValue?: unknown;
    description?: string;
    schema?: z.ZodType;
};

export const constrainSchemaProperties = (
    schema: ResourceSchema,
    constraints: ResourcePropertiesConstraints,
    pointType: string
): z.ZodObject<any> => {
    // If no constraints provided, return schema as-is
    if (!constraints || !constraints[pointType]) {
        return schema as z.ZodObject<any>;
    }

    const applicableConstraints = constraints[pointType];
    
    // Safely handle schema shape and properties
    if (!schema || typeof schema !== 'object' || !('shape' in schema)) {
        return schema as z.ZodObject<any>;
    }

    const schemaShape = (schema as any).shape;
    if (!schemaShape || !schemaShape.properties) {
        return schema as z.ZodObject<any>;
    }

    return z.object({
        ...schemaShape,
        properties: z.object({
            ...(schemaShape.properties.shape || {}),
            valueType: Array.isArray(applicableConstraints.valueType)
                ? z.enum(applicableConstraints.valueType as any).default(applicableConstraints.valueType[0])
                : z
                      .literal(applicableConstraints.valueType as string)
                      .default(applicableConstraints.valueType as string),
            readWrite: applicableConstraints.readWrite
                ? z.literal(applicableConstraints.readWrite).default(applicableConstraints.readWrite)
                : z.string(),
        }),
    }) as z.ZodObject<any>;
};

export const extractAttributesFromSchema = (schema: any, pointType: string): SchemaAttribute[] => {
    // Safely check if schema has the expected structure
    if (!schema?.shape?.attributes?.options) {
        return [];
    }

    // Filter union options that match the point type
    const matchingOptions = schema.shape.attributes.options.filter(
        (option: any) => option?.shape?.type?.value === pointType
    );

    // Extract attributes and default values from matching schema options
    return matchingOptions.flatMap((option: any) => {
        const attributesShape = option.shape;
        const attributes = Object.entries(attributesShape)
            .filter(([attrName]) => attrName !== 'type')
            .map(([name, attrSchema]) => {
                let field = attrSchema as any;
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
                        defaultValue = (field as any)._def?.defaultValue;
                    }
                    field = (field as any).unwrap?.() ?? field;

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
                schema: schema.shape.name,
            },
            {
                name: 'description',
                required: false,
                defaultValue: '',
                description: 'Description of the data point',
                schema: schema.shape.description,
            },
            // The units column is present for analog inputs and outputs only
            // This check is not super robust but is simpler than parsing the entire schema
            ...(pointType === 'analog-input' || pointType === 'analog-output'
                ? [
                      {
                          name: 'units',
                          required: false,
                          description: 'Units for the resource value.',
                          schema: schema.shape.properties.shape.units,
                      },
                  ]
                : []),
            // Based on the option schema type, set the readWrite and valueType schemas for those properties
            // The properties columns are hidden when there is only one possible value.
            ...(schema.shape.properties.shape.readWrite.unwrap() instanceof z.ZodEnum
                ? [
                      {
                          name: 'readWrite',
                          required: true,
                          description: 'Read/Write permissions of the resource.',
                          schema: schema.shape.properties.shape.readWrite,
                      },
                  ]
                : []),
            ...(schema.shape.properties.shape.valueType.unwrap() instanceof z.ZodEnum
                ? [
                      {
                          name: 'valueType',
                          required: true,
                          description: 'Data type of the resource value.',
                          schema: schema.shape.properties.shape.valueType,
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

// Helper function to determine the schema type and extract enum options if applicable
export const getSchemaInfo = (
    schema?: z.ZodType
): { type: 'string' | 'boolean' | 'number' | 'enum'; enumOptions?: string[] } => {
    if (!schema) {
        return { type: 'string' };
    }

    // Handle wrappers
    if (schema instanceof z.ZodDefault || schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
        return getSchemaInfo((schema as any).unwrap?.() ?? schema);
    }

    // Check for boolean
    if (schema instanceof z.ZodBoolean) {
        return { type: 'boolean' };
    }

    // Check for enum and literal unions
    if (schema instanceof z.ZodEnum) {
        return { type: 'enum', enumOptions: schema.options as string[] };
    }

    if (schema instanceof z.ZodUnion && schema.options.every((opt: any) => opt instanceof z.ZodLiteral)) {
        return { type: 'enum', enumOptions: schema.options.map((opt: any) => opt.values.values().next().value) as string[] };
    }

    // Check for number
    if (schema instanceof z.ZodNumber) {
        return { type: 'number' };
    }

    // Default to string
    return { type: 'string' };
};

export const getUniquePointTypes = (schema: any): string[] => {
    if (!schema?.shape?.attributes?.options) {
        return [];
    }
    
    return schema.shape.attributes.options
        .flatMap((option: any) => {
            const typeValue = option?.shape?.type?.value;
            if (typeof typeValue === 'string') {
                return [typeValue];
            }
            return [];
        })
        .filter(Boolean)
        .sort();
};
