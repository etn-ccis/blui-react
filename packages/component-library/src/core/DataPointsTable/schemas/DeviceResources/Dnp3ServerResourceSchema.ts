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
    DeviceResourceSubscriptionSchema,
    FrozenCounterInputTypeSchema,
    LogicalBinaryInputTypeSchema,
    LogicalBinaryOutputTypeSchema,
} from './CommonAttributesSchemas';
import { createResourcePropertiesValidator, TypeConstraintsMap } from './ResourcePropertiesValidator';

const IndexAttributeSchema = z.number().int().gte(0).lte(65535).describe('Index of the point (0-65535).');

const EventClassAttributeSchema = z
    .enum(['not-reported', 'class-1', 'class-2', 'class-3'])
    .describe(
        'The event class assignment for reporting changes to the DNP3 Client. If set to Not Reported, no event will be reported.'
    )
    .nullish();

const EventModeAttributeSchema = z
    .enum(['default', 'sequence-of-events', 'current-object-state'])
    .describe('Specify how unconfirmed events on this point will be stored in the corresponding event queue.')
    .default('default');

const ReportInClass0AttributeSchema = z
    .boolean()
    .describe("Indicates that this point's current state will be reported in responses to class 0 polls.")
    .default(true);

const DeadbandTypeAttributeSchema = z
    .enum(['legacy', 'absolute'])
    .describe('Specify how the deadband is calculated.')
    .default('absolute');

const Dnp3ServerBinaryInputAttributesSchema = z.object({
    type: BinaryInputTypeSchema,
    index: IndexAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'event-class': EventClassAttributeSchema,
    'event-mode': EventModeAttributeSchema,
    'report-in-class-0': ReportInClass0AttributeSchema,
    'default-variation': z
        .enum(['group-default', 'packed-format', 'with-flags'])
        .describe(
            'The variation to send in response to a current value poll if the Client does not explicitly specify it.'
        )
        .default('group-default'),
    'event-default-variation': z
        .enum(['group-default', 'without-time', 'with-absolute-time', 'with-relative-time'])
        .describe('The variation to send in response to an event poll if the Client does not explicitly specify it.')
        .default('group-default'),
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
});

const Dnp3ServerAnalogInputAttributesSchema = z.object({
    type: AnalogInputTypeSchema,
    index: IndexAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    deadband: DeadbandAttributeSchema,
    'deadband-type': DeadbandTypeAttributeSchema,
    'event-class': EventClassAttributeSchema,
    'event-mode': EventModeAttributeSchema,
    'report-in-class-0': ReportInClass0AttributeSchema,
    'default-variation': z
        .enum([
            'group-default',
            '32-bit-with-flag',
            '16-bit-with-flag',
            '32-bit-without-flag',
            '16-bit-without-flag',
            'float-with-flag',
        ])
        .describe(
            'The variation to send in response to a current value poll if the Client does not explicitly specify it.'
        )
        .default('group-default'),
    'event-default-variation': z
        .enum([
            'group-default',
            '32-bit-without-time',
            '16-bit-without-time',
            '32-bit-with-time',
            '16-bit-with-time',
            'float-without-time',
            'float-with-time',
        ])
        .describe('The variation to send in response to an event poll if the Client does not explicitly specify it.')
        .default('group-default'),
    'use-float': z
        .boolean()
        .describe('Indicates that the float value of the point will be used if available.')
        .default(false),
});

const Dnp3ServerCounterInputAttributesSchema = z.object({
    type: CounterInputTypeSchema,
    index: IndexAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    deadband: DeadbandAttributeSchema,
    'deadband-type': DeadbandTypeAttributeSchema,
    'event-class': EventClassAttributeSchema,
    'event-mode': EventModeAttributeSchema,
    'report-in-class-0': ReportInClass0AttributeSchema,
    'default-variation': z
        .enum(['group-default', '32-bit-with-flag', '16-bit-with-flag', '32-bit-without-flag', '16-bit-without-flag'])
        .describe(
            'The variation to send in response to a current value poll if the Client does not explicitly specify it.'
        )
        .default('group-default'),
    'event-default-variation': z
        .enum([
            'group-default',
            '32-bit-with-flag',
            '16-bit-with-flag',
            '32-bit-with-flag-and-time',
            '16-bit-with-flag-and-time',
        ])
        .describe('The variation to send in response to an event poll if the Client does not explicitly specify it.')
        .default('group-default'),
});

const Dnp3ServerFrozenCounterInputAttributesSchema = z.object({
    type: FrozenCounterInputTypeSchema,
    index: IndexAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    deadband: DeadbandAttributeSchema,
    'deadband-type': DeadbandTypeAttributeSchema,
    'event-class': EventClassAttributeSchema,
    'event-mode': EventModeAttributeSchema,
    'report-in-class-0': ReportInClass0AttributeSchema,
    'default-variation': z
        .enum([
            'group-default',
            '32-bit-with-flag',
            '16-bit-with-flag',
            '32-bit-with-flag-and-time',
            '16-bit-with-flag-and-time',
            '32-bit-without-flag',
            '16-bit-without-flag',
        ])
        .describe(
            'The variation to send in response to a current value poll if the Client does not explicitly specify it.'
        )
        .default('group-default'),
    'event-default-variation': z
        .enum([
            'group-default',
            '32-bit-with-flag',
            '16-bit-with-flag',
            '32-bit-with-flag-and-time',
            '16-bit-with-flag-and-time',
        ])
        .describe('The variation to send in response to an event poll if the Client does not explicitly specify it.')
        .default('group-default'),
});

