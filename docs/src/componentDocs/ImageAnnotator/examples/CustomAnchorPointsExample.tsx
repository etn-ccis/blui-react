import React from 'react';
import Typography from '@mui/material/Typography';
import { CardAnchorPoint, ImageAnnotator, LabelAnchorPoint, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import { ExampleShowcase } from '../../../shared';
import cabinetLight from '../images/cabinet1.png';
import cabinetDark from '../images/cabinet2.png';
import { Box, Divider, useColorScheme } from '@mui/material';
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
                <MarkerAnchorPoint
                    x={10}
                    y={42}
                    icon={<CabinTwoTone />}
                    color="warning"
                    callout
                    direction="right"
                    connectorLength={40}
                    anchorDotColor="#d8442a"
                    connectorColor="#d8442a"
                />
                <LabelAnchorPoint
                    x={50}
                    y={20}
                    label="Cabinet 2"
                    labelBgColor="#166b68"
                    labelColor="#ffffff"
                    callout
                    anchorDotColor="#5090ef"
                    connectorColor="#2cc333"
                    connectorLength={50}
                />
                <CardAnchorPoint
                    x={80}
                    y={75}
                    cardWidth={180}
                    callout
                    direction="left"
                    connectorLength={50}
                    connectorColor="#853799"
                    anchorDotColor="#059893"
                >
                    <>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600, pb: 0.25, whiteSpace: 'nowrap', color: '#07908b' }}
                        >
                            Switchgear Cabinet
                        </Typography>
                        <Divider sx={{ width: '100%' }} />
                        {[
                            ['Health Status', 'Good'],
                            ['Load Rate', '56 %'],
                            ['Temp', '38 ℃'],
                        ].map(([label, value]) => (
                            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="body2" noWrap>
                                    {label}
                                </Typography>
                                <Typography variant="body2" noWrap>
                                    {value}
                                </Typography>
                            </Box>
                        ))}
                    </>
                </CardAnchorPoint>
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
