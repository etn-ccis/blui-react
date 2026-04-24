import { DeviceConfiguration } from '../schemas/DeviceConfigurationSchema';
import { DeviceProfile, DeviceResource } from '../schemas/DeviceProfileSchema';

export type MultiStatusResponse = {
    statusCode: number;
    message?: string;
};

export type CommandEventResponse = {
    event?: {
        readings?: Array<{
            resourceName: string;
            value: string;
            valueType: string;
        }>;
    };
};

/**
 * EdgeX API client stub.
 * This is a placeholder implementation that should be replaced with actual API calls
 * in your application.
 */
export class EdgeXAPI {
    /**
     * Get a device profile by name
     */
    static async getDeviceProfile(name: string, silent?: boolean): Promise<DeviceProfile | null> {
        console.warn('EdgeXAPI.getDeviceProfile is a stub - implement actual API call');
        return null;
    }

    /**
     * Get all device profiles
     */
    static async getAllDeviceProfiles(): Promise<DeviceProfile[]> {
        console.warn('EdgeXAPI.getAllDeviceProfiles is a stub - implement actual API call');
        return [];
    }

    /**
     * Get devices using a specific profile
     */
    static async getDevicesForDeviceProfile(profileName: string): Promise<DeviceConfiguration[]> {
        console.warn('EdgeXAPI.getDevicesForDeviceProfile is a stub - implement actual API call');
        return [];
    }

    /**
     * Post/create a new profile
     */
    static async postProfile(profile: DeviceProfile): Promise<MultiStatusResponse[]> {
        console.warn('EdgeXAPI.postProfile is a stub - implement actual API call');
        return [{ statusCode: 201 }];
    }

    /**
     * Put/update an existing profile
     */
    static async putProfile(profile: DeviceProfile): Promise<MultiStatusResponse[]> {
        console.warn('EdgeXAPI.putProfile is a stub - implement actual API call');
        return [{ statusCode: 200 }];
    }

    /**
     * Patch device's profile name
     */
    static async patchDeviceProfileName(device: DeviceConfiguration, profile: DeviceProfile): Promise<void> {
        console.warn('EdgeXAPI.patchDeviceProfileName is a stub - implement actual API call');
    }

    /**
     * Get command event (read value from device)
     */
    static async getCommandEvent(device: DeviceConfiguration, resourceName: string): Promise<CommandEventResponse> {
        console.warn('EdgeXAPI.getCommandEvent is a stub - implement actual API call');
        return {};
    }

    /**
     * Put command event (write value to device)
     */
    static async putCommandEvent(
        device: DeviceConfiguration,
        resourceName: string,
        value: Record<string, unknown>
    ): Promise<{ statusCode: number }> {
        console.warn('EdgeXAPI.putCommandEvent is a stub - implement actual API call');
        return { statusCode: 200 };
    }
}

/**
 * Handle multi-status response errors
 */
export function handleMultiStatusErrors(responses: MultiStatusResponse[]): void {
    const errors = responses.filter((r) => r.statusCode >= 400);
    if (errors.length > 0) {
        throw new Error(errors.map((e) => e.message || `Error ${e.statusCode}`).join(', '));
    }
}

export default EdgeXAPI;
