import React from 'react';
import Typography from '@mui/material/Typography';
import { CardAnchorPoint, ImageAnnotator, LabelAnchorPoint, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import cabinetLight from '../images/cabinet1.png';
import cabinetDark from '../images/cabinet2.png';
import { useColorScheme } from '@mui/material';
import { CabinTwoTone } from '@mui/icons-material';

export const CustomAnchorPointsExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator
                src={isDarkMode ? cabinetDark : cabinetLight}
                alt="Switchgear cabinets"
                sx={{ width: 600, mx: 'auto' }}
            >
                <MarkerAnchorPoint x={10} y={42} icon={<CabinTwoTone />} color="orange" />
                <LabelAnchorPoint x={50} y={20} label="Cabinet 2" labelBgColor="#166b68" labelColor="#ffffff" />
                <CardAnchorPoint
                    x={85}
                    y={72}
                    cardWidth={180}
                    callout
                    direction="left"
                    connectorLength={30}
                    connectorColor="#166b68"
                    connectorThickness={3}
                    anchorDotColor="#166b68"
                >
                    <Typography variant="subtitle2">Cabinet 4</Typography>
                    <Typography variant="body2">Load rate: 56%</Typography>
                </CardAnchorPoint>
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
