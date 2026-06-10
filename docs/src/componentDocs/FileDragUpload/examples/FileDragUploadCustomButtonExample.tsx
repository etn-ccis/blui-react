import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import Button from '@mui/material/Button';
import CloudUpload from '@mui/icons-material/CloudUpload';
import { ExampleShowcase } from '../../../shared';

export const FileDragUploadCustomButtonExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload
            sx={{ width: 340 }}
            customButton={
                <Button variant="outlined" color="primary" startIcon={<CloudUpload />}>
                    Browse Files
                </Button>
            }
            onFilesSelected={(): void => {}}
        />
    </ExampleShowcase>
);
