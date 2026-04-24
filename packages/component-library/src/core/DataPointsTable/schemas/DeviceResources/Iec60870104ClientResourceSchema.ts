
/* eslint-disable */
/* prettier-ignore-file */
// @ts-nocheck
import { z } from 'zod';
import { EdgeXDeviceResourceSchema } from './EdgeXDeviceResourceSchema';
import {
    AnalogInputTypeSchema,
    AnalogOutputTypeSchema,
    BinaryInputTypeSchema,
    BinaryOutputTypeSchema,
    CounterInputTypeSchema,
    DeadbandAttributeSchema,
    LogicalAnalogInputTypeSchema,
    LogicalBinaryInputTypeSchema,
    LogicalBinaryOutputTypeSchema,
} from './CommonAttributesSchemas';
import { createResourcePropertiesValidator, TypeConstraintsMap } from './ResourcePropertiesValidator';

const AddressAttributeSchema = z
    .number()
    .int()
    .gte(1)
    .lte(16777216)
    .describe(
        'IEC client address associated with this resource. Must be unique throughout the entire device profile (including other resource types).'
    )
    .default(1);

const Iec60870104ClientBinaryInputAttributesSchema = z.object({
    type: BinaryInputTypeSchema,
    address: AddressAttributeSchema,
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
    'numeric-input-type': z
        .enum(['single-point', 'double-point-single', 'double-point-0', 'double-point-1'])
        .describe(
            'Indicates whether this resource is single or double. Note that currently, the Virtual RTU does not fully support double-point resources.'
        )
        .default('single-point'),
});

const Iec60870104ClientAnalogInputAttributesSchema = z.object({
    type: AnalogInputTypeSchema,
    address: AddressAttributeSchema,
    deadband: DeadbandAttributeSchema,
    'asdu-type': z
        .enum(['unknown', 'normalized', 'scaled', 'float', 'step-position', 'bitstring'])
        .describe(
            'Define the type of ASDU that will be used to report this resource. If the ASDU received from the field device differs from this one, the quality will be set to Bad Hardware and data will not be updated.'
        )
        .default('normalized'),
});

const Iec60870104ClientCounterInputAttributesSchema = z.object({
    type: CounterInputTypeSchema,
    address: AddressAttributeSchema,
    deadband: DeadbandAttributeSchema,
});

const Iec60870104ClientBinaryOutputAttributesSchema = z.object({
    type: BinaryOutputTypeSchema,
    address: AddressAttributeSchema,
    'select-required': z
        .boolean()
        .describe('Resource is controlled with a Select-Before-Operate scheme.')
        .default(true),
    'control-type': z
        .enum(['not-defined', 'latch', 'pulse', 'pulse-open', 'pulse-close'])
        .describe('Specifies the type of control to which the output will respond.')
        .default('not-defined'),
    'asdu-type': z
        .enum(['single-point', 'double-point', 'regulating-step'])
        .describe(
            'Indicates the ASDU type of the IEC 60870-5 control operation to be carried out, when a command is received from EdgeX or another device.'
        )
        .default('single-point'),
    'time-tagged': z.boolean().describe('Indicates that the command must be time-tagged.').default(false),
    'open-close-pair': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe(
            'Indicates the number of the OPEN/CLOSE pair, if supported. Used to combine two pulse points to allow open/close operations on either of the two points. 0 is disabled.'
        )
        .default(0),
    'master-duration-allowed': z
        .boolean()
        .describe(
            'Indicates that the activation time specified by the client should be used, if available instead of the activation time setting value specified for pulse control operations performed on this point.'
        )
        .default(true),
    'activation-time': z
        .number()
        .int()
        .gte(0)
        .lte(2147483647)
        .describe('The pulse duration value used when the master duration is ignored. 0 = use field device default.')
        .default(500),
    'activation-limit': z
        .number()
        .int()
        .gte(0)
        .lte(2147483647)
        .describe(
            'The pulse duration value used to determine whether a PULSE used for a control operation is SHORT or LONG. If the specified duration is smaller than or equal to this value, a SHORT pulse is generated; otherwise, a LONG PULSE is generated. 0 = use field device default.'
        )
        .default(500),
});

