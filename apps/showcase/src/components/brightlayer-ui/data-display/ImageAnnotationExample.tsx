import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import nightView from '../../../assets/night_view.jpg';
import dayView from '../../../assets/day_view.png';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import { ImageAnnotator, CardAnchorPoint, LabelAnchorPoint, MarkerAnchorPoint } from '@brightlayer-ui/react-components';

const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
};

const imageStyles = {
    width: '100%',
    mx: 'auto',
};

export const ImageAnnotationExample: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={containerStyles}>
            <ImageAnnotator src={nightView} alt="Night view of a city" sx={imageStyles}>
                <MarkerAnchorPoint x={20} y={10} icon={<DeviceThermostatOutlinedIcon />} callout />
                <LabelAnchorPoint x={80} y={20} label="Temperature Sensor" callout />
                <CardAnchorPoint x={50} y={50} cardWidth={150} callout={true}>
                    <Typography variant="body1">Card Content</Typography>
                    <Typography variant="body2">Content</Typography>
                </CardAnchorPoint>
            </ImageAnnotator>

            <ImageAnnotator src={dayView} alt="Day view of a city" sx={imageStyles}>
                <MarkerAnchorPoint x={20} y={10} icon={<DeviceThermostatOutlinedIcon />} callout />
                <LabelAnchorPoint x={80} y={20} label="Temperature Sensor" callout />
                <CardAnchorPoint x={50} y={50} cardWidth={150} callout={true}>
                    <Typography variant="body1">Card Content</Typography>
                    <Typography variant="body2">Content</Typography>
                </CardAnchorPoint>
            </ImageAnnotator>
        </Box>
    </Box>
);
