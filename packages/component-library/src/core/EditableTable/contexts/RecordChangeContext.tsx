import { createContext, useContext, ReactNode, useRef, useEffect } from 'react';

type RecordChangeContextType = {
    recordChange: (fieldPath: string) => void;
};

const RecordChangeContext = createContext<RecordChangeContextType | null>(null);

export const useRecordChange = (): RecordChangeContextType => {
    const context = useContext(RecordChangeContext);
    if (!context) {
        throw new Error('useRecordChange must be used within a RecordChangeProvider');
    }
    return context;
};

type RecordChangeProviderProps = {
    recordChange: (fieldPath: string) => void;
    children: ReactNode;
};

export const RecordChangeProvider = ({ recordChange, children }: RecordChangeProviderProps): React.JSX.Element => {
    // Store recordChange in a ref so it doesn't cause re-renders when it changes
    const recordChangeRef = useRef(recordChange);

    useEffect(() => {
        recordChangeRef.current = recordChange;
    }, [recordChange]);

    // Create a stable wrapper function
    const stableRecordChange = useRef((fieldPath: string) => {
        recordChangeRef.current(fieldPath);
    }).current;

    const value = { recordChange: stableRecordChange };

    return <RecordChangeContext.Provider value={value}>{children}</RecordChangeContext.Provider>;
};
