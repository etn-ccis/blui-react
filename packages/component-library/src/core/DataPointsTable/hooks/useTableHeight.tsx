import { useRef, useState, useEffect } from 'react';

export const useTableHeight = (
    isPending: boolean
): { tableContainerRef: React.RefObject<HTMLDivElement>; minHeight: number | undefined; captureHeight: () => void } => {
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [minHeight, setMinHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!isPending && minHeight !== undefined) {
            const timer = setTimeout(() => {
                setMinHeight(undefined);
            }, 50);
            return (): void => clearTimeout(timer);
        }
    }, [isPending, minHeight]);

    const captureHeight = (): void => {
        if (tableContainerRef.current) {
            const currentHeight = tableContainerRef.current.offsetHeight;
            setMinHeight(currentHeight);
        }
    };

    return { tableContainerRef, minHeight, captureHeight };
};
