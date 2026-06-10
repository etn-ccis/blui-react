import React from 'react';
import { FileDragUpload } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

export const FileDragUploadBasicExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <FileDragUpload sx={{ width: 340 }} onFilesSelected={(): void => {}} />
    </ExampleShowcase>
);
