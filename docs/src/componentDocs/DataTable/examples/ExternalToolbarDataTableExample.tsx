import React, { useState, useCallback } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { DataTable, type DataTableColumnDef, type DataTableState } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

type Relay = {
    id: string;
    tag: string;
    description: string;
    setpoint: number;
    mode: 'Auto' | 'Manual' | 'Off';
    armed: boolean;
};

const initialData: Relay[] = [
    { id: '1', tag: 'R-01', description: 'Overcurrent Protection', setpoint: 50, mode: 'Auto', armed: true },
    { id: '2', tag: 'R-02', description: 'Ground Fault', setpoint: 10, mode: 'Manual', armed: true },
    { id: '3', tag: 'R-03', description: 'Voltage Sag', setpoint: 85, mode: 'Off', armed: false },
];

const modeOptions = ['Auto', 'Manual', 'Off'];

const columns: Array<DataTableColumnDef<Relay>> = [
    { accessorKey: 'tag', header: 'Tag', cellType: 'text', size: 90, required: true },
    { accessorKey: 'description', header: 'Description', cellType: 'text', required: true },
    { accessorKey: 'setpoint', header: 'Setpoint', cellType: 'number', size: 110 },
    { accessorKey: 'mode', header: 'Mode', cellType: 'select', editSelectOptions: modeOptions, size: 110 },
    { accessorKey: 'armed', header: 'Armed', cellType: 'binary', size: 90 },
];

const validate = (row: Relay): Partial<Record<keyof Relay, string | undefined>> => ({
    tag: !row.tag ? 'Tag is required' : undefined,
    description: !row.description ? 'Description is required' : undefined,
    setpoint: row.setpoint < 0 ? 'Must be ≥ 0' : undefined,
});

export const ExternalToolbarDataTableExample = (): React.JSX.Element => {
    const [data, setData] = useState<Relay[]>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [tableState, setTableState] = useState<DataTableState | null>(null);

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
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Tooltip title="Discard all changes">
                        <span>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<RestartAltIcon />}
                                onClick={tableState?.reset}
                                disabled={!tableState?.hasPendingChanges || isSaving}
                                sx={{ textTransform: 'none' }}
                            >
                                Reset
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
                <Box sx={{ ml: 'auto' }}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={(): void => {
                            void handleSave();
                        }}
                        disabled={!tableState?.canSave || isSaving}
                        sx={{ textTransform: 'none' }}
                    >
                        Save to Device
                    </Button>
                </Box>
            </Box>

            <DataTable
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
                createButtonText="Add Relay"
            />
        </ExampleShowcase>
    );
};
