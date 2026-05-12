import React from 'react';
import {
    ComponentExample,
    ExampleCardList,
    BLUIAppBarExample,
    ScoreCardExample,
    SpacerExample,
    HorizontalBarExample,
    LegendExample,
} from '../../components';
import { usePageTitle } from '../../hooks/usePageTitle';

export const BLUISurfaces: React.FC = () => {
    const examples: ComponentExample[] = [
        { label: 'App Bar', component: <BLUIAppBarExample /> },
        { label: 'Score Card', component: <ScoreCardExample /> },
        { label: 'Spacer', component: <SpacerExample /> },
        { label: 'Horizontal Bar', component: <HorizontalBarExample />, fullWidth: true },
        { label: 'Legend', component: <LegendExample /> },
    ];
    usePageTitle('Brightlayer UI Surfaces');

    return <ExampleCardList examples={examples} />;
};
