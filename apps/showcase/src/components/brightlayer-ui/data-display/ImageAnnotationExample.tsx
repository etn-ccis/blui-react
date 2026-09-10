import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AnchorPoint, Card, ImageAnnotator, Marker, Label } from '@brightlayer-ui/react-components';
import farmImage from '../../../assets/farm.jpg';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';

const containerStyles = {
    mb: 4,
};

const imageStyles = {
    width: '100%',
    maxWidth: 720,
    mx: 'auto',
};

export const ImageAnnotationExample: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={containerStyles}>
            <Typography variant="body1" sx={{ mb: 1 }}>
                Marker and Label Anchors
            </Typography>
            <ImageAnnotator src={farmImage} alt="Aerial view of a farm" sx={imageStyles}>
                <AnchorPoint x={80} y={10}>
                    <Label label="Mountain" />
                </AnchorPoint>

                <AnchorPoint x={10} y={50}>
                    <Marker>
                        <DeviceThermostatOutlinedIcon />
                    </Marker>
                </AnchorPoint>

                <AnchorPoint x={80} y={50}>
                    <Card>
                        <Typography variant="subtitle2">North field</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Moisture level: 64%
                        </Typography>
                    </Card>
                </AnchorPoint>
            </ImageAnnotator>
        </Box>
    </Box>
);
