import { useRef, useEffect } from 'react';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export const usePrevious = <T extends {}>(value: T): T | undefined => {
    const ref = useRef<T>();

    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
};
