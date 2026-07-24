import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import PhotoIcon from '@mui/icons-material/Photo';

export const FileDragUploadImageAcceptExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload
            sx={{ width: 340 }}
            title="Upload a Photo"
            icon={<PhotoIcon fontSize={'inherit'} />}
            description={'Max file size: 25 MB\nAllowed format: PNG, JPG, WEBP, TIFF, SVG'}
            accept="image/png,image/jpeg,image/webp,image/tiff,image/svg+xml"
            multiple
            onFilesSelected={(): void => {}}
        />
    </ExampleShowcase>
);
