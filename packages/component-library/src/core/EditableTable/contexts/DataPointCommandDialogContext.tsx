import { Dialog, DialogProps } from '@mui/material';
import { createContext, PropsWithChildren, useContext, useState, useRef } from 'react';

type DataPointCommandDialogOption = Omit<DialogProps, 'open'>;

type DataPointCommandDialogProviderContext = readonly [(option: DataPointCommandDialogOption) => void, () => void];

const DataPointCommandDialogContext = createContext<DataPointCommandDialogProviderContext>(
    null as unknown as DataPointCommandDialogProviderContext
);

type DialogContainerProps = DialogProps & {
    closeDialog: (data?: any) => void;
};

const DialogContainer = ({ children, closeDialog, ...props }: PropsWithChildren<DialogContainerProps>): React.JSX.Element => (
    <Dialog {...props} onClose={closeDialog}>
        {children}
    </Dialog>
);

export const DataPointCommandDialogProvider = ({ children }: PropsWithChildren<object>): React.JSX.Element => {
    const [dialogs, setDialogs] = useState<DialogProps[]>([]);
    const createDialog = (option: DataPointCommandDialogOption): void => {
        const dialog = { ...option, open: true };
        setDialogs((existingDialogs) => [...existingDialogs, dialog]);
    };
    const closeDialog = (): void => {
        setDialogs((existingDialogs) => {
            existingDialogs.pop();
            return [...existingDialogs];
        });
    };

    const contextValue = useRef([createDialog, closeDialog] as const);
    return (
        <DataPointCommandDialogContext.Provider value={contextValue.current}>
            {children}
            {dialogs.map((dialog, i) => {
                const { children: dialogChildren, ...dialogParams } = dialog;
                return (
                    <DialogContainer key={i} closeDialog={closeDialog} {...dialogParams}>
                        {dialogChildren}
                    </DialogContainer>
                );
            })}
        </DataPointCommandDialogContext.Provider>
    );
};

export const useDataPointCommandDialog = (): DataPointCommandDialogProviderContext => {
    const result = useContext(DataPointCommandDialogContext);
    if (!result) {
        throw new Error('DataPointCommandDialog context is only available inside its provider');
    }
    return result;
};
