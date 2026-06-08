import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

export const FileDragUploadSingleFilePdfExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload
            sx={{ width: 340 }}
            description={'Max file size: 10 MB\nAllowed format: PDF\nOnly one file allowed'}
            accept="application/pdf"
            multiple={false}
            onFilesSelected={(): void => {}}
        />
    </ExampleShowcase>
);
