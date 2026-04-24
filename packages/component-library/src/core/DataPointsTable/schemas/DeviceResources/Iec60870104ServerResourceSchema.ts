// @ts-nocheck
import { z } from 'zod';
import { EdgeXDeviceResourceSchema } from './EdgeXDeviceResourceSchema';
import {
    AnalogInputTypeSchema,
    AnalogOutputTypeSchema,
    BinaryInputTypeSchema,
    BinaryOutputTypeSchema,
    CounterInputTypeSchema,
    DeviceResourceSubscriptionSchema,
    LogicalBinaryInputTypeSchema,
} from './CommonAttributesSchemas';
import { createResourcePropertiesValidator, TypeConstraintsMap } from './ResourcePropertiesValidator';

const AddressAttributeSchema = z
    .number()
    .int()
    .gte(1)
    .lte(16777216)
    .describe(
        'IEC 60870-5-104 information object address. Must be unique throughout the entire device profile (including other resource types).'
    )
    .default(1);

const TimeTaggedAttributeSchema = z
    .boolean()
    .describe(
        'Indicates whether time tags will be used for spontaneous or cyclic reporting. Values reported following group interrogation requests are never time tagged.'
    )
    .default(true);

const GroupAttributeSchema = z
    .number()
    .int()
    .gte(0)
    .lte(16)
    .describe(
        'Group number of the group to which the resource belongs. When a request for a specific group is received, only points belonging to this group are reported. The general group (0) consists of all the points.'
    )
    .default(0);

const Iec60870104ServerBinaryInputAttributesSchema = z.object({
    type: BinaryInputTypeSchema,
    address: AddressAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'time-tagged': TimeTaggedAttributeSchema,
    group: GroupAttributeSchema,
    format: z
        .enum(['single-point', 'double-point-0', 'double-point-1'])
        .describe(
            'Indicates whether this resource is single or double. Note that currently, the Virtual RTU does not fully support double-point resources. Also, if a single resource is subscribed to a double resource, then only the lowest bit is kept. If a double resource is subscribed to a single resource, then the intermediate states are not used and the following conversion takes place: 0 is translated to 01 and 1 is translated to 10.'
        )
        .default('single-point'),
});

const Iec60870104ServerAnalogInputAttributesSchema = z.object({
    type: AnalogInputTypeSchema,
    address: AddressAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'time-tagged': TimeTaggedAttributeSchema,
    group: GroupAttributeSchema,
    format: z
        .enum(['normalized', 'scaled', 'float', 'step-position', 'bitstring'])
        .describe(
            'Format used to report the analog input value. This format determines how the internal DataExchange will convert received data; this is detailed in the complete protocol documentation.'
        )
        .default('normalized'),
    cyclic: z
        .boolean()
        .describe(
            'Indicates whether cyclic reporting is enabled. The remote control center can change the cyclic reporting attribute at run time through the Cyclic activation setting. This setting is restored for each analog input resource each time the communication is lost.'
        )
        .default(false),
    'force-float': z
        .boolean()
        .describe(
            'When true, indicates that when both raw and floating-point values are received in the DataExchange, the floating-point value will be used for translation. When false, the raw value will be used instead.'
        )
        .default(true),
});

const Iec60870104ServerCounterInputAttributesSchema = z.object({
    type: CounterInputTypeSchema,
    address: AddressAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'time-tagged': TimeTaggedAttributeSchema,
    group: GroupAttributeSchema,
});

const Iec60870104ServerBinaryOutputAttributesSchema = z.object({
    type: BinaryOutputTypeSchema,
    address: AddressAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'simulated-control-confirmation': z
        .enum(['none', 'select-only', 'execute-only', 'select-and-execute'])
        .describe(
            'Indicates whether or not a simulated confirmation is required for control requests sent to the remote control center.'
        )
        .default('select-only'),
    'force-open-close': z
        .boolean()
        .describe(
            'Indicates that received PULSE OPEN and PULSE CLOSE commands will be converted to standard OPEN and CLOSE operations. Otherwise, PULSE commands will be forwarded to remote control centers as is.'
        )
        .default(false),
    'default-action': z
        .enum(['latch', 'short-pulse', 'long-pulse'])
        .describe('The action that is to be performed when a command with a DEFAULT qualifier is received.')
        .default('latch'),
    'points-pairing': z
        .enum(['none', 'open-first', 'close-first'])
        .describe(
            'Indicates how IEC 60870-5-104 operations using two PULSE resources are supported for this resource. If supported, the next index is reserved and is used to define the second point of the pair, which will handle the complementary operation.'
        )
        .default('none'),
});

const Iec60870104ServerAnalogOutputAttributesSchema = z.object({
    type: AnalogOutputTypeSchema,
    address: AddressAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'simulated-control-confirmation': z
        .enum(['none', 'select-only', 'execute-only', 'select-and-execute'])
        .describe(
            'Indicates whether or not a simulated confirmation is required for control requests sent to the remote control center.'
        )
        .default('select-only'),
});

const ParameterLoadingTypeSchema = z.literal('parameter-loading').describe("Must be 'parameter-loading'.");

const Iec60870104ServerParameterLoadingAttributesSchema = z.object({
    type: ParameterLoadingTypeSchema,
    address: AddressAttributeSchema,
    'ai-address': z
        .number()
        .int()
        .gte(1)
        .lte(16777216)
        .describe('Information object address of the analog input resource whose behavior is affected by this setting.')
        .default(1),
    group: z
        .number()
        .int()
        .gte(0)
        .lte(16)
        .describe(
            'Group number of the group to which the point belongs. When a request for a specific group is received, only points belonging to this group are reported. There is no general group for parameter loading resources.'
        )
        .default(0),
});

const Iec60870104ServerLogicalBinaryInputAttributesSchema = z.object({
    type: LogicalBinaryInputTypeSchema,
    'logical-type': z
        .enum(['link-active', 'link-available'])
        .describe('Logical binary input type. See protocol docs for details.'),
});

const Iec60870104ServerResourceAttributesSchema = z.discriminatedUnion('type', [
    Iec60870104ServerBinaryInputAttributesSchema,
    Iec60870104ServerAnalogInputAttributesSchema,
    Iec60870104ServerCounterInputAttributesSchema,
    Iec60870104ServerBinaryOutputAttributesSchema,
    Iec60870104ServerAnalogOutputAttributesSchema,
    Iec60870104ServerParameterLoadingAttributesSchema,
    Iec60870104ServerLogicalBinaryInputAttributesSchema,
]);

export const Iec60870104ServerResourcePropertiesConstraints: TypeConstraintsMap = {
    'binary-input': { valueType: 'Bool', readWrite: 'R' },
    'analog-input': { valueType: 'Float32', readWrite: 'R' },
    'counter-input': { valueType: 'Uint32', readWrite: 'R' },
    'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
    'analog-output': { valueType: 'Float32', readWrite: 'RW' },
    'parameter-loading': { valueType: 'Float32', readWrite: 'R' },
    'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
};

export const Iec60870104ServerResourceSchema = z
    .object({
        ...EdgeXDeviceResourceSchema.shape,
        attributes: Iec60870104ServerResourceAttributesSchema,
    })
    .superRefine(createResourcePropertiesValidator(Iec60870104ServerResourcePropertiesConstraints));

export type Iec60870104ServerResource = z.infer<typeof Iec60870104ServerResourceSchema>;
