/**
 * EdgeX types for data point values and events
 */

export type SmpValueQuality = 
    | 'GOOD'
    | 'INVALID'
    | 'QUESTIONABLE'
    | 'OVERFLOW'
    | 'OUT_OF_RANGE'
    | 'BAD_REFERENCE'
    | 'OSCILLATORY'
    | 'FAILURE'
    | 'OLD_DATA'
    | 'INCONSISTENT'
    | 'INACCURATE'
    | 'COMM_FAILURE';

export type EventReading = {
    id?: string;
    origin: number;
    deviceName: string;
    resourceName: string;
    profileName: string;
    valueType: string;
    value: string;
    binaryValue?: string;
    mediaType?: string;
    units?: string;
};

export type EventResponse = {
    apiVersion?: string;
    event: {
        id: string;
        deviceName: string;
        profileName: string;
        sourceName: string;
        origin: number;
        readings: EventReading[];
        tags?: Record<string, string>;
    };
};

export type DeviceReading = {
    resourceName: string;
    value: string | number | boolean;
    quality?: SmpValueQuality[];
    timestamp?: number;
};
