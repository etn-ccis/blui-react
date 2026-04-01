import React, { useState, useCallback } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SendIcon from '@mui/icons-material/Send';
import { EditableTable, type EditableTableColumnDef, type EditableTableState } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Device = {
    id: string;
    name: string;
    ipAddress: string;
    port: number;
};

const initialData: Device[] = [
    { id: '1', name: 'Sensor Alpha', ipAddress: '192.168.1.10', port: 502 },
    { id: '2', name: 'Sensor Beta', ipAddress: '192.168.1.11', port: 503 },
    { id: '3', name: 'Gateway', ipAddress: '192.168.1.1', port: 80 },
];

const columns: Array<EditableTableColumnDef<Device>> = [
    { accessorKey: 'id', header: 'ID', enableEditing: false, size: 60 },
    { accessorKey: 'name', header: 'Device Name', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'ipAddress', header: 'IP Address', muiEditTextFieldProps: { required: true } },
    { accessorKey: 'port', header: 'Port', size: 90, muiEditTextFieldProps: { type: 'number', required: true } },
];

const validate = (row: Device): Partial<Record<keyof Device, string | undefined>> => ({
    name: !row.name ? 'Device name is required' : undefined,
    ipAddress: !/^\d{1,3}(\.\d{1,3}){3}$/.test(row.ipAddress) ? 'Enter a valid IP address' : undefined,
    port: row.port < 1 || row.port > 65535 ? 'Port must be 1–65535' : undefined,
});

export const ExternalToolbarEditableTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Device[]>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [tableState, setTableState] = useState<EditableTableState | null>(null);

    const handleSave = useCallback(async (): Promise<void> => {
        if (!tableState?.save) return;
        setIsSaving(true);
        try {
            await tableState.save();
        } finally {
            setIsSaving(false);
        }
    }, [tableState]);

    return (
        <ExampleShowcase sx={{ p: 2 }}>
            {/* Toolbar: Undo/Redo/Reset on left — Save on right */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {/* Left group */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title="Discard all changes">
                        <span>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={tableState?.reset}
                                disabled={!tableState?.hasPendingChanges || isSaving}
                                sx={{ textTransform: 'none' }}
                            >
                                Reset to Original
                            </Button>
                        </span>
                    </Tooltip>
                    <Tooltip title="Ctrl+Z">
                        <span>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<UndoIcon />}
                                onClick={tableState?.undo}
                                disabled={!tableState?.canUndo}
                                sx={{ textTransform: 'none' }}
                            >
                                Undo
                            </Button>
                        </span>
                    </Tooltip>
                    <Tooltip title="Ctrl+Shift+Z">
                        <span>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RedoIcon />}
                                onClick={tableState?.redo}
                                disabled={!tableState?.canRedo}
                                sx={{ textTransform: 'none' }}
                            >
                                Redo
                            </Button>
                        </span>
                    </Tooltip>
                </Box>

                {/* Right group */}
                <Box sx={{ ml: 'auto' }}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SendIcon />}
                        onClick={(): void => {
                            void handleSave();
                        }}
                        disabled={!tableState?.hasPendingChanges || isSaving || !!tableState?.hasValidationErrors}
                        sx={{ textTransform: 'none' }}
                    >
                        Save to Device
                    </Button>
                </Box>
            </Box>

            <EditableTable
                columns={columns}
                data={data}
                onValidate={validate}
                onCreate={(row): void =>
                    setData((prev) => [
                        ...prev,
                        { ...row, id: String(Math.max(0, ...prev.map((r) => Number(r.id))) + 1) },
                    ])
                }
                onUpdate={(row): void => setData((prev) => prev.map((r) => (r.id === row.id ? row : r)))}
                onDelete={(id): void => setData((prev) => prev.filter((r) => r.id !== id))}
                onDuplicate={(row): void =>
                    setData((prev) => [
                        ...prev,
                        { ...row, id: String(Math.max(0, ...prev.map((r) => Number(r.id))) + 1) },
                    ])
                }
                isSaving={isSaving}
                enableDuplicate
                enableUndoRedo
                onStateChange={setTableState}
                createButtonText="Add Device"
                minHeight="300px"
            />
        </ExampleShowcase>
    );
};
