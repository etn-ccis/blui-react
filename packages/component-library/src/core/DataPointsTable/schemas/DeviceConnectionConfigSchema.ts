

/* eslint-disable */
/* prettier-ignore-file */
// @ts-nocheck
import { z } from 'zod';

// TCP connection schema
export const TcpConnectionSchema = z.object({
    type: z.literal('tcp'),
    host: z.string().min(1, 'Host is required').default('localhost'),
    port: z.number().int().min(1).max(65535),
});

// Serial connection schema
export const SerialConnectionSchema = z.object({
    type: z.literal('serial'),
    device: z.string().min(1, 'Device path is required'),
    'baud-rate': z.number().int().default(9600),
    'data-bits': z.enum(['5', '6', '7', '8']).default('8'),
    'stop-bits': z.enum(['1', '1.5', '2']).default('1'),
    parity: z.enum(['none', 'odd', 'even']).default('none'),
});

// Discriminated union for connection types
export const DeviceConnectionConfigSchema = z.discriminatedUnion('type', [
    TcpConnectionSchema,
    SerialConnectionSchema,
]);

export type DeviceConnectionConfig = z.infer<typeof DeviceConnectionConfigSchema>;
