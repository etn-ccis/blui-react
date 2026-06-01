import React from 'react';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

const data = [
    { label: 'Failed', variant: 'failed' as const, count: 0 },
    { label: 'Canceled', variant: 'canceled' as const, count: 0 },
    { label: 'Success', variant: 'success' as const, count: 0 },
    { label: 'Pending', variant: 'pending' as const, count: 0 },
    { label: 'Info', variant: 'info' as const, count: 0 },
];

export const EmptyStateHorizontalStackedBarExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <HorizontalStackedBar data={data} />
    </ExampleShowcase>
);
