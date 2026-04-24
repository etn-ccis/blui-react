

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
    DeadbandAttributeSchema,
    LogicalAnalogInputTypeSchema,
    LogicalBinaryInputTypeSchema,
    LogicalBinaryOutputTypeSchema,
} from './CommonAttributesSchemas';
import { createResourcePropertiesValidator, TypeConstraintsMap } from './ResourcePropertiesValidator';

const AddressAttributeSchema = z
    .string()
    .nonempty('Address cannot be empty.')
    .describe('The address of the resource in the field device in IEC61850 address format.');

const Iec61850MmsClientBinaryInputAttributesSchema = z.object({
    type: BinaryInputTypeSchema,
    address: AddressAttributeSchema,
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
    'cdc-type': z
        .enum(['acd', 'act', 'apc', 'bsc', 'dpc', 'dps', 'enc', 'inc', 'isc', 'spc', 'spg', 'sps'])
        .describe('The CDC Type of this resource. See documentation for more details.'),
    'attribute-type': z
        .enum(['bool', 'bstr2', 'bstr2-bit-0', 'bstr2-bit-1'])
        .describe('The attribute type of this resource.'),
});

const Iec61850MmsClientAnalogInputAttributesSchema = z.object({
    type: AnalogInputTypeSchema,
    address: AddressAttributeSchema,
    deadband: DeadbandAttributeSchema,
    'cdc-type': z
        .enum([
            'aas',
            'apc',
            'asg',
            'bcr',
            'bsc',
            'cmd',
            'cmv',
            'del',
            'enc',
            'eng',
            'ens',
            'inc',
            'ing',
            'ins',
            'isc',
            'mv',
            'sav',
            'sec',
            'seq',
            'std',
            'stv',
            'wye',
        ])
        .describe('The CDC Type of this resource. See documentation for more details.'),
    'attribute-type': z
        .enum(['int32', 'int32u', 'int64', 'float32', 'float64'])
        .describe('The attribute type of this resource.'),
});

const Iec61850MmsClientBinaryOutputAttributesSchema = z.object({
    type: BinaryOutputTypeSchema,
    address: AddressAttributeSchema,
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
    'ctl-type': z
        .enum(['open-close', 'pulse', 'pulse-close', 'pulse-open', 'open-close-pulse', 'stop-lower', 'stop-higher'])
        .describe('Specifies the type of control to which the output will respond.'),
    'cdc-type': z
        .enum(['bsc', 'dpc', 'spc', 'spg'])
        .describe('The CDC Type of this resource. See documentation for more details.'),
    'attribute-type': z.enum(['bool', 'bstr2']).describe('The attribute type of this resource.'),
    'ctl-attribute-type': z.enum(['bool', 'bstr2']).describe("The attribute type of this resource's control command."),
    'ctl-model-value': z
        .enum([
            'status-only',
            'direct-with-normal-security',
            'sbo-with-normal-security',
            'direct-with-enhanced-security',
            'sbo-with-enhanced-security',
        ])
        .describe("The execution model used for this resource's control command."),
    synchrocheck: z
        .boolean()
        .describe(
            'Affects the corresponding RTDX setting for this binary output point. This is related to the legacy 61850 config tool.'
        )
        .default(false),
    'interlock-check': z
        .boolean()
        .describe(
            'Affects the corresponding RTDX setting for this binary output point. This is related to the legacy 61850 config tool.'
        )
        .default(false),
    'open-close-pair': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe(
            'Indicates the number of the OPEN/CLOSE pair, if supported. Used to combine two pulse points to allow open/close operations on either of the two points. 0 is disabled.'
        )
        .default(0),
});

const Iec61850MmsClientAnalogOutputAttributesSchema = z.object({
    type: AnalogOutputTypeSchema,
    address: AddressAttributeSchema,
    deadband: DeadbandAttributeSchema,
    'cdc-type': z
        .enum(['apc', 'asg', 'cmd', 'enc', 'eng', 'inc', 'ing', 'isc'])
        .describe('The CDC Type of this resource. See documentation for more details.'),
    'attribute-type': z.enum(['int32', 'float32']).describe('The attribute type of this resource.'),
    'ctl-attribute-type': z
        .enum(['int32', 'float32'])
        .describe("The attribute type of this resource's control command."),
    'ctl-model-value': z
        .enum([
            'status-only',
            'direct-with-normal-security',
            'sbo-with-normal-security',
            'direct-with-enhanced-security',
            'sbo-with-enhanced-security',
        ])
        .describe("The execution model used for this resource's control command."),
});

const Iec61850MmsClientLogicalAnalogInputAttributesSchema = z.object({
    type: LogicalAnalogInputTypeSchema,
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
        .describe('Logical analog input type.'),
    deadband: DeadbandAttributeSchema,
});

const Iec61850MmsClientLogicalBinaryInputAttributesSchema = z.object({
    type: LogicalBinaryInputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-enabled',
            'binary-ctrl-enabled',
            'smp-comm-active',
            'smp-comm-fail',
            'gi-completed',
            'scan-enabled',
        ])
        .describe('Logical binary input type.'),
});

const Iec61850MmsClientLogicalBinaryOutputAttributesSchema = z.object({
    type: LogicalBinaryOutputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-disable',
            'analog-ctrl-enable',
            'binary-ctrl-disable',
            'binary-ctrl-enable',
            'force-gi',
            'logcnt-freeze',
            'logcnt-freeze-reset',
            'logcnt-reset',
            'scan-disable',
            'scan-enable',
            'scan-reset',
        ])
        .describe('Logical binary output type.'),
});

const Iec61850MmsClientResourceAttributesSchema = z.discriminatedUnion('type', [
    Iec61850MmsClientBinaryInputAttributesSchema,
    Iec61850MmsClientAnalogInputAttributesSchema,
    Iec61850MmsClientBinaryOutputAttributesSchema,
    Iec61850MmsClientAnalogOutputAttributesSchema,
    Iec61850MmsClientLogicalAnalogInputAttributesSchema,
    Iec61850MmsClientLogicalBinaryInputAttributesSchema,
    Iec61850MmsClientLogicalBinaryOutputAttributesSchema,
]);

export const Iec61850MmsClientResourcePropertiesConstraints: TypeConstraintsMap = {
    'binary-input': { valueType: 'Bool', readWrite: 'R' },
    'analog-input': { valueType: 'Float32', readWrite: 'R' },
    'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
    'analog-output': { valueType: 'Float32', readWrite: 'RW' },
    'logical-analog-input': { valueType: 'Uint32', readWrite: 'R' },
    'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
    'logical-binary-output': { valueType: 'Bool', readWrite: 'RW' },
};

export const Iec61850MmsClientResourceSchema = z
    .object({
        ...EdgeXDeviceResourceSchema.shape,
        attributes: Iec61850MmsClientResourceAttributesSchema,
    })
    .superRefine(createResourcePropertiesValidator(Iec61850MmsClientResourcePropertiesConstraints));

export type Iec61850MmsClientResource = z.infer<typeof Iec61850MmsClientResourceSchema>;
