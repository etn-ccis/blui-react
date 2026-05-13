import React from 'react';
import {
    ComponentExample,
    ExampleCardList,
    BLUIAppBarExample,
    ScoreCardExample,
    SpacerExample,
    HorizontalStackedBarExample,
} from '../../components';
import { usePageTitle } from '../../hooks/usePageTitle';

export const BLUISurfaces: React.FC = () => {
    const examples: ComponentExample[] = [
        { label: 'App Bar', component: <BLUIAppBarExample /> },
        { label: 'Score Card', component: <ScoreCardExample /> },
        { label: 'Spacer', component: <SpacerExample /> },
        { label: 'Horizontal Stacked Bar', component: <HorizontalStackedBarExample />, fullWidth: true },
    ];
    usePageTitle('Brightlayer UI Surfaces');

    return <ExampleCardList examples={examples} />;
};
