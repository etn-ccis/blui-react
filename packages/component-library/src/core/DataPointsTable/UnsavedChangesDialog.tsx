import { DeleteOutline } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Stack,
    useTheme,
} from '@mui/material';

type UnsavedChangesDialogProps = {
    open: boolean;
    onClose: (() => void) | undefined;
    onDiscard: (() => void) | undefined;
};

export const UnsavedChangesDialog = ({ open, onClose, onDiscard }: UnsavedChangesDialogProps): JSX.Element => {
    const theme = useTheme();
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '& .MuiPaper-root': { background: theme.palette.background.paper } }}
        >
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You have unsaved changes. Navigating away will discard these changes. Do you want to continue?
                </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={onDiscard} color="error" variant="outlined" startIcon={<DeleteOutline />}>
                        Discard Changes
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
