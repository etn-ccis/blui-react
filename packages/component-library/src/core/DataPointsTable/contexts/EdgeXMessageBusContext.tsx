// @ts-nocheck
import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { EventResponse, DeviceReading } from '../types/EdgeX';

type MessageHandler = (event: EventResponse) => void;

type EdgeXMessageBusContextValue = {
    isConnected: boolean;
    subscribe: (deviceName: string, handler: MessageHandler) => () => void;
    lastReading: (deviceName: string, resourceName: string) => DeviceReading | undefined;
};

const EdgeXMessageBusContext = createContext<EdgeXMessageBusContextValue | null>(null);

type EdgeXMessageBusProviderProps = {
    children: ReactNode;
};

/**
 * Stub provider for EdgeX message bus functionality.
 * In production, this would connect to an MQTT broker or similar
 * to receive real-time device readings.
 */
export const EdgeXMessageBusProvider = ({ children }: EdgeXMessageBusProviderProps): JSX.Element => {
    const [readings] = useState<Map<string, DeviceReading>>(new Map());

    const subscribe = useCallback((_deviceName: string, _handler: MessageHandler) => {
        // Stub implementation - return unsubscribe function
        return () => {};
    }, []);

    const lastReading = useCallback(
        (deviceName: string, resourceName: string) => {
            return readings.get(`${deviceName}:${resourceName}`);
        },
        [readings]
    );

    const value = useMemo(
        () => ({
            isConnected: false,
            subscribe,
            lastReading,
        }),
        [subscribe, lastReading]
    );

    return <EdgeXMessageBusContext.Provider value={value}>{children}</EdgeXMessageBusContext.Provider>;
};

export const useEdgeXMessageBus = (): EdgeXMessageBusContextValue => {
    const context = useContext(EdgeXMessageBusContext);
    if (!context) {
        // Return a stub context if not within provider
        return {
            isConnected: false,
            subscribe: () => () => {},
            lastReading: () => undefined,
        };
    }
    return context;
};
