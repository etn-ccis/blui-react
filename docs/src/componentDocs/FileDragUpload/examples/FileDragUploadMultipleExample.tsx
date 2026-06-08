import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

export const FileDragUploadMultipleExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload
            sx={{ width: 340 }}
            multiple
            accept="image/*"
            title="Upload Images"
            description={'Max file size: 5 MB\nAllowed format: Images'}
            onFilesSelected={(): void => {}}
        />
    </ExampleShowcase>
);
