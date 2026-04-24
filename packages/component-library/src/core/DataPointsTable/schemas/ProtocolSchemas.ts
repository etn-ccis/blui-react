
/* eslint-disable */
/* prettier-ignore-file */
// @ts-nocheck
import z from 'zod';
import { DeviceConnectionConfigSchema } from './DeviceConnectionConfigSchema';
import { Dnp3ClientConfigSchema } from './DeviceConfigs/Dnp3ClientConfigSchema';
import { Dnp3ServerConfigSchema } from './DeviceConfigs/Dnp3ServerConfigSchema';
import { Iec60870104ClientConfigSchema } from './DeviceConfigs/Iec60870104ClientConfigSchema';
import { Iec60870104ServerConfigSchema } from './DeviceConfigs/Iec60870104ServerConfigSchema';
import { Iec61850MmsClientConfigSchema } from './DeviceConfigs/Iec61850MmsClientConfigSchema';
import { ModbusClientConfigSchema } from './DeviceConfigs/ModbusClientConfigSchema';

const [tcpSchema, serialSchema] = DeviceConnectionConfigSchema.options;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createConnectionSchemaWithDefaultPort = (defaultPort: number) =>
    z.discriminatedUnion('type', [
        z.object({
            ...tcpSchema.shape,
            port: tcpSchema.shape.port.default(defaultPort),
        }),
        serialSchema,
    ]);

export const Dnp3ClientProtocolSchema = z
    .object({
        ...Dnp3ClientConfigSchema.shape,
        connection: createConnectionSchemaWithDefaultPort(20000),
    })
    .refine(
        (data) => {
            // If unsolicited responses are enabled (not 'disable' or 'disable-silent'),
            // then no group-variation request can have a non-zero interval
            const unsolEnable = data['unsol-enable'];
            if (!unsolEnable || unsolEnable === 'disable' || unsolEnable === 'disable-silent') {
                return true;
            }

            const groupVarRequests = data['group-variation-requests'];
            if (!groupVarRequests) {
                return true;
            }

            // Check if any group-variation request has a non-zero interval
            const hasNonZeroInterval = Object.values(groupVarRequests).some(
                (request) => request?.interval && request.interval > 0
            );

            return !hasNonZeroInterval;
        },
        {
            message:
                'When Group Variation Requests are used with non-zero intervals, unsolicited responses must be set to disable or disable-silent.',
            path: ['unsol-enable'],
        }
    );

type Dnp3ClientProtocol = z.infer<typeof Dnp3ClientProtocolSchema>;

export const Dnp3ServerProtocolSchema = z.object({
    ...Dnp3ServerConfigSchema.shape,
    connection: createConnectionSchemaWithDefaultPort(20000),
});
type Dnp3ServerProtocol = z.infer<typeof Dnp3ServerProtocolSchema>;

export const ModbusClientProtocolSchema = z
    .object({
        ...ModbusClientConfigSchema.shape,
        connection: createConnectionSchemaWithDefaultPort(502),
    })
    .refine(
        (data) => {
            if (!data?.connection?.type || !data['modbus-type']) {
                return true;
            }

            if (data.connection.type === 'serial' && data['modbus-type'] !== 'rtu-serial') {
                return false;
            }
            if (data.connection.type === 'tcp' && data['modbus-type'] === 'rtu-serial') {
                return false;
            }
            return true;
        },
        {
            message: 'Modbus type must be compatible with connection type',
            path: ['modbus-type'],
            // This is required for zodResolver to work when creating a new device
            when() {
                return true;
            },
        }
    )
    .refine(
        (data) => {
            if (!data) {
                return true;
            }
            if (data['modbus-type'] === 'modbus-tcp') {
                return data['device-address'] >= 0 && data['device-address'] <= 247;
            }
            return data['device-address'] > 0 && data['device-address'] <= 247;
        },
        {
            message: '0 is only allowed when modbus-type is modbus-tcp',
            path: ['device-address'],
        }
    );
type ModbusClientProtocol = z.infer<typeof ModbusClientProtocolSchema>;

export const Iec60870104ClientProtocolSchema = z
    .object({
        ...Iec60870104ClientConfigSchema.shape,
        connection: createConnectionSchemaWithDefaultPort(2404),
    })
    .refine((data) => data?.['delay-t2'] < data?.['delay-t1'], {
        message: 'delay-t2 must be smaller than delay-t1',
        path: ['delay-t2'],
    })
    .refine(
        (data) => {
            if (data?.['delay-t3'] > data?.['delay-t1']) {
                return true;
            }
            return false;
        },
        {
            message: 'delay-t3 must be greater than delay-t1',
            path: ['delay-t3'],
        }
    );
type Iec60870104ClientProtocol = z.infer<typeof Iec60870104ClientProtocolSchema>;

export const Iec60870104ServerProtocolSchema = z
    .object({
        ...Iec60870104ServerConfigSchema.shape,
        connection: createConnectionSchemaWithDefaultPort(2404),
    })
    .refine((data) => data?.['delay-t2'] < data?.['delay-t1'], {
        message: 'delay-t2 must be smaller than delay-t1',
        path: ['delay-t2'],
    })
    .refine(
        (data) => {
            if (data?.['delay-t3'] > data?.['delay-t1']) {
                return true;
            }
            return false;
        },
        {
            message: 'delay-t3 must be greater than delay-t1',
            path: ['delay-t3'],
        }
    );
type Iec60870104ServerProtocol = z.infer<typeof Iec60870104ServerProtocolSchema>;

export const Iec61850MmsClientProtocolSchema = z.object({
    ...Iec61850MmsClientConfigSchema.shape,
    connection: createConnectionSchemaWithDefaultPort(102),
});
type Iec61850MmsClientProtocol = z.infer<typeof Iec61850MmsClientProtocolSchema>;

export const ProtocolTypeSchema = z.enum([
    'dnp3-client',
    'dnp3-server',
    'modbus-client',
    'iec60870-104-client',
    'iec60870-104-server',
    'iec61850-mms-client',
    '',
]);

export const DeviceProtocolSchema = z.union([
    z.object({ 'dnp3-client': Dnp3ClientProtocolSchema }),
    z.object({ 'dnp3-server': Dnp3ServerProtocolSchema }),
    z.object({ 'modbus-client': ModbusClientProtocolSchema }),
    z.object({ 'iec60870-104-client': Iec60870104ClientProtocolSchema }),
    z.object({ 'iec60870-104-server': Iec60870104ServerProtocolSchema }),
    z.object({ 'iec61850-mms-client': Iec61850MmsClientProtocolSchema }),
]);
export type DeviceProtocol = z.infer<typeof DeviceProtocolSchema>;

export type DeviceProtocolData =
    | Dnp3ClientProtocol
    | Dnp3ServerProtocol
    | ModbusClientProtocol
    | Iec60870104ClientProtocol
    | Iec60870104ServerProtocol
    | Iec61850MmsClientProtocol;

export type ProtocolType = z.infer<typeof ProtocolTypeSchema>;
