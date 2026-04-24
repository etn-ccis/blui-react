import { z } from 'zod';

// IEC 60870-5-104 Client configuration schema
export const Iec60870104ClientConfigSchema = z.object({
    'common-address': z.number().int().min(1).max(65534).default(1).describe('Common ASDU address'),
    'originator-address': z.number().int().min(0).max(255).default(0).describe('Originator address'),
    'delay-t1': z.number().int().min(1000).max(255000).default(15000).describe('T1 timeout (send/receive) in ms'),
    'delay-t2': z.number().int().min(1000).max(255000).default(10000).describe('T2 timeout (ack) in ms'),
    'delay-t3': z.number().int().min(1000).max(172800000).default(20000).describe('T3 timeout (test frame) in ms'),
    'max-k': z.number().int().min(1).max(32767).default(12).describe('Max unacknowledged I-frames (k)'),
    'max-w': z.number().int().min(1).max(32767).default(8).describe('Max I-frames before ack (w)'),
    'gi-interval': z.number().int().min(0).default(0).describe('General interrogation interval in ms (0=disabled)'),
});

export type Iec60870104ClientConfig = z.infer<typeof Iec60870104ClientConfigSchema>;
