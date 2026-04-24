import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { DeviceProfile } from '../schemas/DeviceProfileSchema';
import { ProtocolType } from '../schemas/ProtocolSchemas';

type UploadProfileDialogProps = {
    open: boolean;
    onClose: () => void;
    onUpload?: (profile: DeviceProfile) => void;
    protocolType?: ProtocolType;
};

/**
 * Stub dialog for uploading device profiles.
 * In production, this would allow users to upload a JSON profile file.
 */
export const UploadProfileDialog = ({
    open,
    onClose,
    onUpload,
    protocolType,
}: UploadProfileDialogProps): JSX.Element => {
    const handleUpload = (): void => {
        // Stub implementation
        console.warn('UploadProfileDialog.handleUpload is a stub - implement actual upload logic');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload Profile</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Upload a device profile JSON file.
                    {protocolType && ` Protocol type: ${protocolType}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    This is a stub component. Implement actual file upload logic in production.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUpload} variant="contained" disabled>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};
