import { memo } from 'react';
import { alpha, Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { ContentCopy, DeleteOutline, DragHandle, Terminal } from '@mui/icons-material';
import { FormDeviceResource } from './hooks/useDataPointsForm';
import { MRT_Row } from 'material-react-table';

type RowActionsProps = {
    row: MRT_Row<FormDeviceResource>;
    device?: any; // Generic device type
    newDevice?: boolean;
    onCommand: (resource: FormDeviceResource) => void;
    onDuplicate: (resource: FormDeviceResource) => void;
    onDelete: (index: number) => void;
};

export const RowActions = memo<RowActionsProps>(
    ({ row, device, newDevice, onCommand, onDuplicate, onDelete }) => {
        const theme = useTheme();
        const fieldIndex = row.original.formIndex;
        const canCommand = device && !newDevice && row.original.properties.readWrite.includes('W');

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <Tooltip
                    title={canCommand ? 'Send Command' : 'Command not allowed on this point'}
                    placement="top"
                    followCursor
                >
                    <span>
                        <IconButton
                            disabled={!canCommand}
                            onClick={() => onCommand(row.original)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.dark, 0.2),
                                    color: theme.palette.primary.main,
                                },
                            }}
                        >
                            <Terminal />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Duplicate" placement="top" followCursor>
                    <IconButton
                        onClick={() => onDuplicate(row.original)}
                        sx={{
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.dark, 0.2),
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        <ContentCopy />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete" placement="top" followCursor>
                    <IconButton
                        onClick={() => onDelete(fieldIndex)}
                        sx={{
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.error.dark, 0.2),
                                color: theme.palette.error.main,
                            },
                        }}
                    >
                        <DeleteOutline />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Rearrange" placement="top" followCursor>
                    <IconButton
                        sx={{
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' },
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.dark, 0.2),
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        <DragHandle />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    },
    (prev, next) => prev.row.original.name === next.row.original.name
);
