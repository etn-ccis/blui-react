import { BLUIColors } from '@brightlayer-ui/colors';
import { InfoListItem } from '@brightlayer-ui/react-components';
import { Upload, Add, DeleteOutline, DownloadDone, Create, PublishedWithChanges } from '@mui/icons-material';
import {
    Autocomplete,
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { DeviceProfile } from './schemas/DeviceProfileSchema';
import { DeviceInstance } from './loaders/devicesLoader';
import { useEffect, useState } from 'react';
import EdgeXAPI from './api/EdgeXAPI';
import { ProtocolRegistry } from '../DeviceProtocolConfiguration/ProtocolRegistry';
import { CreateBlankProfileDialog } from './CreateBlankProfileDialog';
import { ProfileState } from './DeviceDetailsDataPoints';
import { UploadProfileDialog } from './DeviceProfile/UploadProfileDialog';

const getMatchingProfiles = async (deviceInstance: DeviceInstance): Promise<ProfileOption[]> => {
    const multiDeviceProfiles = await EdgeXAPI.getAllDeviceProfiles();
    const protocolType = ProtocolRegistry.getType(deviceInstance.device.protocols);
    const profileSchema = ProtocolRegistry.getResourceSchema(protocolType);
    const relevantProfiles = multiDeviceProfiles.profiles.filter((profile) =>
        profile.deviceResources.every((res) => profileSchema.safeParse(res).success)
    );
    const profileOptions = relevantProfiles.map(async (profile) => {
        const devicesUsed = await EdgeXAPI.getDevicesForDeviceProfile(profile);
        const profileOption = {
            id: profile.id,
            label: profile.name,
            groupId: 'startFrom' as const,
            isProfile: true,
            profileData: profile,
            devicesUsed:
                devicesUsed.devices.length > 0
                    ? `Used by ${devicesUsed.devices.map((device) => device.name).join(', ')}`
                    : 'Unused',
        } as ProfileOption;
        return profileOption;
    });
    const resolvedProfileOptions = await Promise.all(profileOptions);
    return resolvedProfileOptions.filter((option) => option?.profileData);
};

type ProfileOption = {
    id: string;
    label: string;
    groupId: 'actions' | 'startFrom';
    isProfile?: boolean;
    profileData?: DeviceProfile;
    devicesUsed?: string;
};

type ProfileSelectorProps = {
    deviceInstance: DeviceInstance;
    currentProfileState: ProfileState;
    onHandleProfileSelection?: (profile: DeviceProfile, selectionType: ProfileState['type']) => void;
    isDirty?: boolean;
};

export const ProfileSelector = ({
    deviceInstance,
    currentProfileState,
    onHandleProfileSelection,
    isDirty = false,
}: ProfileSelectorProps): JSX.Element => {
    const theme = useTheme();

    const selectedProfile: ProfileOption | null = ((): ProfileOption | null => {
        if (Object.keys(currentProfileState.profile).length === 0) {
            return null;
        }

        const profileId =
            currentProfileState.type === 'created'
                ? 'created'
                : currentProfileState.type === 'uploaded'
                  ? 'uploaded'
                  : currentProfileState.type === 'replaced'
                    ? 'replaced'
                    : (currentProfileState.profile?.id ?? '');

        return {
            id: profileId,
            label: currentProfileState.profile?.name ?? '',
            groupId: 'actions',
            isProfile: true,
            profileData: currentProfileState.profile,
        };
    })();

    const isProfileChanged = currentProfileState.type !== 'original';

    const [options, setOptions] = useState<ProfileOption[]>([]);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingProfile, setPendingProfile] = useState<ProfileOption | null>(null);

    const applyProfileSelection = (value: ProfileOption): void => {
        if (value.id === 'upload') {
            setUploadDialogOpen(true);
        } else if (value.id === 'blank') {
            setCreateDialogOpen(true);
        } else if (value.isProfile && value.profileData) {
            if (onHandleProfileSelection) {
                // Determine the selection type based on the option ID
                let selectionType: ProfileState['type'];
                if (value.id === 'created') {
                    selectionType = 'created';
                } else if (value.id === 'uploaded') {
                    selectionType = 'uploaded';
                } else if (value.id === 'replaced') {
                    selectionType = 'replaced';
                } else {
                    // Check if this is actually a different profile
                    const currentProfileId =
                        currentProfileState.type === 'original'
                            ? currentProfileState.profile.id
                            : currentProfileState.type === 'created'
                              ? 'created'
                              : currentProfileState.type === 'uploaded'
                                ? 'uploaded'
                                : currentProfileState.type === 'replaced'
                                  ? 'replaced'
                                  : currentProfileState.profile.id;

                    // If selecting the same profile, keep it as 'original'
                    if (value.id === currentProfileId) {
                        selectionType = 'original';
                    } else {
                        // Selecting a different existing profile from the list
                        selectionType = 'swapped';
                    }
                }
                onHandleProfileSelection(value.profileData, selectionType);
            }
        }
    };

    const handleProfileSelection = (value: ProfileOption | null): void => {
        if (!value) return;

        // Check if there are unsaved changes
        if (isDirty) {
            setPendingProfile(value);
            setConfirmDialogOpen(true);
            return;
        }

        // Proceed with selection if no unsaved changes
        applyProfileSelection(value);
    };

    const handleConfirmDiscard = (): void => {
        if (pendingProfile) {
            applyProfileSelection(pendingProfile);
        }
        setConfirmDialogOpen(false);
        setPendingProfile(null);
    };

    const handleCancelDiscard = (): void => {
        setConfirmDialogOpen(false);
        setPendingProfile(null);
    };

    const handleUploadDevice = (file: DeviceInstance, replace?: boolean): void => {
        const cleanedProfile = file.profile;
        delete cleanedProfile.id;
        delete cleanedProfile.created;
        delete cleanedProfile.modified;
        const uploadedProfileOption = {
            id: replace ? 'replaced' : 'uploaded',
            label: cleanedProfile.name,
            groupId: 'actions',
            isProfile: true,
            profileData: cleanedProfile,
        } as ProfileOption;
        setOptions((prevOptions) => [
            uploadedProfileOption,
            ...prevOptions.filter((option) => option.id !== 'uploaded' && option.id !== 'replaced'),
        ]);
        setUploadDialogOpen(false);
        if (onHandleProfileSelection) {
            onHandleProfileSelection(cleanedProfile, replace ? 'replaced' : 'uploaded');
        }
    };

    const handleCreateProfile = (profile: DeviceProfile): void => {
        profile.labels ??= [];
        profile.labels.push(`protocolType:${ProtocolRegistry.getType(deviceInstance.device.protocols)}`);

        const newProfileOption = {
            id: 'created',
            label: profile.name,
            groupId: 'actions',
            isProfile: true,
            profileData: profile,
        } as ProfileOption;
        setOptions((prevOptions) => [newProfileOption, ...prevOptions.filter((option) => option.id !== 'created')]);
        setCreateDialogOpen(false);
        if (onHandleProfileSelection) {
            onHandleProfileSelection(profile, 'created');
        }
    };

    useEffect(() => {
        const loadProfiles = async (): Promise<void> => {
            const uploadProfileOption: ProfileOption = {
                id: 'upload',
                label: 'Upload New Profile',
                groupId: 'actions',
            };
            const blankProfileOption: ProfileOption = {
                id: 'blank',
                label: 'Create From Blank',
                groupId: 'actions',
            };
            let matchingProfiles: ProfileOption[] = [];
            try {
                matchingProfiles = await getMatchingProfiles(deviceInstance);
            } catch {
                /* empty */
            }
            let optionsToSet = [uploadProfileOption, blankProfileOption, ...matchingProfiles];
            if (selectedProfile?.id && !optionsToSet.find((option) => option.id === selectedProfile.id)) {
                // Ensure the selected profile is in the options list
                optionsToSet = [selectedProfile, ...optionsToSet];
            }
            setOptions(optionsToSet);
        };
        void loadProfiles();
    }, [deviceInstance]);

    return (
        <Badge
            badgeContent="Modified"
            color="info"
            invisible={!isProfileChanged}
            sx={{
                '& .MuiBadge-badge': {
                    right: 20,
                    top: 10,
                    fontWeight: 500,
                },
            }}
        >
            <Autocomplete
                value={selectedProfile}
                options={options}
                sx={{
                    backgroundColor: BLUIColors.black[800],
                    width: '300px',
                }}
                renderInput={(params) => <TextField {...params} label="Device Profile" variant="filled" />}
                renderOption={(autocompleteProps, option) => {
                    const { key, ...optionProps } = autocompleteProps;
                    return (
                        <InfoListItem
                            key={key}
                            title={
                                <Typography variant="body1" fontWeight={400} noWrap>
                                    {option.label}
                                </Typography>
                            }
                            subtitle={[
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {option.devicesUsed && `${option.devicesUsed}`}
                                    {option.id === 'upload' && 'Upload a JSON file'}
                                    {option.id === 'blank' && 'Create a new profile'}
                                    {option.id === 'created' && 'Last created profile'}
                                    {option.id === 'uploaded' && 'Last uploaded profile'}
                                    {option.id === 'replaced' && 'Last replaced profile'}
                                </Typography>,
                            ]}
                            icon={
                                option.id === 'upload' ? (
                                    <Upload />
                                ) : option.id === 'blank' ? (
                                    <Add />
                                ) : option.id === 'created' ? (
                                    <Create />
                                ) : option.id === 'uploaded' ? (
                                    <DownloadDone />
                                ) : option.id === 'replaced' ? (
                                    <PublishedWithChanges />
                                ) : undefined
                            }
                            {...optionProps}
                            hidePadding
                            dense
                        />
                    );
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => (option.groupId === 'actions' ? '' : 'START FROM')}
                renderGroup={(params) => (
                    <div key={params.key}>
                        {params.group && (
                            <Typography
                                variant="overline"
                                sx={{
                                    pl: 2,
                                    pt: 1,
                                    display: 'block',
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                {params.group}
                            </Typography>
                        )}
                        {params.children}
                    </div>
                )}
                onChange={(_, value) => handleProfileSelection(value)}
            />
            {/* Unsaved Changes Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCancelDiscard}
                sx={{ '& .MuiPaper-root': { background: theme.palette.background.paper } }}
            >
                <DialogTitle>Unsaved Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes to <strong>{selectedProfile?.label}</strong>. Switching profiles will
                        discard these changes. Do you want to continue?
                    </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={handleCancelDiscard} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDiscard}
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteOutline />}
                        >
                            Discard Changes
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            <UploadProfileDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUpload={(file, _, replace) => handleUploadDevice(file, replace)}
                protocolType={ProtocolRegistry.getType(deviceInstance.device.protocols)}
            />

            {/* Create From Blank Dialog */}
            <CreateBlankProfileDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onCreate={handleCreateProfile}
                mode="create"
            />
        </Badge>
    );
};
