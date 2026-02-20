import {
    DialogTitle,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    MenuItem,
    Box,
    CircularProgress,
} from '@mui/material';
import { Close, Send, Terminal } from '@mui/icons-material';
import { useState } from 'react';
import { CommandAlertState } from './hooks/useCommandAlert';

export type CommandResponse = {
    statusCode: number;
    message?: string;
};

export type DataPointCommandDialogProps = {
    /** Device data/configuration */
    device: any;
    /** Resource/data point to send command to */
    deviceResource: any;
    /** Callback when dialog closes */
    onClose: () => void;
    /** Callback to show alert after command */
    setCommandAlert: (commandAlert: CommandAlertState) => void;
    /** Optional: Custom command sender function. If not provided, dialog will be disabled. */
    onSendCommand?: (device: any, resourceName: string, value: any) => Promise<CommandResponse>;
};

export const DataPointCommandDialog = ({
    device,
    deviceResource,
    onClose,
    setCommandAlert,
    onSendCommand,
}: DataPointCommandDialogProps): React.JSX.Element => {
    const [isFilled, setFilled] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    const isNumber = !['Bool', 'String'].includes(deviceResource?.properties?.valueType || '');
    const mapOptions = (options: string[]): React.JSX.Element[] =>
        options.map((option) => (
            <MenuItem key={option} value={option}>
                {option}
            </MenuItem>
        ));

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        // If no command sender provided, show error
        if (!onSendCommand) {
            setCommandAlert({
                showAlert: true,
                commandSuccessful: false,
                alertMessage: 'No command handler configured.',
            });
            onClose();
            return;
        }
        
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        try {
            const response = await onSendCommand(device, deviceResource.name, {
                [deviceResource.name]: formJson.commandValue,
            });
            let message = '';
            if (response.statusCode === 200) {
                message = `${deviceResource.name}: Command [${formJson.commandValue}] sent successfully.`;
            } else {
                const regexp = /err: ({.*})/g;
                const matches = [...response.message.matchAll(regexp)];
                if (matches) {
                    const errorMessage = JSON.parse(matches[0][1]).message as string; // Match 0, Capturing group 1
                    // Get the actual message after the "PUT: ", and remove the enclosing quotes. Replace escaped tabs with spaces.
                    const actualMessage = errorMessage
                        .substring(errorMessage.indexOf('PUT: ') + 6, errorMessage.length - 1)
                        .replace('\\t', ' ');
                    message = `${deviceResource.name}: Command [${formJson.commandValue}] resulted in error (response code: ${response.statusCode}): ${actualMessage}.`;
                } else {
                    message = `${deviceResource.name}: Command [${formJson.commandValue}] resulted in an unknown error (response code: ${response.statusCode}).`;
                }
            }
            setCommandAlert({
                showAlert: true,
                commandSuccessful: response.statusCode === 200,
                alertMessage: message,
            });
        } catch (e) {
            const errorMessage = e as string;
            const message = `${deviceResource.name}: Command [${formJson.commandValue}] failed: ${errorMessage}).`;
            setCommandAlert({ showAlert: true, commandSuccessful: false, alertMessage: message });
        }
        setSubmitting(false);
        onClose();
    };

    return (
        <Box
            sx={{ width: '296px', px: 3 }}
            component={'form'}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                void handleSubmit(event);
            }}
        >
            {isSubmitting && (
                <CircularProgress
                    color="secondary"
                    sx={{ position: 'absolute', top: '50%', left: '50%', ml: '-20px', mt: '-20px', zIndex: 1 }}
                />
            )}
            <DialogTitle>{deviceResource?.name || 'Command'}</DialogTitle>
            <TextField
                autoFocus
                required
                disabled={isSubmitting || !onSendCommand}
                id="commandValue"
                name="commandValue"
                variant="filled"
                label="Command"
                select={!isNumber}
                type={isNumber ? 'number' : undefined}
                defaultValue={!isNumber ? '' : undefined}
                fullWidth
                slotProps={{
                    htmlInput: {
                        step: deviceResource?.properties?.valueType === 'Float32' ? 'any' : undefined,
                    },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Terminal />
                            </InputAdornment>
                        ),
                    },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFilled(event.target.value.length > 0)}
            >
                {deviceResource?.properties?.valueType === 'Bool' && mapOptions(['true', 'false'])}
                {deviceResource?.properties?.valueType === 'String' && mapOptions(['OPEN', 'CLOSE', 'PULSE'])}
            </TextField>
            <DialogActions>
                <Button variant={'outlined'} startIcon={<Close />} onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={!isFilled || isSubmitting || !onSendCommand}
                    variant={'contained'}
                    disableElevation
                    startIcon={<Send />}
                    type="submit"
                >
                    Send
                </Button>
            </DialogActions>
        </Box>
    );
};
