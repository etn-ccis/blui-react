import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { ExternalToolbarEditableTableExample } from './ExternalToolbarEditableTableExample';

const codeSnippet = `import { useState, useCallback } from 'react';
import { Button, Tooltip, Box } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { EditableTable, type EditableTableState } from '@brightlayer-ui/react-components';

const [isSaving, setIsSaving] = useState(false);
const [tableState, setTableState] = useState<EditableTableState | null>(null);

const handleSave = useCallback(async (): Promise<void> => {
    if (!tableState?.save) return;
    setIsSaving(true);
    try {
        await tableState.save();
        // TODO: replace with your API call
        console.log('Saved. Updated data:', tableState.tableData);
    } finally {
        setIsSaving(false);
    }
}, [tableState]);

// Toolbar
<Box sx={{ display: 'flex', alignItems: 'center' }}>
    {/* Left: Undo / Redo / Reset to Original */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Ctrl+Z">
            <span>
                <Button
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
        <Tooltip title="Discard all changes">
            <span>
                <Button
                    size="small"
                    color="error"
                    startIcon={<RestartAltIcon />}
                    onClick={tableState?.reset}
                    disabled={!tableState?.hasPendingChanges || isSaving}
                    sx={{ textTransform: 'none' }}
                >
                    Reset to Original
                </Button>
            </span>
        </Tooltip>
    </Box>

    {/* Right: Save to Device */}
    <Box sx={{ ml: 'auto' }}>
        <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={() => void handleSave()}
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
    onCreate={handleCreate}
    onUpdate={handleUpdate}
    onDelete={handleDelete}
    onDuplicate={handleDuplicate}
    isSaving={isSaving}
    enableDuplicate
    enableUndoRedo
    onStateChange={setTableState}
/>`;

export const ExternalToolbarEditableTable = (): React.JSX.Element => (
    <Box>
        <ExternalToolbarEditableTableExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine={'9-10,22-23,65-66'} />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/EditableTable/examples/ExternalToolbarEditableTableExample.tsx"
        />
    </Box>
);
