import { z } from 'zod';

// DNP3 Server configuration schema
export const Dnp3ServerConfigSchema = z.object({
    'local-address': z.number().int().min(0).max(65519).default(10).describe('DNP3 local outstation address'),
    'master-address': z.number().int().min(0).max(65519).default(1).describe('DNP3 master address to accept'),
    'unsol-enabled': z.boolean().default(false).describe('Enable unsolicited responses'),
    'select-timeout': z.number().int().min(1000).max(60000).default(10000).describe('Select-before-operate timeout'),
    'confirm-timeout': z.number().int().min(1000).max(60000).default(5000).describe('Application confirm timeout'),
});

export type Dnp3ServerConfig = z.infer<typeof Dnp3ServerConfigSchema>;
