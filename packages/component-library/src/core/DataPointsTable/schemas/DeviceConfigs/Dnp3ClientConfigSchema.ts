import { z } from 'zod';

// DNP3 Client configuration schema
export const Dnp3ClientConfigSchema = z.object({
    'master-address': z.number().int().min(0).max(65519).default(1).describe('DNP3 master address'),
    'outstation-address': z.number().int().min(0).max(65519).default(10).describe('DNP3 outstation address'),
    'unsol-enable': z
        .enum(['disable', 'disable-silent', 'enable-class-1', 'enable-class-2', 'enable-class-3', 'enable-all'])
        .default('disable')
        .describe('Unsolicited response configuration'),
    'poll-interval': z.number().int().min(0).default(5000).describe('Polling interval in milliseconds'),
    'response-timeout': z.number().int().min(1000).max(60000).default(5000).describe('Response timeout in ms'),
    'group-variation-requests': z.record(z.object({
        interval: z.number().int().min(0).optional(),
    })).optional(),
});

export type Dnp3ClientConfig = z.infer<typeof Dnp3ClientConfigSchema>;
