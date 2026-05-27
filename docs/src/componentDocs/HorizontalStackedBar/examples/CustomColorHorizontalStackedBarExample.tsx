import React from 'react';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';

const data = [
    { label: 'Alpha', backgroundColor: '#0b5fff', count: 25 },
    { label: 'Beta', backgroundColor: '#00a884', count: 35 },
    { label: 'Gamma', backgroundColor: '#ff7a00', count: 15 },
    { label: 'Delta', backgroundColor: '#5d36d6', count: 25 },
];

export const CustomColorHorizontalStackedBarExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <HorizontalStackedBar data={data} />
    </ExampleShowcase>
);
