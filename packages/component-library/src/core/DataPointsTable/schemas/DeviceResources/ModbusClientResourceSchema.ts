
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

const ModbusClientBinaryInputAttributesSchema = z.object({
    type: BinaryInputTypeSchema,
    'input-source': z
        .enum([
            'coil-status',
            'input-status',
            'holding-register',
            'input-register',
            'exception-status',
            'comm-event-counter',
            'server-id-info',
        ])
        .describe(
            'The function code that will be used to gather the raw information from which the binary input is derived.'
        )
        .default('input-status'),
    'word-offset': z
        .number()
        .int()
        .gte(0)
        .lte(4095)
        .describe(
            'The offset (address) in the Modbus device RAM where the value is found. This offset is always in shorts/words (two bytes).'
        )
        .default(0),
    'bit-offset': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe('The offset (address) in the Modbus device RAM where the value is found. This offset is in bits.')
        .default(0),
    inverted: z.boolean().describe('Resource is inverted (real 0 is output as 1 and vice-versa).').default(false),
});

const ModbusClientAnalogInputAttributesSchema = z.object({
    type: AnalogInputTypeSchema,
    'raw-type': z
        .enum(['Int8', 'Uint8', 'Int16', 'Uint16', 'Int32', 'Uint32', 'Float32'])
        .describe(
            'The EdgeX data type equivalent that will be used to read data from the Modbus device. If not specified, the data type defined in the resource properties is used.'
        )
        .nullish(),
    'input-source': z
        .enum(['holding-register', 'input-register', 'exception-status', 'comm-event-counter', 'server-id-info'])
        .describe(
            'The function code that will be used to gather the raw information from which the analog input is derived.'
        )
        .default('input-register'),
    'word-offset': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe('The offset (address) in the Modbus device RAM where the value is found.')
        .default(0),
    'bit-offset': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe('The offset (address) in the Modbus device RAM where the value is found (added to the word-offset).')
        .default(0),
    deadband: DeadbandAttributeSchema,
});

const ModbusClientBinaryOutputAttributesSchema = z.object({
    type: BinaryOutputTypeSchema,
    'bit-offset': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe('The hardware coil address (bit offset) assigned to this particular output coil (binary output).')
        .default(0),
    'select-required': z
        .boolean()
        .describe('Resource is controlled with a Select-Before-Operate scheme.')
        .default(true),
    'pulse-address': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe('Indicates the address, in the holding register, where the pulse settings are written.')
        .default(0),
    'control-type': z
        .enum(['latch', 'pulse', 'open', 'close'])
        .describe('Specifies the type of control to which the output will respond.')
        .default('latch'),
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

const ModbusClientAnalogOutputAttributesSchema = z.object({
    type: AnalogOutputTypeSchema,
    'raw-type': z
        .enum(['Int16', 'Uint16', 'Int32', 'Uint32', 'Float32'])
        .describe(
            'The EdgeX data type equivalent that will be used to write commands to the Modbus device. If not specified, the data type defined in the resource properties is used.'
        )
        .nullish(),
    'word-offset': z
        .number()
        .int()
        .gte(0)
        .lte(65535)
        .describe('The holding register address (offset) assigned to this particular output.')
        .default(0),
    'ctrl-low-limit': z
        .number()
        .gte(-3.4e38)
        .lte(3.4e38)
        .describe(
            'Minimum value allowed for the analog output in a control operation. A value of zero eliminates that check.'
        )
        .default(0),
    'ctrl-high-limit': z
        .number()
        .gte(-3.4e38)
        .lte(3.4e38)
        .describe(
            'Maximum value allowed for the analog output in a control operation. A value of zero eliminates that check.'
        )
        .default(0),
    deadband: DeadbandAttributeSchema,
});

const ModbusClientLogicalAnalogInputAttributesSchema = z.object({
    type: LogicalAnalogInputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-fail-count',
            'analog-ctrl-ok-count',
            'binary-ctrl-fail-count',
            'binary-ctrl-ok-count',
            'comm-checksum-count',
            'comm-reset-count',
            'comm-ok-count',
            'comm-timeout-count',
        ])
        .describe('Logical analog input type. See protocol docs for details.'),
    deadband: DeadbandAttributeSchema,
});

const ModbusClientLogicalBinaryInputAttributesSchema = z.object({
    type: LogicalBinaryInputTypeSchema,
    'logical-type': z
        .enum(['analog-ctrl-enabled', 'binary-ctrl-enabled', 'smp-comm-fail', 'listen-mode-enabled', 'scan-enabled'])
        .describe('Logical binary input type. See protocol docs for details.'),
});

const ModbusClientLogicalBinaryOutputAttributesSchema = z.object({
    type: LogicalBinaryOutputTypeSchema,
    'logical-type': z
        .enum([
            'analog-ctrl-disable',
            'analog-ctrl-enable',
            'binary-ctrl-disable',
            'binary-ctrl-enable',
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

const ModbusClientResourceAttributesSchema = z.discriminatedUnion('type', [
    ModbusClientBinaryInputAttributesSchema,
    ModbusClientAnalogInputAttributesSchema,
    ModbusClientBinaryOutputAttributesSchema,
    ModbusClientAnalogOutputAttributesSchema,
    ModbusClientLogicalAnalogInputAttributesSchema,
    ModbusClientLogicalBinaryInputAttributesSchema,
    ModbusClientLogicalBinaryOutputAttributesSchema,
]);

export const ModbusClientResourcePropertiesConstraints: TypeConstraintsMap = {
    'binary-input': { valueType: 'Bool', readWrite: 'R' },
    'analog-input': {
        valueType: ['Uint8', 'Int8', 'Uint16', 'Int16', 'Uint32', 'Int32', 'Float32'],
        readWrite: 'R',
    },
    'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
    'analog-output': { valueType: ['Uint16', 'Int16', 'Uint32', 'Int32', 'Float32'], readWrite: 'RW' },
    'logical-analog-input': { valueType: 'Uint32', readWrite: 'R' },
    'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
    'logical-binary-output': { valueType: 'Bool', readWrite: 'RW' },
};

export const ModbusClientResourceSchema = z
    .object({
        ...EdgeXDeviceResourceSchema.shape,
        attributes: ModbusClientResourceAttributesSchema,
    })
    .superRefine(
        createResourcePropertiesValidator({
            'binary-input': { valueType: 'Bool', readWrite: 'R' },
            'analog-input': {
                valueType: ['Uint8', 'Int8', 'Uint16', 'Int16', 'Uint32', 'Int32', 'Float32'],
                readWrite: 'R',
            },
            'binary-output': { valueType: ['Bool', 'String'], readWrite: 'RW' },
            'analog-output': { valueType: ['Uint16', 'Int16', 'Uint32', 'Int32', 'Float32'], readWrite: 'RW' },
            'logical-analog-input': { valueType: 'Uint32', readWrite: 'R' },
            'logical-binary-input': { valueType: 'Bool', readWrite: 'R' },
            'logical-binary-output': { valueType: 'Bool', readWrite: 'RW' },
        })
    );

export type ModbusClientResource = z.infer<typeof ModbusClientResourceSchema>;
