import React from 'react';
import { InfoListItem } from '@brightlayer-ui/react-components';
import { Alarm } from '@mui/icons-material';
import { ExampleShowcase } from '../../../shared';

export const InfoListItemWithIconExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <InfoListItem
            sx={{ maxWidth: 700, m: 'auto', backgroundColor: 'background.paper' }}
            title="Info List Item Title"
            subtitle="Info List Item Subtitle"
            icon={<Alarm />}
        />
    </ExampleShowcase>
);
