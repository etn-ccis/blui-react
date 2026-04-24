
/* eslint-disable */
/* prettier-ignore-file */
// @ts-nocheck
import z from 'zod';
import {
    ProtocolType,
    DeviceProtocol,
    DeviceProtocolData,
    Dnp3ClientProtocolSchema,
    Dnp3ServerProtocolSchema,
    Iec60870104ClientProtocolSchema,
    Iec60870104ServerProtocolSchema,
    Iec61850MmsClientProtocolSchema,
    ModbusClientProtocolSchema,
} from '../DataPointsTable/schemas/ProtocolSchemas';
import {
    Dnp3ClientResourcePropertiesConstraints,
    Dnp3ClientResourceSchema,
} from '../DataPointsTable/schemas/DeviceResources/Dnp3ClientResourceSchema';
import {
    Dnp3ServerResourcePropertiesConstraints,
    Dnp3ServerResourceSchema,
} from '../DataPointsTable/schemas/DeviceResources/Dnp3ServerResourceSchema';
import {
    Iec60870104ClientResourcePropertiesConstraints,
    Iec60870104ClientResourceSchema,
} from '../DataPointsTable/schemas/DeviceResources/Iec60870104ClientResourceSchema';
import {
    Iec60870104ServerResourcePropertiesConstraints,
    Iec60870104ServerResourceSchema,
} from '../DataPointsTable/schemas/DeviceResources/Iec60870104ServerResourceSchema';
import {
    Iec61850MmsClientResourcePropertiesConstraints,
    Iec61850MmsClientResourceSchema,
} from '../DataPointsTable/schemas/DeviceResources/Iec61850MmsClientResourceSchema';
import {
    ModbusClientResourcePropertiesConstraints,
    ModbusClientResourceSchema,
} from '../DataPointsTable/schemas/DeviceResources/ModbusClientResourceSchema';
import { TypeConstraintsMap } from '../DataPointsTable/schemas/DeviceResources/ResourcePropertiesValidator';

export type ProtocolResourceSchema =
    | typeof Dnp3ClientResourceSchema
    | typeof Dnp3ServerResourceSchema
    | typeof ModbusClientResourceSchema
    | typeof Iec60870104ClientResourceSchema
    | typeof Iec60870104ServerResourceSchema
    | typeof Iec61850MmsClientResourceSchema;

type ProtocolDefinition = {
    name: string;
    resourceSchema: ProtocolResourceSchema;
    resourcePropertiesConstraints: TypeConstraintsMap;
    configSchema: z.ZodObject;
};

export class ProtocolRegistry {
    private static readonly protocols: Record<ProtocolType, ProtocolDefinition> = {
        'dnp3-client': {
            name: 'DNP3 Client',
            resourceSchema: Dnp3ClientResourceSchema,
            resourcePropertiesConstraints: Dnp3ClientResourcePropertiesConstraints,
            configSchema: Dnp3ClientProtocolSchema,
        },
        'dnp3-server': {
            name: 'DNP3 Server',
            resourceSchema: Dnp3ServerResourceSchema,
            resourcePropertiesConstraints: Dnp3ServerResourcePropertiesConstraints,
            configSchema: Dnp3ServerProtocolSchema,
        },
        'modbus-client': {
            name: 'Modbus Client',
            resourceSchema: ModbusClientResourceSchema,
            resourcePropertiesConstraints: ModbusClientResourcePropertiesConstraints,
            configSchema: ModbusClientProtocolSchema,
        },
        'iec60870-104-client': {
            name: 'IEC 60870-104 Client',
            resourceSchema: Iec60870104ClientResourceSchema,
            resourcePropertiesConstraints: Iec60870104ClientResourcePropertiesConstraints,
            configSchema: Iec60870104ClientProtocolSchema,
        },
        'iec60870-104-server': {
            name: 'IEC 60870-104 Server',
            resourceSchema: Iec60870104ServerResourceSchema,
            resourcePropertiesConstraints: Iec60870104ServerResourcePropertiesConstraints,
            configSchema: Iec60870104ServerProtocolSchema,
        },
        'iec61850-mms-client': {
            name: 'IEC 61850 MMS Client',
            resourceSchema: Iec61850MmsClientResourceSchema,
            resourcePropertiesConstraints: Iec61850MmsClientResourcePropertiesConstraints,
            configSchema: Iec61850MmsClientProtocolSchema,
        },
        '': {
            name: 'Unknown Protocol',
            resourceSchema: {} as ProtocolResourceSchema,
            resourcePropertiesConstraints: {},
            configSchema: {} as z.ZodObject,
        },
    };

    static getName(type: ProtocolType): string {
        return this.protocols[type].name;
    }

    static getResourceSchema(type: ProtocolType): ProtocolResourceSchema {
        return this.protocols[type].resourceSchema;
    }

    static getResourcePropertiesConstraints(type: ProtocolType): TypeConstraintsMap {
        return this.protocols[type].resourcePropertiesConstraints;
    }

    static getConfigSchema(type: ProtocolType): z.ZodObject {
        return this.protocols[type].configSchema;
    }

    // Extract protocol type from DeviceProtocol union
    static getType(protocols: DeviceProtocol): ProtocolType {
        return Object.keys(protocols)[0] as ProtocolType;
    }

    static getProtocolCategory(type: ProtocolType): 'client' | 'server' | 'unknown' {
        switch (type) {
            case 'dnp3-client':
            case 'modbus-client':
            case 'iec60870-104-client':
            case 'iec61850-mms-client':
                return 'client';
            case 'dnp3-server':
            case 'iec60870-104-server':
                return 'server';
            default:
                return 'unknown';
        }
    }

    static extract(protocols: DeviceProtocol): {
        type: ProtocolType;
        data: DeviceProtocolData;
        definition: ProtocolDefinition;
    } {
        const type = this.getType(protocols);
        const data = type
            ? (protocols[type as keyof DeviceProtocol] as DeviceProtocolData)
            : ({} as DeviceProtocolData);
        const definition = this.protocols[type];

        return { type, data, definition };
    }
}
