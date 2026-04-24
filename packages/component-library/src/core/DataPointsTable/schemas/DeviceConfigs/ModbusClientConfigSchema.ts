import { z } from 'zod';

// Modbus Client configuration schema
export const ModbusClientConfigSchema = z.object({
    'device-address': z.number().int().min(0).max(247).default(1).describe('Modbus device address (unit ID)'),
    'modbus-type': z
        .enum(['modbus-tcp', 'rtu-tcp', 'rtu-serial'])
        .default('modbus-tcp')
        .describe('Modbus protocol variant'),
    'poll-interval': z.number().int().min(100).default(1000).describe('Polling interval in milliseconds'),
    'response-timeout': z.number().int().min(100).max(60000).default(1000).describe('Response timeout in ms'),
    'inter-request-delay': z.number().int().min(0).default(0).describe('Delay between requests in ms'),
    'max-retries': z.number().int().min(0).max(10).default(3).describe('Maximum number of retries'),
});

export type ModbusClientConfig = z.infer<typeof ModbusClientConfigSchema>;
