import { Spacer } from '@brightlayer-ui/react-components';
import { AddCircle, CheckCircle, Download, Redo, RestartAlt, SwapHorizontalCircle, Undo } from '@mui/icons-material';
import {
    Button,
    Stack,
    Snackbar,
    Alert,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useTheme,
    Divider,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceInstance } from './loaders/devicesLoader';
import { DataPointsTable } from './DataPointsTable';
import { DataPointCommandDialogProvider } from './contexts/DataPointCommandDialogContext';
import { FormStateManager, useFormStateManager } from './hooks/useFormStateManager';
import { SaveProfileDialog } from './SaveProfileDialog';
import EdgeXAPI, { handleMultiStatusErrors } from './api/EdgeXAPI';
import { DeviceProfile } from './schemas/DeviceProfileSchema';
import { DeviceConfiguration } from './schemas/DeviceConfigurationSchema';
import { useBlocker, useRouter } from '@tanstack/react-router';
import { ProfileSelector } from './ProfileSelector';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

type DeviceDetailsDataPointsProps = {
    deviceInstance?: DeviceInstance;
    newDevice?: boolean;
    onFormStateReady?: (state: FormStateManager) => void;
    // Callback when save completes successfully (for wizard integration)
    onSaveComplete?: (savedProfile: DeviceProfile) => void;
    // Initial profile state (for wizard integration)
    initialProfileState?: ProfileState;
};

export type ProfileState = {
    type: 'original' | 'swapped' | 'uploaded' | 'replaced' | 'created';
    profile: DeviceProfile;
};

export type SaveStrategy =
    | { type: 'update-existing'; profile: DeviceProfile }
    | { type: 'create-new'; profile: DeviceProfile }
    | { type: 'create-and-assign'; profile: DeviceProfile; newName?: string }
    | { type: 'swap-profile'; profile: DeviceProfile };

/**
 * Determines the save strategy based on profile state, dirty status, and other devices using the profile.
 * @param profileState The current state of the profile (original, created, uploaded, replaced, swapped).
 * @param isDirty Whether the profile has unsaved changes.
 * @param otherDevicesCount The number of other devices using the profile.
 * @param newDevice Whether this is a new device being created.
 * @returns The determined save strategy, or null if user input is needed.
 */
const determineSaveStrategy = (
    profileState: ProfileState,
    isDirty: boolean,
    otherDevicesCount: number,
    newDevice: boolean
): SaveStrategy | null => {
    switch (profileState.type) {
        // Original profile in use
        case 'original':
            // No changes made
            if (!isDirty) return null;
            // Changes made - check if other devices use the profile
            if (otherDevicesCount > 0) {
                // Need to prompt user: update all or create new
                return null; // Null indicates user input needed (no automatic strategy)
            }
            // No other devices - safe to update existing
            return { type: 'update-existing', profile: profileState.profile };

        // Newly created profile
        case 'created':
            // Always create and assign for new profiles
            return { type: 'create-and-assign', profile: profileState.profile };

        // Uploaded profile that doesn't replace an existing one
        case 'uploaded':
            if (newDevice) {
                // For new devices (wizard), always create and assign
                return { type: 'create-and-assign', profile: profileState.profile };
            }
            // For existing devices, always require dialog for uploads to confirm assignment
            return null; // Null indicates user input needed (no automatic strategy)

        // Replaced existing profile
        case 'replaced':
            // Check if other devices use the original profile
            if (otherDevicesCount > 0) {
                // Need to prompt user: update all or create new
                return null; // Null indicates user input needed (no automatic strategy)
            }
            // No other devices - safe to update existing
            return { type: 'update-existing', profile: profileState.profile };

        // Swapped to an existing profile
        case 'swapped':
            // For new devices (wizard), just swap without dialog
            if (newDevice) {
                if (isDirty) {
                    // Swapped with changes - need to update the profile
                    return { type: 'update-existing', profile: profileState.profile };
                }
                // Swapped without changes - just switch the profile
                return { type: 'swap-profile', profile: profileState.profile };
            }
            // For existing devices, always require dialog to confirm swap, even without changes
            return null; // Null indicates user input needed (no automatic strategy)
        default:
            return null;
    }
};

