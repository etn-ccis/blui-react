import { z } from 'zod';

// IEC 60870-5-104 Server configuration schema
export const Iec60870104ServerConfigSchema = z.object({
    'common-address': z.number().int().min(1).max(65534).default(1).describe('Common ASDU address'),
    'delay-t1': z.number().int().min(1000).max(255000).default(15000).describe('T1 timeout (send/receive) in ms'),
    'delay-t2': z.number().int().min(1000).max(255000).default(10000).describe('T2 timeout (ack) in ms'),
    'delay-t3': z.number().int().min(1000).max(172800000).default(20000).describe('T3 timeout (test frame) in ms'),
    'max-k': z.number().int().min(1).max(32767).default(12).describe('Max unacknowledged I-frames (k)'),
    'max-w': z.number().int().min(1).max(32767).default(8).describe('Max I-frames before ack (w)'),
    'select-timeout': z.number().int().min(1000).max(60000).default(10000).describe('Select-before-operate timeout'),
});

export type Iec60870104ServerConfig = z.infer<typeof Iec60870104ServerConfigSchema>;
