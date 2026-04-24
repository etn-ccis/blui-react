import { Add } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeviceProfile, DeviceProfileSchema } from './schemas/DeviceProfileSchema';
import { FormFieldWrapper } from '../DeviceProtocolConfiguration/FormComponents/FormFieldWrapper';
import { FieldData } from '../DeviceProtocolConfiguration/ProtocolUtils';
import EdgeXAPI from './api/EdgeXAPI';
import { z } from 'zod';
import { ProtocolType, ProtocolTypeSchema } from './schemas/ProtocolSchemas';
import { ProtocolRegistry } from '../DeviceProtocolConfiguration/ProtocolRegistry';
import { getProtocolLabel } from './loaders/profilesLoader';

const BlankProfileFormSchema = DeviceProfileSchema.pick({
    name: true,
    manufacturer: true,
    model: true,
    description: true,
}).extend({
    name: DeviceProfileSchema.shape.name.refine(async (name) => {
        // If name is empty, skip this check (handled by required validation)
        if (!name) return true;
        // Check if the profile already exists in the system
        try {
            const profile = await EdgeXAPI.getDeviceProfile(name, true);
            return !profile;
        } catch {
            return true;
        }
    }, 'Profile name already exists'),
});

type CreateBlankProfileDialogProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (profile: DeviceProfile, protocolType?: ProtocolType) => void;
    profile?: DeviceProfile;
    showProtocolField?: boolean; //used in profile page
    mode: 'create' | 'duplicate';
};

export const CreateBlankProfileDialog = ({
    open,
    onClose,
    onCreate,
    profile,
    showProtocolField = false,
    mode = 'create',
}: CreateBlankProfileDialogProps): JSX.Element => {
    const theme = useTheme();

    const blankProfileSchema = useMemo(
        () =>
            showProtocolField
                ? BlankProfileFormSchema.extend({
                      protocolType: ProtocolTypeSchema.exclude(['']),
                  })
                : BlankProfileFormSchema,
        [showProtocolField]
    );

    type BlankProfileFormData = z.infer<typeof blankProfileSchema>;

    const methods = useForm<BlankProfileFormData>({
        defaultValues: {
            name: '',
            manufacturer: '',
            model: '',
            description: '',
            ...(showProtocolField ? { protocolType: undefined } : {}),
        },
        resolver: zodResolver(blankProfileSchema),
        mode: 'onBlur',
    });

    const {
        formState: { isValid },
        reset,
        getValues,
    } = methods;

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            reset();
        }

        if (mode === 'duplicate' && profile) {
            const { manufacturer, model, description } = profile;
            reset({
                name: '',
                manufacturer: manufacturer ?? '',
                model: model ?? '',
                description: description ?? '',
                ...(showProtocolField ? { protocolType: getProtocolLabel(profile) ?? '' } : {}),
            });
        }
    }, [open, reset, mode, profile]);

    const onSubmit = (data: BlankProfileFormData): void => {
        const newProfile: DeviceProfile = {
            ...data,
            deviceResources: mode === 'duplicate' && profile ? profile.deviceResources : [],
            deviceCommands: mode === 'duplicate' && profile ? profile.deviceCommands : [],
        };
        const protocolType = showProtocolField
            ? (data as unknown as { protocolType: ProtocolType }).protocolType
            : undefined;

        onCreate(newProfile, protocolType);
    };

    const protocolFieldToDisplay = (): Record<string, FieldData> => {
        if (showProtocolField && mode === 'create') {
            return {
                protocolType: {
                    type: 'autocomplete',
                    label: 'Protocol Type',
                    required: true,
                    options: ProtocolTypeSchema.options.filter((key) => key !== '') as ProtocolType[],
                    getOptionLabel: (option) => (option ? ProtocolRegistry.getName(option as ProtocolType) : ''),
                },
            };
        } else if (showProtocolField && mode === 'duplicate') {
            return {
                protocolType: {
                    type: 'text',
                    label: 'Protocol Type',
                    required: true,
                    inputProps: { readOnly: true },
                    helperText: 'Protocol type cannot be changed',
                },
            };
        }

        return {};
    };

    const fields: Record<keyof BlankProfileFormData, FieldData> = {
        name: {
            type: 'text',
            label: 'Profile Name',
            required: true,
        },

        ...protocolFieldToDisplay(),

        manufacturer: {
            type: 'text',
            label: 'Manufacturer',
            required: false,
        },
        model: {
            type: 'text',
            label: 'Model',
            required: false,
        },
        description: {
            type: 'text',
            label: 'Description',
            required: false,
        },
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '& .MuiPaper-root': { background: theme.palette.background.paper } }}
        >
            <DialogTitle> {mode === 'create' ? 'Create New Profile' : 'Duplicate Profile'}</DialogTitle>
            <FormProvider {...methods}>
                <DialogContent sx={{ width: 500 }}>
                    <Stack spacing={3}>
                        {Object.entries(fields).map(([key, fieldData]) => (
                            <FormFieldWrapper key={key} name={key} fieldData={fieldData} />
                        ))}
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={onClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            startIcon={<Add />}
                            disabled={!isValid}
                            onClick={() => {
                                const currentValues = getValues();
                                onSubmit(currentValues);
                            }}
                        >
                            {mode === 'create' ? 'Create From Blank' : 'Duplicate Profile'}
                        </Button>
                    </Stack>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
};
