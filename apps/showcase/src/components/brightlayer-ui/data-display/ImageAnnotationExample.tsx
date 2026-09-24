import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import nightView from '../../../assets/night_view.jpeg';
import dayView from '../../../assets/day_view.png';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { ImageAnnotator, CardAnchorPoint, LabelAnchorPoint, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import { Divider } from '@mui/material';
import { Output, Person } from '@mui/icons-material';

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

const coloredCardContent = (
    <>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, pb: 0.25, whiteSpace: 'nowrap', color: 'blue' }}>
            Switchgear Cabinet
        </Typography>
        <Divider sx={{ width: '100%' }} />
        {[
            ['Health Status', 'Good'],
            ['Load Rate', '56 %'],
            ['Temp', '38 ℃'],
        ].map(([label, value]) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2" color="#042755" noWrap>
                    {label}
                </Typography>
                <Typography variant="body2" color="#051f3e" noWrap>
                    {value}
                </Typography>
            </Box>
        ))}
    </>
);

export const ImageAnnotationExample: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={containerStyles}>
            <Typography variant="h6">Anchor Points with Defaults</Typography>
            <ImageAnnotator src={nightView} alt="Night view of a city" sx={imageStyles}>
                <MarkerAnchorPoint x={5} y={5} icon={<DeviceThermostatOutlinedIcon />} color="neutral" />
                <MarkerAnchorPoint x={5} y={20} icon={<CameraAltOutlinedIcon />} color="primary" />
                <MarkerAnchorPoint x={5} y={35} icon={<Output />} color="error" />
                <MarkerAnchorPoint x={5} y={50} icon={<Person />} color="success" />
                <MarkerAnchorPoint x={5} y={65} icon={<DeviceThermostatOutlinedIcon />} color="warning" />

                <LabelAnchorPoint x={20} y={20} label="Vaccum cleaner #2" />

                <CardAnchorPoint x={20} y={50} cardWidth={150}>
                    {cardContent}
                </CardAnchorPoint>

                <MarkerAnchorPoint
                    x={45}
                    y={30}
                    icon={<DeviceThermostatOutlinedIcon />}
                    color="warning"
                    callout
                    direction="left"
                />
                <MarkerAnchorPoint
                    x={45}
                    y={45}
                    icon={<Output />}
                    color="error"
                    callout
                    direction="bottom"
                    lineLength={30}
                    anchorDotProps={{ anchorColor: 'blue' }}
                />

                <LabelAnchorPoint x={65} y={10} label="Vaccum cleaner #1" callout direction="left" lineLength={90} />

                <LabelAnchorPoint
                    x={68}
                    y={5}
                    label="Vaccum cleaner #2"
                    callout
                    direction="bottom"
                    anchorDotProps={{ anchorColor: 'blue' }}
                />
                <CardAnchorPoint x={70} y={50} cardWidth={150} callout={true} anchorDotProps={{ anchorColor: 'blue' }}>
                    {cardContent}
                </CardAnchorPoint>
                <CardAnchorPoint x={70} y={60} cardWidth={150} callout={true} direction="bottom" lineLength={30}>
                    {cardContent}
                </CardAnchorPoint>
            </ImageAnnotator>

            <Typography variant="h6">Anchor Points with Customization</Typography>
            <ImageAnnotator src={dayView} alt="Day view of a city" sx={imageStyles}>
                <MarkerAnchorPoint
                    x={15}
                    y={7}
                    icon={<DeviceThermostatOutlinedIcon />}
                    callout
                    lineColor={['#428bea', '#e4f26a']}
                    anchorDotProps={{ fillColor: 'red' }}
                    lineLength={60}
                />
                <LabelAnchorPoint
                    x={74}
                    y={25}
                    label="Temperature Sensor #2"
                    labelBgColor="#e4f26a"
                    labelColor="#5409ea"
                    callout
                    lineColor={['#428bea', '#e4f26a']}
                    anchorDotProps={{ fillColor: 'green' }}
                />
                <CardAnchorPoint
                    x={50}
                    y={50}
                    cardWidth={150}
                    callout={true}
                    lineColor={['#d942ea', '#91f26a']}
                    elevation={24}
                >
                    {coloredCardContent}
                </CardAnchorPoint>
                <CardAnchorPoint x={20} y={70} cardWidth={150} callout={true} direction="top">
                    {cardContent}
                </CardAnchorPoint>
            </ImageAnnotator>
        </Box>
    </Box>
);
