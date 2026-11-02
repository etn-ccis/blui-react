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
import { EatonTwoTone, TwoToneIcon, TwoToneStatus } from '@brightlayer-ui/icons-mui';
import CheckCircleTwoTone from '@mui/icons-material/CheckCircleTwoTone';
import NotificationsTwoTone from '@mui/icons-material/NotificationsTwoTone';
import WarningTwoTone from '@mui/icons-material/WarningTwoTone';

const icons = {
    NotificationsTwoTone,
    WarningTwoTone,
    CheckCircleTwoTone,
    EatonTwoTone,
};

const inputConfig: InputConfig = [
    {
        id: 'icon',
        type: 'select',
        typeLabel: 'React.ElementType<SvgIconProps>',
        description: 'Two-tone icon component to render',
        initialValue: 'NotificationsTwoTone',
        options: Object.keys(icons),
        required: true,
        category: 'Required Props',
    },
    {
        id: 'status',
        type: 'select',
        typeLabel: 'TwoToneStatus',
        description: 'Status color scheme applied to the icon',
        initialValue: 'primary',
        options: ['error', 'orange', 'warning', 'success', 'primary', 'purple', 'neutral'],
        defaultValue: 'neutral',
        required: false,
        category: 'Optional Props',
    },
];

type TwoToneIconData = {
    icon: keyof typeof icons;
    status?: TwoToneStatus;
};

const TwoToneIconPreview: PreviewComponent = ({ data }) => {
    const { icon, status } = data as unknown as TwoToneIconData;

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <TwoToneIcon icon={icons[icon]} status={status} sx={{ fontSize: 48 }} />
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const props = getPropsToString(getPropsMapping(data, inputConfig), {
        join: '\n\t',
        skip: ['icon'],
    });

    return `<TwoToneIcon
\ticon={${String(data.icon)}}
\t${props}
/>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');
};

export const TwoToneIconPlaygroundComponent = (): React.JSX.Element => (
    <Box
        sx={{
            width: '100%',
            height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' },
        }}
    >
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={TwoToneIconPreview} />
    </Box>
);
