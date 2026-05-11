import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { ExternalToolbarDataTableExample } from './ExternalToolbarDataTableExample';

const codeSnippet = `import { useState, useCallback } from 'react';
import { Button, Tooltip, Box } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { DataTable, type DataTableState } from '@brightlayer-ui/react-components';

const [isSaving, setIsSaving] = useState(false);
const [tableState, setTableState] = useState<DataTableState | null>(null);

const handleSave = useCallback(async () => {
    if (!tableState?.save) return;
    setIsSaving(true);
    try { await tableState.save(); }
    finally { setIsSaving(false); }
}, [tableState]);

// External toolbar
<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Discard all changes">
            <span>
                <Button variant="outlined" size="small" startIcon={<RestartAltIcon />}
                    onClick={tableState?.reset}
                    disabled={!tableState?.hasPendingChanges || isSaving}>
                    Reset
                </Button>
            </span>
        </Tooltip>
        <Tooltip title="Ctrl+Z">
            <span>
                <Button variant="outlined" size="small" startIcon={<UndoIcon />}
                    onClick={tableState?.undo} disabled={!tableState?.canUndo}>
                    Undo
                </Button>
            </span>
        </Tooltip>
        <Tooltip title="Ctrl+Shift+Z">
            <span>
                <Button variant="outlined" size="small" startIcon={<RedoIcon />}
                    onClick={tableState?.redo} disabled={!tableState?.canRedo}>
                    Redo
                </Button>
            </span>
        </Tooltip>
    </Box>
    <Box sx={{ ml: 'auto' }}>
        <Button variant="contained" size="small" startIcon={<SaveIcon />}
            onClick={() => void handleSave()}
            disabled={!tableState?.canSave || isSaving}>
            Save to Device
        </Button>
    </Box>
</Box>

<DataTable
    columns={columns}
    data={data}
    onValidate={validate}
    onCreate={handleCreate}
    onUpdate={handleUpdate}
    onDelete={handleDelete}
    onDuplicate={handleDuplicate}
    isSaving={isSaving}
    enableDuplicate
    enableUndoRedo
    onStateChange={setTableState}
/>`;

export const ExternalToolbarDataTable = (): React.JSX.Element => (
    <Box>
        <ExternalToolbarDataTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'14-15,17-21,63-65'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DataTable/examples/ExternalToolbarDataTableExample.tsx"
        />
    </Box>
);
