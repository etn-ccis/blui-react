import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { CommandAlertState } from './hooks/useCommandAlert';
import { JSX } from 'react';

type CommandAlertSnackbarProps = {
    commandAlert: CommandAlertState;
    onClose: () => void;
};

export const CommandAlertSnackbar = ({ commandAlert, onClose }: CommandAlertSnackbarProps): JSX.Element => (
    <Snackbar
        open={commandAlert.showAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={onClose}
    >
        <Alert onClose={onClose} severity={commandAlert.commandSuccessful ? 'success' : 'error'} variant="filled">
            <AlertTitle>{commandAlert.commandSuccessful ? 'Success' : 'Error!'}</AlertTitle>
            {commandAlert.alertMessage}
        </Alert>
    </Snackbar>
);
