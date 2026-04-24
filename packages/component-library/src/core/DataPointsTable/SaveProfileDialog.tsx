import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Typography,
    TextField,
    Box,
    useTheme,
    Stack,
    Alert,
} from '@mui/material';
import { SaveAlt, Share } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { DeviceConfiguration } from './schemas/DeviceConfigurationSchema';

type SaveProfileDialogProps = {
    open: boolean;
    onClose: () => void;
    onContinue: (saveToAll: boolean, newProfileName?: string) => void;
    currentDevice: DeviceConfiguration;
    otherDevices: DeviceConfiguration[];
    profileName: string;
    isSwappedProfile?: boolean;
};

export const SaveProfileDialog = ({
    open,
    onClose,
    onContinue,
    otherDevices,
    profileName,
    isSwappedProfile = false,
}: SaveProfileDialogProps): JSX.Element => {
    const [saveOption, setSaveOption] = useState<'all' | 'single'>('all');
    const [newProfileName, setNewProfileName] = useState('');
    const [nameError, setNameError] = useState<string | null>(null);

    // Set default new profile name when dialog opens
    useEffect(() => {
        if (open) {
            const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '_');
            setNewProfileName(`${profileName}_${currentDate}`);
            setNameError(null);
            setSaveOption('all');
        }
    }, [open, profileName]);

    const handleContinue = (): void => {
        if (saveOption === 'single') {
            if (!newProfileName.trim()) {
                setNameError('Profile name is required');
                return;
            }
            if (newProfileName === profileName) {
                setNameError('New profile name must be different from the original');
                return;
            }
        }

        onContinue(saveOption === 'all', saveOption === 'single' ? newProfileName : undefined);
    };

    const totalDeviceCount = otherDevices.length + 1;
    const otherDeviceCount = otherDevices.length;
    const firstOtherDeviceName = otherDevices[0]?.name;
    const remainingDevicesText =
        otherDeviceCount > 1 ? ` and ${otherDeviceCount - 1} other device${otherDeviceCount > 2 ? 's' : ''}` : '';

    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            sx={{ '& .MuiPaper-root': { background: theme.palette.background.paper } }}
        >
            <DialogTitle>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h6">
                        {isSwappedProfile
                            ? 'Apply changes to the selected profile?'
                            : 'Apply changes to similar devices?'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        <strong>{firstOtherDeviceName}</strong>
                        {remainingDevicesText} {otherDeviceCount === 1 ? 'is' : 'are'} also using the device profile "
                        <strong>{profileName}</strong>".
                        {saveOption === 'all' && (
                            <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                                {' '}
                                Your changes will affect {otherDeviceCount === 1 ? 'this device' : 'these devices'} as
                                well.
                            </Alert>
                        )}
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={saveOption} onChange={(e) => setSaveOption(e.target.value as 'all' | 'single')}>
                        <FormControlLabel
                            value="all"
                            control={<Radio />}
                            label={
                                <Box sx={{ ml: 1 }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        {isSwappedProfile
                                            ? 'Apply changes and switch to this profile'
                                            : 'Apply changes to all similar devices'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        This will update all {totalDeviceCount} device{totalDeviceCount > 1 ? 's' : ''}{' '}
                                        using the device profile "<strong>{profileName}</strong>".
                                    </Typography>
                                </Box>
                            }
                            sx={{ alignItems: 'flex-start', mb: 2 }}
                        />

                        <FormControlLabel
                            value="single"
                            control={<Radio />}
                            label={
                                <Box sx={{ ml: 1, width: '100%' }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        Apply changes to only this device
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        This will create a new device profile based on your modifications.
                                    </Typography>

                                    <TextField
                                        variant="filled"
                                        label="New Device Profile Name"
                                        value={newProfileName}
                                        onChange={(e) => {
                                            setNewProfileName(e.target.value);
                                            setNameError(null);
                                        }}
                                        error={!!nameError}
                                        helperText={nameError}
                                        fullWidth
                                        required={saveOption === 'single'}
                                        disabled={saveOption !== 'single'}
                                        sx={{ mt: 1 }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Box>
                            }
                            sx={{ alignItems: 'flex-start' }}
                        />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleContinue}
                        variant="contained"
                        color="primary"
                        startIcon={saveOption === 'all' ? <Share /> : <SaveAlt />}
                    >
                        {saveOption === 'all' ? 'Apply to All Devices' : 'Apply to This Device'}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
