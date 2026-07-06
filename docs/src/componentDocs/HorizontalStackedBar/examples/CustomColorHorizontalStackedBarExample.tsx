import React from 'react';
import { HorizontalStackedBar } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import { TrendingDown, TrendingUp } from '@mui/icons-material';

const data = [
    {
        label: 'Alpha',
        backgroundColor: '#0b5fff',
        count: 10,
        icon: <TrendingUp />,
        disabledIcon: <TrendingUp color="disabled" />,
    },
    { label: 'Beta', backgroundColor: '#00a884', count: 35 },
    {
        label: 'Gamma',
        backgroundColor: '#ff7a00',
        count: 10,
        icon: <TrendingDown />,
        disabledIcon: <TrendingDown color="disabled" />,
    },
    { label: 'Delta', backgroundColor: '#5d36d6', count: 25 },
];

export const CustomColorHorizontalStackedBarExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <HorizontalStackedBar data={data} />
    </ExampleShowcase>
);
