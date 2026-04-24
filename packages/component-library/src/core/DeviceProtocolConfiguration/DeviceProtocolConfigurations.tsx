import { Box, Button, Snackbar, Stack, useTheme } from '@mui/material';
import { DeviceInstance } from '../DataPointsTable/loaders/devicesLoader';
import { useRef, useState } from 'react';
import { Spacer } from '@brightlayer-ui/react-components';
import { Download, Save } from '@mui/icons-material';
import { ProtocolConfigurations, ProtocolConfigurationsRef } from './ProtocolConfigurations';
import EdgeXAPI, { handleMultiStatusErrors } from '../DataPointsTable/api/EdgeXAPI';
import { FieldErrors } from 'react-hook-form';
import { DeviceProtocol, DeviceProtocolData } from '../DataPointsTable/schemas/ProtocolSchemas';
import { useRouter } from '@tanstack/react-router';

type DeviceProtocolConfigurationsProps = {
    deviceInstance: DeviceInstance;
};

type FormSnackBarState = {
    open: boolean;
    message: string;
    color: 'error' | 'success';
};

export const DeviceProtocolConfigurations = (props: DeviceProtocolConfigurationsProps): JSX.Element => {
    const theme = useTheme();
    const { deviceInstance } = props;
    const protocols = props.deviceInstance.device.protocols;
    const protocolConfigRef = useRef<ProtocolConfigurationsRef>(null);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [hasErrors, setHasErrors] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<FormSnackBarState>({ open: false, message: '', color: 'success' });
    // const [search, setSearch] = useState<string>('');
    const router = useRouter();

    const handleSave = (): void => {
        if (protocolConfigRef.current) {
            protocolConfigRef.current.submit();
        }
    };
    const handleDataChange = (
        data: DeviceProtocolData,
        isDirty: boolean,
        errors: FieldErrors<DeviceProtocolData>
    ): void => {
        setHasChanges(isDirty);
        setHasErrors(Object.keys(errors).length > 0);
    };

    const handleProtocolSubmit = async (data: DeviceProtocol): Promise<void> => {
        try {
            handleMultiStatusErrors(await EdgeXAPI.patchDeviceProtocols(deviceInstance.device, data));
            setHasChanges(false);
            setSnackbar({ open: true, message: 'Changes saved', color: 'success' });
            // Invalidate the router cache to make sure we get the correct data on
            // navigation after a save
            void router.invalidate();
        } catch (error) {
            const errorMessage = (error as Error).message || 'Error saving changes';
            setSnackbar({ open: true, message: errorMessage, color: 'error' });
        }
    };

    const downloadConfig = (): void => {
        const link = document.createElement('a');
        link.href = `data:text/json;charset=UTF-8,${encodeURIComponent(JSON.stringify(deviceInstance.device, null, 2))}`;
        link.download = `${deviceInstance.device.name}.json`;
        link.click();
    };

    return (
        <Stack direction="column" spacing={2}>
            <Box sx={{ p: 2, pb: 0, display: 'flex', alignItems: 'center' }}>
                {/* <TextField
                    label="Search"
                    variant="standard"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        },
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                /> */}
                <Spacer />
                <Button
                    variant={'outlined'}
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{
                        mr: 1,
                    }}
                    disabled={!hasChanges || hasErrors}
                >
                    Save
                </Button>
                <Button variant={'outlined'} startIcon={<Download />} onClick={downloadConfig}>
                    Download Protocol Configuration
                </Button>
            </Box>
            <Box
                sx={{
                    width: 768,
                    height: 'fit-content',
                    p: 2,
                    pt: 0,
                }}
            >
                <ProtocolConfigurations
                    ref={protocolConfigRef}
                    protocols={protocols}
                    onSubmit={handleProtocolSubmit}
                    onDataChange={handleDataChange}
                />
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={snackbar.open}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                autoHideDuration={4000}
                message={snackbar.message}
                slotProps={{
                    content: {
                        sx: {
                            '& .MuiSnackbarContent-message': {
                                color: theme.palette.text.primary,
                            },
                            backgroundColor:
                                snackbar.color === 'error' ? theme.palette.error.dark : theme.palette.success.dark,
                        },
                    },
                }}
            />
        </Stack>
    );
};
