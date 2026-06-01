import React from 'react';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

const data = [
    { label: 'Failed', variant: 'failed' as const, count: 10 },
    { label: 'Canceled', variant: 'canceled' as const, count: 20 },
    { label: 'Success', variant: 'success' as const, count: 35 },
    { label: 'Pending', variant: 'pending' as const, count: 15 },
    { label: 'Info', variant: 'info' as const, count: 20 },
];

export const BasicHorizontalStackedBarExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <HorizontalStackedBar data={data} />
    </ExampleShowcase>
);
