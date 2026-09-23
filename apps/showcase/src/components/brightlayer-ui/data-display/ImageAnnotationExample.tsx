import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import nightView from '../../../assets/night_view.jpeg';
// import dayView from '../../../assets/day_view.png';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import { ImageAnnotator, CardAnchorPoint, LabelAnchorPoint, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import { Divider } from '@mui/material';

const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
};

const imageStyles = {
    width: '100%',
    mx: 'auto',
};

const cardContent = (
    <>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, pb: 0.25, whiteSpace: 'nowrap' }}>
            Switchgear Cabinet
        </Typography>
        <Divider sx={{ width: '100%' }} />
        {[
            ['Health Status', 'Good'],
            ['Load Rate', '56 %'],
            ['Temp', '38 ℃'],
        ].map(([label, value]) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2" color="#646b74" noWrap>
                    {label}
                </Typography>
                <Typography variant="body2" color="#353c44" noWrap>
                    {value}
                </Typography>
            </Box>
        ))}
    </>
);

export const ImageAnnotationExample: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={containerStyles}>
            <ImageAnnotator src={nightView} alt="Night view of a city" sx={imageStyles}>
                <MarkerAnchorPoint x={83} y={10} icon={<DeviceThermostatOutlinedIcon />} callout />
                <LabelAnchorPoint x={70} y={20} label="Vaccum cleaner #1" callout />
                <CardAnchorPoint x={50} y={50} cardWidth={150} callout={true}>
                    {cardContent}
                </CardAnchorPoint>
            </ImageAnnotator>

            {/* <ImageAnnotator src={dayView} alt="Day view of a city" sx={imageStyles}>
                <MarkerAnchorPoint x={20} y={10} icon={<DeviceThermostatOutlinedIcon />} callout />
                <LabelAnchorPoint x={80} y={20} label="Temperature Sensor #2" callout />
                <CardAnchorPoint x={50} y={50} cardWidth={150} callout={true}>
                    {cardContent}
                </CardAnchorPoint>
            </ImageAnnotator> */}
        </Box>
    </Box>
);
