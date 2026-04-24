import { memo, type MutableRefObject } from 'react';
import { alpha, Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { ContentCopy, DeleteOutline, DragHandle, Terminal } from '@mui/icons-material';
import { DeviceConfiguration } from './schemas/DeviceConfigurationSchema';
import { FormDeviceResource } from './hooks/useDataPointsStore';
import { MRT_Row } from 'material-react-table';

type RowActionsProps = {
    row: MRT_Row<FormDeviceResource>;
    device?: DeviceConfiguration;
    newDevice?: boolean;
    onCommand: (resource: FormDeviceResource) => void;
    onDuplicate: (resource: FormDeviceResource) => void;
    onDelete: (index: number) => void;
    dragFromIndexRef: MutableRefObject<number | null>;
};

export const RowActions = memo<RowActionsProps>(
    ({ row, device, newDevice, onCommand, onDuplicate, onDelete, dragFromIndexRef }) => {
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
                        draggable
                        onDragStart={(e) => {
                            // Build a compact pill-shaped ghost image
                            const ghost = document.createElement('div');
                            ghost.textContent = `≡  ${row.original.name}`;
                            Object.assign(ghost.style, {
                                position: 'fixed',
                                top: '-1000px',
                                left: '-1000px',
                                padding: '6px 14px',
                                borderRadius: '4px',
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                fontSize: '13px',
                                fontFamily: theme.typography.fontFamily,
                                whiteSpace: 'nowrap',
                                zIndex: '9999',
                            });
                            document.body.appendChild(ghost);
                            e.dataTransfer.setDragImage(ghost, 0, ghost.offsetHeight / 2);
                            // Remove ghost after browser captures it
                            requestAnimationFrame(() => document.body.removeChild(ghost));

                            const tr = (e.currentTarget as HTMLElement).closest('tr') as HTMLElement | null;
                            if (tr) tr.style.opacity = '0.4';

                            dragFromIndexRef.current = fieldIndex;
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', String(fieldIndex));
                        }}
                        onDragEnd={(e) => {
                            const tr = (e.currentTarget as HTMLElement).closest('tr') as HTMLElement | null;
                            if (tr) tr.style.opacity = '';
                            dragFromIndexRef.current = null;
                            // Remove insertion line overlay on drag end
                            document.querySelector('[data-insertion-line]')?.remove();
                        }}
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
    (prev, next) =>
        prev.row.original.name === next.row.original.name && prev.row.original.formIndex === next.row.original.formIndex
);
