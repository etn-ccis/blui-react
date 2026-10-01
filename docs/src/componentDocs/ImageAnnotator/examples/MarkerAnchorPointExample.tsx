import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { ImageAnnotator, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import RoomIcon from '@mui/icons-material/Room';
import { ExampleShowcase } from '../../../shared';
import partsLight from '../images/parts1.png';
import partsDark from '../images/parts2.png';

const imageStyles = {
    width: 600,
};

export const MarkerAnchorPointExample = (): React.JSX.Element => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';

    return (
        <ExampleShowcase>
            <ImageAnnotator src={isDarkMode ? partsDark : partsLight} alt="Factory floor parts" sx={imageStyles}>
                <MarkerAnchorPoint x={8} y={35} icon={<RoomIcon />} color="primary" />
                <MarkerAnchorPoint x={42} y={14} icon={<DeviceThermostatOutlinedIcon />} color="orange" />
                <MarkerAnchorPoint
                    x={71}
                    y={50}
                    icon={<DeviceThermostatOutlinedIcon />}
                    color="error"
                    callout
                    connectorLength={30}
                    direction="right"
                />
            </ImageAnnotator>
        </ExampleShowcase>
    );
};
