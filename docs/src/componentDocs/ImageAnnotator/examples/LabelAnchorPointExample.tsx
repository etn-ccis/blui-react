import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { ImageAnnotator, LabelAnchorPoint } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import partsLight from '../images/parts1.png';
import partsDark from '../images/parts2.png';

const imageStyles = {
    width: 600,
};

export const LabelAnchorPointExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator src={isDarkMode ? partsDark : partsLight} alt="Factory floor parts" sx={imageStyles}>
                <LabelAnchorPoint x={48} y={8} label="Camera" />
                <LabelAnchorPoint x={8} y={50} label="Temperature sensor" />
                <LabelAnchorPoint x={90} y={50} label="Output" />
                <LabelAnchorPoint
                    x={20}
                    y={80}
                    label="Factory floor camera"
                    callout
                    direction="right"
                    connectorLength={40}
                />
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