export const DeviceDetailsDataPoints = ({
    deviceInstance,
    newDevice = false,
    onFormStateReady,
    onSaveComplete,
    initialProfileState,
}: DeviceDetailsDataPointsProps): JSX.Element => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showAssignProfileDialog, setShowAssignProfileDialog] = useState(false);
    const [otherDevices, setOtherDevices] = useState<DeviceConfiguration[]>([]);

    const [profileState, setProfileState] = useState<ProfileState>(
        () =>
            initialProfileState ??
            (deviceInstance?.profile
                ? { type: 'original', profile: deviceInstance.profile }
                : { type: 'created', profile: {} as DeviceProfile })
    );

    // Promise resolver for external save trigger
    const saveResolverRef = useRef<((success: boolean) => void) | null>(null);

    const [registerFormState, formState] = useFormStateManager(onFormStateReady);

    const router = useRouter();
    const theme = useTheme();

    const handleProfileSelection = useCallback((profile: DeviceProfile, selectionType: ProfileState['type']) => {
        setProfileState({ type: selectionType, profile });
    }, []);

    const executeSaveStrategy = useCallback(
        async (strategy: SaveStrategy) => {
            if (!formState || !deviceInstance) {
                saveResolverRef.current?.(false);
                saveResolverRef.current = null;
                return;
            }

            setIsSaving(true);
            setSaveError(null);
            setShowSaveDialog(false);
            setShowAssignProfileDialog(false);

            try {
                const formData = formState.getValues();
                const finalProfile: DeviceProfile = {
                    ...strategy.profile,
                    name:
                        strategy.type === 'create-and-assign' && strategy.newName
                            ? strategy.newName
                            : strategy.profile.name,
                    deviceResources: formData.deviceResources,
                };

                switch (strategy.type) {
                    case 'create-and-assign': {
                        const newProfile = { ...finalProfile, id: undefined };
                        try {
                            // for sunspec modbus discovery, the profile arrives with a name, so we need to check if it exists before trying to create
                            await EdgeXAPI.getDeviceProfile(newProfile.name, true);
                        } catch {
                            handleMultiStatusErrors(await EdgeXAPI.postProfile(newProfile));
                        }

                        if (!newDevice) {
                            await EdgeXAPI.patchDeviceProfileName(deviceInstance.device, finalProfile);
                        }
                        break;
                    }
                    case 'update-existing': {
                        handleMultiStatusErrors(await EdgeXAPI.putProfile(finalProfile));
                        break;
                    }
                    case 'swap-profile': {
                        if (!newDevice) {
                            await EdgeXAPI.patchDeviceProfileName(deviceInstance.device, finalProfile);
                        }
                        break;
                    }
                    default:
                        break;
                }

                setSaveSuccess(true);
                formState.reset(formData);
                setProfileState({ type: 'original', profile: finalProfile });
                onSaveComplete?.(finalProfile);
                saveResolverRef.current?.(true);

                if (!newDevice) {
                    void router.invalidate();
                }
            } catch (error) {
                console.error('Failed to save device profile:', error);
                setSaveError(error instanceof Error ? error.message : 'Failed to save changes to device');
                saveResolverRef.current?.(false);
            } finally {
                setIsSaving(false);
                saveResolverRef.current = null;
            }
        },
        [deviceInstance, formState, router, newDevice, onSaveComplete]
    );

    const handleSaveToDevice = useCallback(async () => {
        if (!formState || !deviceInstance) return;

        const isDirty = formState.isDirty;

        const profileToCheck = profileState.profile;

        try {
            // Check if other devices use this profile
            const devicesResponse = await EdgeXAPI.getDevicesForDeviceProfile(profileToCheck);
            const otherDevicesUsingProfile = devicesResponse.devices.filter(
                (d) => d.name !== deviceInstance.device.name
            );

            const strategy = determineSaveStrategy(profileState, isDirty, otherDevicesUsingProfile.length, newDevice);

            if (!strategy) {
                // Need user input - show appropriate dialog
                if (profileState.type === 'swapped') {
                    // For swapped profiles, check if we need the save dialog (when dirty and used by others)
                    // or just the assign dialog (when clean or no other devices)
                    if (isDirty && otherDevicesUsingProfile.length > 0) {
                        setOtherDevices(otherDevicesUsingProfile);
                        setShowSaveDialog(true);
                    } else {
                        setShowAssignProfileDialog(true);
                    }
                    // When replacing, we always have either a strategy (so we don't get here), need the save dialog (condition below),
                    // or have nothing to save (so we resolve immediately)
                } else if (otherDevicesUsingProfile.length > 0 && isDirty) {
                    // Original profile with changes and other devices using it
                    setOtherDevices(otherDevicesUsingProfile);
                    setShowSaveDialog(true);
                } else if (profileState.type === 'created' || profileState.type === 'uploaded') {
                    setShowAssignProfileDialog(true);
                } else if (!isDirty) {
                    // Nothing to save
                    saveResolverRef.current?.(true);
                    saveResolverRef.current = null;
                }
                return;
            }

            await executeSaveStrategy(strategy);
        } catch (error) {
            console.error('Failed to check devices using profile:', error);
            setSaveError('Failed to check devices using this profile');
        }
    }, [deviceInstance, formState, profileState, executeSaveStrategy, newDevice]);

    // Trigger save from external source (wizard)
    const triggerSave = useCallback(
        (): Promise<boolean> =>
            new Promise((resolve) => {
                saveResolverRef.current = resolve;
                void handleSaveToDevice();
            }),
        [handleSaveToDevice]
    );

    const handleDialogContinue = useCallback(
        (saveToAll: boolean, newProfileName?: string) => {
            const strategy: SaveStrategy = saveToAll
                ? { type: 'update-existing', profile: profileState.profile }
                : { type: 'create-and-assign', profile: profileState.profile, newName: newProfileName };

            void executeSaveStrategy(strategy);
        },
        [profileState, executeSaveStrategy]
    );

    const handleAssignProfileConfirm = useCallback(() => {
        // Determine the correct strategy based on state
        let strategy: SaveStrategy;

        if (profileState.type === 'swapped') {
            const isDirty = formState?.isDirty ?? false;
            if (isDirty) {
                // Swapped with changes - need to update the profile
                strategy = { type: 'update-existing', profile: profileState.profile };
            } else {
                // Swapped without changes - just switch the profile
                strategy = { type: 'swap-profile', profile: profileState.profile };
            }
        } else if (profileState.type === 'replaced') {
            // Replaced profiles should update the original profile
            strategy = { type: 'update-existing', profile: profileState.profile };
        } else {
            // Created or uploaded - create and assign
            strategy = { type: 'create-and-assign', profile: profileState.profile };
        }

        void executeSaveStrategy(strategy);
    }, [profileState, formState, executeSaveStrategy]);

    const downloadProfile = (): void => {
        if (!profileState.profile) return;
        const link = document.createElement('a');
        // Merge the selected profile with the current form values for download
        // This will include any unsaved changes and outstanding errors, but that's acceptable for download purposes
        const mergedProfile = { ...profileState.profile, ...(formState?.getValues() as Partial<DeviceProfile>) };
        link.href = `data:text/json;charset=UTF-8,${encodeURIComponent(JSON.stringify(mergedProfile, null, 2))}`;
        link.download = `${profileState.profile.name}.json`;
        link.click();
    };

    // Block navigation when there are unsaved changes
    const hasUnsavedChanges = !newDevice && ((formState?.isDirty ?? false) || profileState.type !== 'original');

    const { proceed, reset, status } = useBlocker({
        shouldBlockFn: () => hasUnsavedChanges,
        withResolver: true,
        enableBeforeUnload: hasUnsavedChanges,
    });

    // Update the form state registration to include triggerSave
    useEffect(() => {
        if (formState) {
            onFormStateReady?.({
                ...formState,
                triggerSave,
            });
        }
    }, [formState, triggerSave, onFormStateReady]);

    const canApply = (profileState.type !== 'original' || formState?.isDirty) && formState?.isValid;

    const applyButtonText = isSaving
        ? 'Applying...'
        : profileState.type === 'created'
          ? 'Create & Apply Profile'
          : profileState.type === 'swapped' && !formState?.isDirty
            ? 'Switch Profile'
            : 'Apply Changes';

    const applyButtonIcon =
        profileState.type === 'created' ? (
            <AddCircle />
        ) : profileState.type === 'swapped' && !formState?.isDirty ? (
            <SwapHorizontalCircle />
        ) : (
            <CheckCircle />
        );

    return (
        <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: '100%', alignSelf: 'flex-start' }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <ProfileSelector
                    deviceInstance={deviceInstance!}
                    currentProfileState={profileState}
                    onHandleProfileSelection={handleProfileSelection}
                    isDirty={formState?.isDirty}
                />
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={() => formState?.reset()}
                        disabled={!formState?.isDirty}
                    >
                        Reset Changes
                    </Button>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<Undo />}
                        onClick={() => formState?.undo()}
                        disabled={!formState?.canUndo}
                    >
                        Undo
                    </Button>
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<Redo />}
                        onClick={() => formState?.redo()}
                        disabled={!formState?.canRedo}
                    >
                        Redo
                    </Button>
                </Box>
                <Spacer />
                {deviceInstance?.device && (
                    <Box>
                        <Button variant="outlined" startIcon={<Download />} onClick={downloadProfile}>
                            Download Device Profile
                        </Button>
                    </Box>
                )}
                {!newDevice && (
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={applyButtonIcon}
                            onClick={() => void handleSaveToDevice()}
                            disabled={!canApply}
                            loading={isSaving}
                        >
                            {applyButtonText}
                        </Button>
                    </Box>
                )}
            </Stack>
            <DataPointCommandDialogProvider>
                <DataPointsTable
                    device={deviceInstance?.device}
                    deviceResources={profileState.profile?.deviceResources}
                    newDevice={newDevice}
                    onFormStateReady={registerFormState}
                />
            </DataPointCommandDialogProvider>

            {deviceInstance?.device && (
                <SaveProfileDialog
                    open={showSaveDialog}
                    onClose={() => setShowSaveDialog(false)}
                    onContinue={handleDialogContinue}
                    currentDevice={deviceInstance.device}
                    otherDevices={otherDevices}
                    profileName={profileState.profile?.name ?? ''}
                    isSwappedProfile={profileState.type === 'swapped'}
                />
            )}

            <Dialog
                open={showAssignProfileDialog}
                onClose={() => setShowAssignProfileDialog(false)}
                sx={{ '& .MuiPaper-root': { background: theme.palette.background.paper } }}
            >
                <DialogTitle>
                    {profileState.type === 'created'
                        ? 'Create New Profile?'
                        : profileState.type === 'swapped'
                          ? 'Switch Device Profile?'
                          : 'Assign New Profile?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {profileState.type === 'created' ? (
                            <>
                                This will create a new device profile "<strong>{profileState.profile?.name}</strong>"
                                and assign it to <strong>{deviceInstance?.device.name}</strong>.
                            </>
                        ) : profileState.type === 'swapped' ? (
                            <>
                                This will switch <strong>{deviceInstance?.device.name}</strong> to use profile "
                                <strong>{profileState.profile?.name}</strong>".
                            </>
                        ) : (
                            <>
                                This will assign profile "<strong>{profileState.profile?.name}</strong>" to{' '}
                                <strong>{deviceInstance?.device.name}</strong>.
                            </>
                        )}
                    </DialogContentText>
                    {formState?.isDirty && (
                        <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                            Your changes will be {profileState.type === 'swapped' ? 'applied to' : 'saved in'}{' '}
                            <strong>{profileState.profile?.name}</strong>.
                        </Alert>
                    )}
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => setShowAssignProfileDialog(false)} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignProfileConfirm}
                            variant="contained"
                            color="primary"
                            startIcon={applyButtonIcon}
                        >
                            {profileState.type === 'created'
                                ? 'Create & Apply'
                                : profileState.type === 'swapped'
                                  ? formState?.isDirty
                                      ? 'Switch & Apply Changes'
                                      : 'Switch Profile'
                                  : 'Assign Profile'}
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={saveSuccess && !newDevice}
                autoHideDuration={6000}
                onClose={() => setSaveSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Device profile saved successfully!
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!saveError && !newDevice}
                autoHideDuration={8000}
                onClose={() => setSaveError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSaveError(null)} severity="error" sx={{ width: '100%' }}>
                    {saveError}
                </Alert>
            </Snackbar>

            <UnsavedChangesDialog open={status === 'blocked'} onClose={reset} onDiscard={proceed} />
        </Stack>
    );
};
