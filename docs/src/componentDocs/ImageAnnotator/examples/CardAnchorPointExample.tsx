import React from 'react';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import { CardAnchorPoint, ImageAnnotator } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import cabinetLight from '../images/cabinet1.png';
import cabinetDark from '../images/cabinet2.png';

const imageStyles = {
    width: 600,
};

export const CardAnchorPointExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator src={isDarkMode ? cabinetDark : cabinetLight} alt="Switchgear cabinets" sx={imageStyles}>
                <CardAnchorPoint x={24} y={28} cardWidth={160}>
                    <Typography variant="subtitle2">Cabinet 1</Typography>
                    <Typography variant="body2">Health: Good</Typography>
                </CardAnchorPoint>
                <CardAnchorPoint x={90} y={34} cardWidth={160} callout direction="left" connectorLength={30}>
                    <Typography variant="subtitle2">Cabinet 4</Typography>
                    <Typography variant="body2">Load rate: 56%</Typography>
                </CardAnchorPoint>
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
