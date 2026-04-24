import { z } from 'zod';

export const AnalogInputTypeSchema = z.literal('analog-input').describe("Must be 'analog-input'.");

export const BinaryInputTypeSchema = z.literal('binary-input').describe("Must be 'binary-input'.");

export const CounterInputTypeSchema = z.literal('counter-input').describe("Must be 'counter-input'.");

export const FrozenCounterInputTypeSchema = z
    .literal('frozen-counter-input')
    .describe("Must be 'frozen-counter-input'.");

export const AnalogOutputTypeSchema = z.literal('analog-output').describe("Must be 'analog-output'.");

export const BinaryOutputTypeSchema = z.literal('binary-output').describe("Must be 'binary-output'.");

export const LogicalAnalogInputTypeSchema = z
    .literal('logical-analog-input')
    .describe("Must be 'logical-analog-input'.");

export const LogicalBinaryInputTypeSchema = z
    .literal('logical-binary-input')
    .describe("Must be 'logical-binary-input'.");

export const LogicalBinaryOutputTypeSchema = z
    .literal('logical-binary-output')
    .describe("Must be 'logical-binary-output'.");

export const DeadbandAttributeSchema = z
    .number()
    .gte(0)
    .lte(3.4e38)
    .describe('Minimum value variation that must be detected for this resource for the new value to be reported.')
    .default(0);

export const DeviceResourceSubscriptionSchema = z.object({
    // TODO: These should probably reference existing device and resource names to ensure validity.
    // It's a bit complex to expose the allowed values in the editable data table, though.
    device: z
        .string()
        .describe('Name of the device to subscribe to.')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Device name can only contain alphanumeric characters, hyphens, and underscores'),
    resource: z
        .string()
        .describe('Name of the device resource to subscribe to.')
        .regex(/^[a-zA-Z0-9-_]+$/, 'Resource name can only contain alphanumeric characters, hyphens, and underscores'),
});
