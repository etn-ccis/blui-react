import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { CardAnchorPoint, ImageAnnotator } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import cabinetLight from '../images/cabinet1.jpg';
import cabinetDark from '../images/cabinet2.jpg';
import { cardFieldStyles } from '../cardFieldStyles';

const imageStyles = {
    width: 600,
    mx: 'auto',
};

export const CardAnchorPointExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator src={isDarkMode ? cabinetDark : cabinetLight} alt="Switchgear cabinets" sx={imageStyles}>
                <CardAnchorPoint x={20} y={20} cardWidth={160} sx={cardFieldStyles}>
                    <Typography variant="subtitle2">Cabinet 1</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                        <Typography variant="body2" className="card-field-label">
                            Health Status
                        </Typography>
                        <Typography variant="body2" className="card-field-value">
                            Good
                        </Typography>
                    </Box>
                </CardAnchorPoint>
                <CardAnchorPoint
                    x={90}
                    y={34}
                    cardWidth={160}
                    callout
                    direction="left"
                    connectorLength={120}
                    sx={cardFieldStyles}
                >
                    <Typography variant="subtitle2">Cabinet 4</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                        <Typography variant="body2" className="card-field-label">
                            Load Rate
                        </Typography>
                        <Typography variant="body2" className="card-field-value">
                            56%
                        </Typography>
                    </Box>
                </CardAnchorPoint>
                <CardAnchorPoint
                    x={40}
                    y={70}
                    cardWidth={160}
                    callout
                    direction="bottom"
                    connectorLength={30}
                    sx={cardFieldStyles}
                >
                    <Typography variant="subtitle2">Cabinet 2</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                        <Typography variant="body2" className="card-field-label">
                            Load Rate
                        </Typography>
                        <Typography variant="body2" className="card-field-value">
                            56%
                        </Typography>
                    </Box>
                </CardAnchorPoint>
                <CardAnchorPoint
                    x={73}
                    y={95}
                    cardWidth={160}
                    callout
                    direction="top"
                    connectorLength={30}
                    sx={cardFieldStyles}
                >
                    <Typography variant="subtitle2">Cabinet 1</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                        <Typography variant="body2" className="card-field-label">
                            Health Status
                        </Typography>
                        <Typography variant="body2" className="card-field-value">
                            Good
                        </Typography>
                    </Box>
                </CardAnchorPoint>
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