const Iec60870104ClientAnalogOutputAttributesSchema = z.object({
    type: AnalogOutputTypeSchema,
    address: AddressAttributeSchema,
    deadband: DeadbandAttributeSchema,
    'asdu-type': z
        .enum(['normalized', 'scaled', 'float', 'bitstring'])
        .describe(
            'Indicates the ASDU type of the IEC 60870-5 control operation to be carried out, when a command is received from EdgeX or another device.'
        )
        .default('normalized'),
    'select-required': z
        .boolean()
        .describe('Resource is controlled with a Select-Before-Operate scheme.')
        .default(true),
    'time-tagged': z.boolean().describe('Indicates that the command must be time-tagged.').default(false),
});

const Iec60870104ClientLogicalAnalogInputAttributesSchema = z.object({
    type: LogicalAnalogInputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-fail-count',
            'analog-ctrl-ok-count',
            'binary-ctrl-fail-count',
            'binary-ctrl-ok-count',
            'comm-reset-count',
            'comm-ok-count',
        ])
        .describe('Logical analog input type. See protocol docs for details.'),
    deadband: DeadbandAttributeSchema,
});

const Iec60870104ClientLogicalBinaryInputAttributesSchema = z.object({
    type: LogicalBinaryInputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-enabled',
            'binary-ctrl-enabled',
            'smp-comm-fail',
            'smp-comm-status',
            'gi-completed',
            'scan-enabled',
        ])
        .describe('Logical binary input type. See protocol docs for details.'),
});

const Iec60870104ClientLogicalBinaryOutputAttributesSchema = z.object({
    type: LogicalBinaryOutputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-disable',
            'analog-ctrl-enable',
            'binary-ctrl-disable',
            'binary-ctrl-enable',
            'force-clock-sync',
            'force-gi',
            'logcnt-freeze',
            'logcnt-freeze-reset',
            'logcnt-reset',
            'scan-disable',
            'scan-enable',
            'scan-fast',
            'scan-normal',
            'scan-reset',
            'scan-slow',
        ])
        .describe('Logical binary output type. See protocol docs for details.'),
});

const Iec60870104ClientResourceAttributesSchema = z.discriminatedUnion('type', [
    Iec60870104ClientBinaryInputAttributesSchema,
    Iec60870104ClientAnalogInputAttributesSchema,
    Iec60870104ClientCounterInputAttributesSchema,
    Iec60870104ClientBinaryOutputAttributesSchema,
    Iec60870104ClientAnalogOutputAttributesSchema,
    Iec60870104ClientLogicalAnalogInputAttributesSchema,
    Iec60870104ClientLogicalBinaryInputAttributesSchema,
    Iec60870104ClientLogicalBinaryOutputAttributesSchema,
]);

export const Iec60870104ClientResourcePropertiesConstraints: TypeConstraintsMap = {
    'binary-input': { valueType: 'Bool', readWrite: 'R' },
    'analog-input': { valueType: 'Float32', readWrite: 'R' },
    'counter-input': { valueType: 'Uint32', readWrite: 'R' },
    'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
    'analog-output': { valueType: 'Float32', readWrite: 'RW' },
    'logical-analog-input': { valueType: 'Uint32', readWrite: 'R' },
    'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
    'logical-binary-output': { valueType: 'Bool', readWrite: 'RW' },
};

export const Iec60870104ClientResourceSchema = z
    .object({
        ...EdgeXDeviceResourceSchema.shape,
        attributes: Iec60870104ClientResourceAttributesSchema,
    })
    .superRefine(createResourcePropertiesValidator(Iec60870104ClientResourcePropertiesConstraints));

export type Iec60870104ClientResource = z.infer<typeof Iec60870104ClientResourceSchema>;
