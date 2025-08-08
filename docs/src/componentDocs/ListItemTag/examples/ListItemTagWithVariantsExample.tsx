import React from 'react';
import { ListItemTag } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import Stack from '@mui/material/Stack';

export const ListItemTagWithVariantsExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stack alignItems={'center'} sx={{ '& .BluiListItemTag-root': { mb: 1 } }}>
            <ListItemTag variant="overline" label="overline" />
            <ListItemTag variant="button" label="button" />
            <ListItemTag variant="h6" label="h6" />
        </Stack>
    </ExampleShowcase>
);
