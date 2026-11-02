import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
    CodeSnippetFunction,
    getPropsMapping,
    getPropsToString,
    InputConfig,
    Playground,
    PreviewComponent,
} from '@brightlayer-ui/react-doc-components';
import { SlashedSvgIcon } from '@brightlayer-ui/icons-mui';
import BatteryIcon from '@brightlayer-ui/icons-svg/battery.svg';
import AccountSettingsIcon from '@brightlayer-ui/icons-svg/account_settings.svg';
import BuildingIcon from '@brightlayer-ui/icons-svg/building.svg';
import DeviceIcon from '@brightlayer-ui/icons-svg/device.svg';

const icons: Record<string, string> = {
    BatteryIcon,
    AccountSettingsIcon,
    BuildingIcon,
    DeviceIcon,
};

const inputConfig: InputConfig = [
    {
        id: 'iconSrc',
        type: 'select',
        typeLabel: 'string',
        description: 'URL of a bundled, trusted, same-origin SVG',
        initialValue: 'BatteryIcon',
        options: Object.keys(icons),
        required: true,
        category: 'Required Props',
    },
    {
        id: 'size',
        type: 'number',
        typeLabel: 'number',
        description: 'Width and height of the rendered icon in pixels',
        initialValue: 48,
        minValue: 16,
        maxValue: 200,
        valueStep: 4,
        defaultValue: 48,
        required: false,
        category: 'Optional Props',
    },
    {
        id: 'slashColor',
        type: 'color',
        typeLabel: 'string',
        description: 'Color of the slash',
        initialValue: '#CA3C3D',
        defaultValue: 'currentColor',
        required: false,
        category: 'Optional Props',
    },
    {
        id: 'alt',
        type: 'string',
        typeLabel: 'string',
        description: 'Accessible label for the icon',
        initialValue: 'Icon disabled',
        defaultValue: '',
        required: false,
        category: 'Optional Props',
    },
];

type SlashedIconData = {
    iconSrc: string;
    size?: number;
    slashColor?: string;
    alt?: string;
};

const SlashedIconPreview: PreviewComponent = ({ data }) => {
    const { iconSrc, size, slashColor, alt } = data as unknown as SlashedIconData;

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <SlashedSvgIcon iconSrc={icons[iconSrc]} size={size} slashColor={slashColor || undefined} alt={alt} />
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const props = getPropsToString(getPropsMapping(data, inputConfig), {
        join: '\n\t',
        skip: ['iconSrc'],
    });

    return `<SlashedSvgIcon
\ticonSrc={${String(data.iconSrc)}}
\t${props}
/>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');
};

export const SlashedIconPlaygroundComponent = (): React.JSX.Element => (
    <Box
        sx={{
            width: '100%',
            height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' },
        }}
    >
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={SlashedIconPreview} />
    </Box>
);
