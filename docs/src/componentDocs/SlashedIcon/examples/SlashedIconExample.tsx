import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SlashedSvgIcon } from '@brightlayer-ui/icons-mui';
import DeviceIcon from '@brightlayer-ui/icons-svg/device.svg';
import BatteryIcon from '@brightlayer-ui/icons-svg/battery.svg';
import AccountSettingsIcon from '@brightlayer-ui/icons-svg/account_settings.svg';
import BuildingIcon from '@brightlayer-ui/icons-svg/building.svg';
import { ExampleShowcase } from '../../../shared';

const examples = [
    { label: 'Battery', iconSrc: BatteryIcon, slashColor: undefined },
    { label: 'Account Settings', iconSrc: AccountSettingsIcon, slashColor: '#CA3C3D' },
    { label: 'Building', iconSrc: BuildingIcon, slashColor: '#1C77CC' },
    { label: 'Device', iconSrc: DeviceIcon, slashColor: undefined },
];

export const SlashedIconExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <Stack direction={'row'} spacing={4} useFlexGap flexWrap={'wrap'} justifyContent={'center'}>
            {examples.map(({ label, iconSrc, slashColor }) => (
                <Stack key={label} spacing={1} alignItems={'center'}>
                    <SlashedSvgIcon iconSrc={iconSrc} size={48} slashColor={slashColor} alt={`${label} disabled`} />
                    <Typography variant={'caption'}>{label}</Typography>
                </Stack>
            ))}
        </Stack>
    </ExampleShowcase>
);