const Dnp3ServerBinaryOutputAttributesSchema = z.object({
    type: BinaryOutputTypeSchema,
    index: IndexAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    'event-class': EventClassAttributeSchema,
    'event-mode': EventModeAttributeSchema,
    'report-in-class-0': ReportInClass0AttributeSchema,
    'control-confirmation': z
        .enum(['none', 'select-only', 'execute-only', 'select-and-execute'])
        .describe(
            'Indicates for which command type sent to the DNP3 Client that owns the point, simulated confirmations are required.'
        )
        .default('select-and-execute'),
    'default-variation': z
        .enum(['group-default', 'packed-format', 'output-status-with-flags'])
        .describe(
            'The variation to send in response to a current value poll if the Client does not explicitly specify it.'
        )
        .default('group-default'),
    'event-default-variation': z
        .enum(['group-default', 'status-without-time', 'status-with-time'])
        .describe('The variation to send in response to an event poll if the Client does not explicitly specify it.')
        .default('group-default'),
    'points-pairing': z
        .enum(['none', 'open-first', 'close-first'])
        .describe(
            'Indicates how OPEN/CLOSE operations using two PULSE points are supported for this point, when such operations are supported.'
        )
        .default('none'),
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
});

const Dnp3ServerAnalogOutputAttributesSchema = z.object({
    type: AnalogOutputTypeSchema,
    index: IndexAttributeSchema,
    ...DeviceResourceSubscriptionSchema.shape,
    deadband: DeadbandAttributeSchema,
    'deadband-type': DeadbandTypeAttributeSchema,
    'event-class': EventClassAttributeSchema,
    'event-mode': EventModeAttributeSchema,
    'report-in-class-0': ReportInClass0AttributeSchema,
    'control-confirmation': z
        .enum(['none', 'select-only', 'execute-only', 'select-and-execute'])
        .describe(
            'Indicates for which command type sent to the DNP3 Client that owns the point, simulated confirmations are required.'
        )
        .default('select-and-execute'),
    'default-variation': z
        .enum(['group-default', '32-bit-with-flag', '16-bit-with-flag', 'float-with-flag'])
        .describe(
            'The variation to send in response to a current value poll if the Client does not explicitly specify it.'
        )
        .default('group-default'),
    'event-default-variation': z
        .enum([
            'group-default',
            '32-bit-without-time',
            '16-bit-without-time',
            '32-bit-with-time',
            '16-bit-with-time',
            'float-without-time',
            'float-with-time',
        ])
        .describe('The variation to send in response to an event poll if the Client does not explicitly specify it.')
        .default('group-default'),
    'use-float': z
        .boolean()
        .describe('Indicates that the float value of the point will be used if available.')
        .default(false),
});

const Dnp3ServerLogicalBinaryInputAttributesSchema = z.object({
    type: LogicalBinaryInputTypeSchema,
    'logical-type': z
        .enum(['link-active', 'link-available', 'scan-enabled'])
        .describe('Logical binary input type. See protocol docs for details.'),
});

const Dnp3ServerLogicalBinaryOutputAttributesSchema = z.object({
    type: LogicalBinaryOutputTypeSchema,
    'logical-type': z
        .enum(['scan-disable', 'scan-enable'])
        .describe('Logical binary output type. See protocol docs for details.'),
});

const Dnp3ServerResourceAttributesSchema = z.discriminatedUnion('type', [
    Dnp3ServerBinaryInputAttributesSchema,
    Dnp3ServerAnalogInputAttributesSchema,
    Dnp3ServerCounterInputAttributesSchema,
    Dnp3ServerFrozenCounterInputAttributesSchema,
    Dnp3ServerBinaryOutputAttributesSchema,
    Dnp3ServerAnalogOutputAttributesSchema,
    Dnp3ServerLogicalBinaryInputAttributesSchema,
    Dnp3ServerLogicalBinaryOutputAttributesSchema,
]);

export const Dnp3ServerResourcePropertiesConstraints: TypeConstraintsMap = {
    'binary-input': { valueType: 'Bool', readWrite: 'R' },
    'analog-input': { valueType: 'Float32', readWrite: 'R' },
    'counter-input': { valueType: 'Uint32', readWrite: 'R' },
    'frozen-counter-input': { valueType: 'Uint32', readWrite: 'R' },
    'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
    'analog-output': { valueType: 'Float32', readWrite: 'RW' },
    'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
    'logical-binary-output': { valueType: 'Bool', readWrite: 'RW' },
};

export const Dnp3ServerResourceSchema = z
    .object({
        ...EdgeXDeviceResourceSchema.shape,
        attributes: Dnp3ServerResourceAttributesSchema,
    })
    .superRefine(createResourcePropertiesValidator(Dnp3ServerResourcePropertiesConstraints));

export type Dnp3ServerResource = z.infer<typeof Dnp3ServerResourceSchema>;
