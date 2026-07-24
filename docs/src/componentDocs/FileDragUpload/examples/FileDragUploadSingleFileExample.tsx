import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

export const FileDragUploadSingleFileExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload
            sx={{ width: 340 }}
            description={'Max file size: 5 MB\nOnly one file allowed'}
            multiple={false}
            onFilesSelected={(): void => {}}
        />
    </ExampleShowcase>
);
