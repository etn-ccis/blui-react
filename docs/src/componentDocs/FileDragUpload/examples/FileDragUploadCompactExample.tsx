import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

export const FileDragUploadCompactExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload sx={{ width: 576 }} compact onFilesSelected={(): void => {}} />
    </ExampleShowcase>
);
