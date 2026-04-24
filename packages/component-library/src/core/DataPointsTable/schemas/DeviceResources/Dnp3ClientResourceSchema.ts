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
    FrozenCounterInputTypeSchema,
    LogicalAnalogInputTypeSchema,
    LogicalBinaryInputTypeSchema,
    LogicalBinaryOutputTypeSchema,
} from './CommonAttributesSchemas';
import { createResourcePropertiesValidator, TypeConstraintsMap } from './ResourcePropertiesValidator';

const IndexAttributeSchema = z.number().int().gte(0).lte(65535).describe('Index of the point (0-65535).');

const Dnp3ClientBinaryInputAttributesSchema = z.object({
    type: BinaryInputTypeSchema,
    index: IndexAttributeSchema,
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
});

const Dnp3ClientAnalogInputAttributesSchema = z.object({
    type: AnalogInputTypeSchema,
    index: IndexAttributeSchema,
    deadband: DeadbandAttributeSchema,
});

const Dnp3ClientCounterInputAttributesSchema = z.object({
    type: CounterInputTypeSchema,
    index: IndexAttributeSchema,
    deadband: DeadbandAttributeSchema,
});

const Dnp3ClientFrozenCounterInputAttributesSchema = z.object({
    type: FrozenCounterInputTypeSchema,
    index: IndexAttributeSchema,
    deadband: DeadbandAttributeSchema,
});

const Dnp3ClientBinaryOutputAttributesSchema = z.object({
    type: BinaryOutputTypeSchema,
    index: IndexAttributeSchema,
    'select-required': z
        .boolean()
        .describe('Resource is controlled with a Select-Before-Operate scheme.')
        .default(true),
    'master-duration-allowed': z
        .boolean()
        .describe('If true, use the activation time specified by the master for pulse control operations.')
        .default(true),
    'default-pulse-duration': z
        .number()
        .int()
        .gte(0)
        .lte(30000)
        .describe(
            'Activation time in milliseconds for pulse control operations when not specified by the operator (0-30000).'
        )
        .default(500),
    'control-type': z
        .enum(['not-supported', 'latch', 'trip-close', 'pulse', 'pulse-open', 'pulse-close', 'force-pulse'])
        .describe('Output operation to use. See protocol docs for details.')
        .default('not-supported'),
    'grp-com-ok': z
        .boolean()
        .describe(
            "If true, this point's quality is reported as OK as soon as the communication link recovers from failure."
        )
        .default(true),
    'pair-index': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe(
            'Index of the open/close pair this resource belongs to, when combining two pulse points to operate a single open/close point.'
        )
        .default(0),
});

const Dnp3ClientAnalogOutputAttributesSchema = z.object({
    type: AnalogOutputTypeSchema,
    index: IndexAttributeSchema,
    deadband: DeadbandAttributeSchema,
    'select-required': z
        .boolean()
        .describe('Resource is controlled with a Select-Before-Operate scheme.')
        .default(true),
    'control-type': z
        .enum(['int16', 'int32', 'float32'])
        .describe('Data type used for the output control object sent to the outstation.')
        .default('int32'),
    'grp-com-ok': z
        .boolean()
        .describe(
            "If true, this point's quality is reported as OK as soon as the communication link recovers from failure."
        )
        .default(true),
    'ctrl-low-limit': z
        .number()
        .gte(-3.4e38)
        .lte(3.4e38)
        .describe('Minimum value allowed for the analog output in a control operation. Zero disables the check.')
        .default(0),
    'ctrl-high-limit': z
        .number()
        .gte(-3.4e38)
        .lte(3.4e38)
        .describe('Maximum value allowed for the analog output in a control operation. Zero disables the check.')
        .default(0),
});

const Dnp3ClientLogicalAnalogInputAttributesSchema = z.object({
    type: LogicalAnalogInputTypeSchema,
    deadband: DeadbandAttributeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-fail-count',
            'analog-ctrl-ok-count',
            'binary-ctrl-fail-count',
            'binary-ctrl-ok-count',
            'comm-checksum-count',
            'comm-error-count',
            'comm-reset-count',
            'comm-ok-count',
            'comm-timeout-count',
        ])
        .describe('Logical analog input type. See protocol docs for details.'),
});

const Dnp3ClientLogicalBinaryInputAttributesSchema = z.object({
    type: LogicalBinaryInputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-enabled',
            'binary-ctrl-enabled',
            'smp-comm-active',
            'smp-comm-fail',
            'smp-comm-status',
            'file-scan-completed',
            'gi-completed',
            'listen-mode-enabled',
            'scan-enabled',
        ])
        .describe('Logical binary input type. See protocol docs for details.'),
});

const Dnp3ClientLogicalBinaryOutputAttributesSchema = z.object({
    type: LogicalBinaryOutputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-disable',
            'analog-ctrl-enable',
            'binary-ctrl-disable',
            'binary-ctrl-enable',
            'force-clock-sync',
            'force-cnt-freeze-scan',
            'force-cnt-freeze-scan-reset',
            'custom-1',
            'force-file-scan',
            'force-gi',
            'custom-2',
            'listen-mode-disable',
            'listen-mode-enable',
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

const Dnp3ClientResourceAttributesSchema = z.discriminatedUnion('type', [
    Dnp3ClientBinaryInputAttributesSchema,
    Dnp3ClientAnalogInputAttributesSchema,
    Dnp3ClientCounterInputAttributesSchema,
    Dnp3ClientFrozenCounterInputAttributesSchema,
    Dnp3ClientBinaryOutputAttributesSchema,
    Dnp3ClientAnalogOutputAttributesSchema,
    Dnp3ClientLogicalAnalogInputAttributesSchema,
    Dnp3ClientLogicalBinaryInputAttributesSchema,
    Dnp3ClientLogicalBinaryOutputAttributesSchema,
]);

export const Dnp3ClientResourcePropertiesConstraints: TypeConstraintsMap = {
    'binary-input': { valueType: 'Bool', readWrite: 'R' },
    'analog-input': { valueType: 'Float32', readWrite: 'R' },
    'counter-input': { valueType: 'Uint32', readWrite: 'R' },
    'frozen-counter-input': { valueType: 'Uint32', readWrite: 'R' },
    'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
    'analog-output': { valueType: 'Float32', readWrite: 'RW' },
    'logical-analog-input': { valueType: 'Uint32', readWrite: 'R' },
    'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
    'logical-binary-output': { valueType: 'Bool', readWrite: 'RW' },
};

export const Dnp3ClientResourceSchema = z
    .object({
        ...EdgeXDeviceResourceSchema.shape,
        attributes: Dnp3ClientResourceAttributesSchema,
    })
    .superRefine(createResourcePropertiesValidator(Dnp3ClientResourcePropertiesConstraints));

export type Dnp3ClientResource = z.infer<typeof Dnp3ClientResourceSchema>;
