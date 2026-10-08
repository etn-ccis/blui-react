import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { ImageAnnotator, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import RoomIcon from '@mui/icons-material/Room';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { ExampleShowcase } from '../../../shared';
import partsLight from '../images/parts1.png';
import partsDark from '../images/parts2.png';
import { Map, PartyMode, SupervisorAccount, Vibration } from '@mui/icons-material';

const imageStyles = {
    width: 600,
    mx: 'auto',
};

export const MarkerAnchorPointExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator src={isDarkMode ? partsDark : partsLight} alt="Factory floor parts" sx={imageStyles}>
                <MarkerAnchorPoint x={42} y={14} icon={<CameraAltIcon />} color="orange" />
                <MarkerAnchorPoint x={18} y={76} icon={<PartyMode />} color="neutral" />
                <MarkerAnchorPoint x={43} y={78} icon={<DeviceThermostatOutlinedIcon />} color="success" />
                <MarkerAnchorPoint
                    x={8}
                    y={30}
                    icon={<RoomIcon />}
                    color="primary"
                    callout
                    direction="bottom"
                    connectorLength={30}
                />
                <MarkerAnchorPoint x={88} y={24} icon={<Map />} color="warning" callout connectorLength={30} />
                <MarkerAnchorPoint
                    x={35}
                    y={58}
                    icon={<Vibration />}
                    color="purple"
                    callout
                    direction="top"
                    connectorLength={30}
                />
                <MarkerAnchorPoint
                    x={71}
                    y={50}
                    icon={<SupervisorAccount />}
                    color="error"
                    callout
                    connectorLength={30}
                />
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
