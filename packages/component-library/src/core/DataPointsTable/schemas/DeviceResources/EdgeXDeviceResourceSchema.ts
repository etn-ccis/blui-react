import { z } from 'zod';

export const ScalePropertiesSchema = z
    .number()
    .refine((n) => n !== 0, { message: 'Scale cannot be zero.' })
    .describe('Scaling factor applied to the input to generate the reported value.')
    .default(1);

export const OffsetPropertiesSchema = z
    .number()
    .gte(-3.4e38)
    .lte(3.4e38)
    .describe('Offset value applied to the input to generate the reported value.')
    .default(0);

export const EdgeXDeviceResourceSchema = z.object({
    name: z
        .string()
        .describe('Resource name.')
        .nonempty('Name cannot be empty.')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Resource name can only contain alphanumeric characters, hyphens, and underscores'),
    description: z.string().describe('Resource description.').optional(),
    isHidden: z.boolean().describe('Resource is hidden.').optional(),
    tags: z.object({}).catchall(z.string()).describe('Resource tags.').optional(),
    properties: z
        .object({
            valueType: z
                .enum([
                    'Uint8',
                    'Uint16',
                    'Uint32',
                    'Uint64',
                    'Int8',
                    'Int16',
                    'Int32',
                    'Int64',
                    'Float32',
                    'Float64',
                    'Bool',
                    'String',
                    'Binary',
                    'Object',
                    'Uint8Array',
                    'Uint16Array',
                    'Uint32Array',
                    'Uint64Array',
                    'Int8Array',
                    'Int16Array',
                    'Int32Array',
                    'Int64Array',
                    'Float32Array',
                    'Float64Array',
                    'BoolArray',
                ])
                .describe('Data type of the resource value.'),
            readWrite: z.enum(['R', 'W', 'RW']).describe('Read/Write permissions of the resource.'),
            units: z.string().describe('Units for the resource value.').optional(),
            minimum: z.number().describe('Minimum value the resource can be set to.').optional(),
            maximum: z.number().describe('Maximum value the resource can be set to.').optional(),
            defaultValue: z.string().describe('Default value.').optional(),
            mask: z.number().int().nonnegative().describe('Binary mask applied to integer reading.').optional(),
            shift: z.number().int().describe('Number of bits to shift integer reading right.').optional(),
            scale: ScalePropertiesSchema,
            offset: OffsetPropertiesSchema,
            base: z.number().describe('Value raised to power of raw reading.').optional(),
            assertion: z.string().describe('String value for health check comparison.').optional(),
            mediaType: z.string().describe('Content type of Binary value.').optional(),
            optional: z.object({}).catchall(z.any()).describe('Optional mapping for developer use.').optional(),
        })
        .strict(),
    attributes: z
        .object({})
        .catchall(z.any())
        .describe('Device service specific parameters required to access the particular value on the device.')
        .optional(),
});
