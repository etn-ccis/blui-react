import { z } from 'zod';

// IEC 61850 MMS Client configuration schema
export const Iec61850MmsClientConfigSchema = z.object({
    'ied-name': z.string().min(1).default('IED').describe('IED logical device name'),
    'ap-title': z.string().optional().describe('Application process title'),
    'ae-qualifier': z.number().int().optional().describe('Application entity qualifier'),
    'poll-interval': z.number().int().min(100).default(1000).describe('Polling interval in milliseconds'),
    'response-timeout': z.number().int().min(1000).max(60000).default(10000).describe('MMS response timeout in ms'),
    'association-timeout': z.number().int().min(1000).max(60000).default(10000).describe('Association timeout in ms'),
});

export type Iec61850MmsClientConfig = z.infer<typeof Iec61850MmsClientConfigSchema>;
