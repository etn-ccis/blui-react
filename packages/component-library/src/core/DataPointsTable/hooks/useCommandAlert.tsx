import { useState, useCallback } from 'react';

export type CommandAlertState = {
    showAlert: boolean;
    commandSuccessful: boolean;
    alertMessage: string;
};

const defaultCommandAlertState: CommandAlertState = {
    showAlert: false,
    commandSuccessful: true,
    alertMessage: '',
};

export const useCommandAlert = (): {
    commandAlert: CommandAlertState;
    setCommandAlert: React.Dispatch<React.SetStateAction<CommandAlertState>>;
    closeAlert: () => void;
} => {
    const [commandAlert, setCommandAlert] = useState<CommandAlertState>(defaultCommandAlertState);

    const closeAlert = useCallback(() => {
        setCommandAlert((prev) => ({ ...prev, showAlert: false }));
    }, []);

    return {
        commandAlert,
        setCommandAlert,
        closeAlert,
    };
};
