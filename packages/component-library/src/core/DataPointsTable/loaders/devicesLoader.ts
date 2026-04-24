import { DeviceConfiguration } from '../schemas/DeviceConfigurationSchema';

export type DeviceInstance = {
    device: DeviceConfiguration;
    isOnline: boolean;
    lastSeen?: number;
};

/**
 * Stub loader for devices.
 * In production, this would load device data from a route loader or API.
 */
export async function devicesLoader(): Promise<DeviceInstance[]> {
    console.warn('devicesLoader is a stub - implement actual loader');
    return [];
}

export async function deviceLoader(deviceId: string): Promise<DeviceInstance | null> {
    console.warn('deviceLoader is a stub - implement actual loader');
    return null;
}
