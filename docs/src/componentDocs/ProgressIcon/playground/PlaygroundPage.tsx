import React from 'react';
import Box from '@mui/material/Box';
import {
    InputConfig,
    PreviewComponent,
    CodeSnippetFunction,
    getPropsToString,
    getPropsMapping,
    Playground,
} from '@brightlayer-ui/react-doc-components';
import Stack from '@mui/material/Stack';
import { Signal, Battery, Heart, Pie, Ups } from '@brightlayer-ui/react-progress-icons';
import { removeEmptyProps } from '../../../shared';

const inputConfig: InputConfig = [
    // Icon Type Selection
    {
        id: 'iconType',
        type: 'select',
        typeLabel: 'string',
        description: 'Select the type of progress icon',
        initialValue: 'Signal',
        options: ['Signal', 'Battery', 'Heart', 'Pie', 'Ups'],
        required: true,
        category: 'Icon Type',
    },

    // Required Props
    {
        id: 'percent',
        type: 'number',
        typeLabel: 'number',
        description: 'Progress value represented by the icon (0-100)',
        required: true,
        initialValue: 50,
        minValue: 0,
        maxValue: 100,
        valueStep: 1,
        category: 'Required Props',
    },

    // Optional Props
    {
        id: 'size',
        type: 'number',
        typeLabel: 'number',
        description: 'Width and height of the icon in pixels',
        required: false,
        initialValue: 50,
        minValue: 16,
        maxValue: 200,
        valueStep: 5,
        defaultValue: 50,
        category: 'Optional Props',
    },
    {
        id: 'color',
        type: 'color',
        typeLabel: 'string',
        description: 'Primary icon color',
        required: false,
        initialValue: '#3431d2',
        defaultValue: '#3431d2',
        category: 'Optional Props',
    },
    {
        id: 'backgroundColor',
        type: 'color',
        typeLabel: 'string',
        description: 'Background fill color behind the icon',
        required: false,
        initialValue: '',
        category: 'Optional Props',
    },
    {
        id: 'showPercentLabel',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Controls whether the numeric percent label is displayed',
        required: false,
        initialValue: true,
        defaultValue: false,
        category: 'Optional Props',
    },
    {
        id: 'labelPosition',
        type: 'select',
        typeLabel: `'top' | 'bottom' | 'left' | 'right'`,
        description: 'Position of the percent label relative to the icon',
        required: false,
        initialValue: 'bottom',
        options: ['top', 'bottom', 'left', 'right'],
        defaultValue: 'bottom',
        category: 'Optional Props',
    },
    {
        id: 'labelColor',
        type: 'color',
        typeLabel: 'string',
        description: 'Color applied to the percent label text',
        required: false,
        initialValue: '',
        category: 'Optional Props',
    },
    {
        id: 'labelSize',
        type: 'number',
        typeLabel: 'number',
        description: 'Font size of the percent label',
        required: false,
        initialValue: 12,
        minValue: 8,
        maxValue: 32,
        valueStep: 1,
        category: 'Optional Props',
    },
    {
        id: 'outlined',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Renders an outlined visual style (when supported by the icon)',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Optional Props',
    },

    // Icon-Specific Props
    {
        id: 'ring',
        type: 'number',
        typeLabel: 'number',
        description: 'Thickness of the ring for the Pie indicator',
        required: false,
        initialValue: 5,
        minValue: 1,
        maxValue: 20,
        valueStep: 1,
        category: 'Icon-Specific Props (Pie)',
    },
    {
        id: 'charging',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Displays charging state styling (Battery only)',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Icon-Specific Props (Battery)',
    },
];

type ProgressIconData = {
    iconType: string;
    percent: number;
    size?: number;
    color?: string;
    backgroundColor?: string;
    showPercentLabel?: boolean;
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
    labelColor?: string;
    labelSize?: number;
    outlined?: boolean;
    ring?: number;
    charging?: boolean;
};

const ProgressIconPreview: PreviewComponent = ({ data }) => {
    const {
        iconType,
        percent,
        size,
        color,
        backgroundColor,
        showPercentLabel,
        labelPosition,
        labelColor,
        labelSize,
        outlined,
        ring,
        charging,
    } = data as unknown as ProgressIconData;

    const commonProps = removeEmptyProps({
        percent,
        size,
        color,
        backgroundColor,
        showPercentLabel,
        labelPosition,
        labelColor,
        labelSize,
        outlined,
    });

    let IconComponent;
    const iconSpecificProps: any = { ...commonProps };

    switch (iconType) {
        case 'Battery':
            IconComponent = Battery;
            if (charging !== undefined) {
                iconSpecificProps.charging = charging;
            }
            break;
        case 'Heart':
            IconComponent = Heart;
            break;
        case 'Pie':
            IconComponent = Pie;
            if (ring !== undefined) {
                iconSpecificProps.ring = ring;
            }
            break;
        case 'Ups':
            IconComponent = Ups;
            break;
        case 'Signal':
        default:
            IconComponent = Signal;
            break;
    }

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <IconComponent {...iconSpecificProps} />
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const { iconType, ring, charging } = data as unknown as ProgressIconData;

    const propsMapping = getPropsMapping(data, inputConfig);
    let props = getPropsToString(propsMapping, {
        join: '\n\t',
        skip: ['iconType'],
    });

    // Handle icon-specific props
    if (iconType === 'Battery' && charging !== undefined) {
        props = props.replace('charging', 'charging');
    } else if (iconType === 'Battery') {
        props = props.replace('charging', '');
    }

    if (iconType === 'Pie' && ring !== undefined) {
        props = props.replace('ring', 'ring');
    } else if (iconType === 'Pie') {
        props = props.replace('ring', '');
    }

    return `<${iconType} 
\t${props}
/>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');
};

export const ProgressIconPlaygroundComponent = (): React.JSX.Element => (
    <Box
        sx={{
            width: '100%',
            height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' },
        }}
    >
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={ProgressIconPreview} />
    </Box>
);
