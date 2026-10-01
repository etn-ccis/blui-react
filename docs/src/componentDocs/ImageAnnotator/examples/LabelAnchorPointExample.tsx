import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { ImageAnnotator, LabelAnchorPoint } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import entranceLight from '../images/entrance1.png';
import entranceDark from '../images/entrance2.png';

const imageStyles = {
    width: 600,
};

export const LabelAnchorPointExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator src={isDarkMode ? entranceDark : entranceLight} alt="Entrance" sx={imageStyles}>
                <LabelAnchorPoint x={75} y={10} label="Entrance #2" />
                <LabelAnchorPoint x={33} y={25} label="Cabinet #2" callout direction="left" connectorLength={50} />
                <LabelAnchorPoint x={70} y={50} label="Cabinet #1" callout connectorLength={50} />
                <LabelAnchorPoint x={25} y={80} label="Entrance #1" callout direction="right" connectorLength={60} />
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
