import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ImageAnnotator, Marker } from '@brightlayer-ui/react-components';
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
                <Marker
                    x={20}
                    y={10}
                    icon={<DeviceThermostatOutlinedIcon />}
                    callout
                    direction="right"
                    lineLength={60}
                />
                {/* <Label x={70} y={40} label="Temperature Sensor" /> 
                <Card x={50} y={50} cardWidth={150}>
                    <Typography variant='body1'>Card Content</Typography>
                    <Typography variant="body2">Content</Typography>
                </Card> */}
            </ImageAnnotator>
        </Box>
    </Box>
);
