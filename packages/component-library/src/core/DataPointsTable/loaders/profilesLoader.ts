import { DeviceProfile } from '../schemas/DeviceProfileSchema';
import { ProtocolType } from '../schemas/ProtocolSchemas';

/**
 * Stub loader for profiles.
 * In production, this would load profile data from a route loader or API.
 */
export async function profilesLoader(): Promise<DeviceProfile[]> {
    console.warn('profilesLoader is a stub - implement actual loader');
    return [];
}

export async function profileLoader(profileName: string): Promise<DeviceProfile | null> {
    console.warn('profileLoader is a stub - implement actual loader');
    return null;
}

/**
 * Get a human-readable label for a protocol type
 */
export function getProtocolLabel(protocolType: ProtocolType): string {
    const labels: Record<ProtocolType, string> = {
        'dnp3-client': 'DNP3 Client',
        'dnp3-server': 'DNP3 Server',
        'modbus-client': 'Modbus Client',
        'iec60870-104-client': 'IEC 60870-104 Client',
        'iec60870-104-server': 'IEC 60870-104 Server',
        'iec61850-mms-client': 'IEC 61850 MMS Client',
        '': 'Unknown',
    };
    return labels[protocolType] || protocolType;
}
