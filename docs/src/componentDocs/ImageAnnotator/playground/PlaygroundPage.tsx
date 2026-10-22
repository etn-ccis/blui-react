import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import RoomIcon from '@mui/icons-material/Room';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import {
    CodeSnippetFunction,
    ComponentData,
    getPropsMapping,
    getPropsToString,
    InputConfig,
    Playground,
    PreviewComponent,
} from '@brightlayer-ui/react-doc-components';
import {
    CardAnchorPoint,
    ImageAnnotator,
    ImageAnnotatorProps,
    LabelAnchorPoint,
    MarkerAnchorPoint,
} from '@brightlayer-ui/react-components';
import entranceLight from '../images/entrance1.jpg';
import entranceDark from '../images/entrance2.jpg';
import partsLight from '../images/parts1.jpg';
import partsDark from '../images/parts2.jpg';
import cabinetLight from '../images/cabinet1.jpg';
import cabinetDark from '../images/cabinet2.jpg';
import { cardFieldStyles, cardFieldStylesSnippet } from '../cardFieldStyles';

const inputConfig: InputConfig = [
    {
        id: 'src',
        type: 'select',
        description: 'Image used for the annotation preview',
        required: true,
        initialValue: 'entrance',
        options: [
            { label: 'Entrance', value: 'entrance' },
            { label: 'Factory parts', value: 'parts' },
            { label: 'Switchgear cabinets', value: 'cabinet' },
        ],
        category: 'ImageAnnotator Props',
    },
    {
        id: 'annotationType',
        type: 'select',
        description: 'Annotation component shown over the image',
        required: true,
        initialValue: 'marker',
        options: [
            { label: 'MarkerAnchorPoint', value: 'marker' },
            { label: 'LabelAnchorPoint', value: 'label' },
            { label: 'CardAnchorPoint', value: 'card' },
        ],
        category: 'Annotation Component',
    },
    {
        id: 'alt',
        type: 'string',
        description: 'Image alt text',
        required: false,
        category: 'ImageAnnotator Props',
    },
    {
        id: 'width',
        type: 'number',
        description: 'Container width in pixels',
        required: false,
        defaultValue: '100%',
        minValue: 240,
        maxValue: 900,
        valueStep: 10,
        category: 'ImageAnnotator Props',
    },
    {
        id: 'height',
        type: 'number',
        description: 'Container height in pixels',
        required: false,
        defaultValue: 'auto',
        minValue: 0,
        maxValue: 700,
        valueStep: 10,
        category: 'ImageAnnotator Props',
    },
    {
        id: 'x',
        type: 'number',
        description: 'Horizontal anchor position as a percentage',
        required: true,
        initialValue: 33,
        minValue: 0,
        maxValue: 100,
        valueStep: 1,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'y',
        type: 'number',
        description: 'Vertical anchor position as a percentage',
        required: true,
        initialValue: 25,
        minValue: 0,
        maxValue: 100,
        valueStep: 1,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'callout',
        type: 'boolean',
        description: 'Connects the anchor to its content with a line',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'direction',
        type: 'select',
        description: 'Callout content direction',
        required: false,
        initialValue: 'right',
        defaultValue: 'right',
        options: ['top', 'bottom', 'left', 'right'],
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'connectorLength',
        type: 'number',
        description: 'Callout connector length in pixels',
        required: false,
        initialValue: 120,
        defaultValue: 120,
        minValue: 10,
        maxValue: 200,
        valueStep: 5,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'connectorColor',
        type: 'color',
        description: 'Callout connector color',
        required: false,
        initialValue: '',
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'connectorThickness',
        type: 'number',
        description: 'Callout connector width in pixels',
        required: false,
        initialValue: 1.2,
        defaultValue: 1.2,
        minValue: 1,
        maxValue: 12,
        valueStep: 0.1,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'autoFlip',
        type: 'boolean',
        description: 'Flip the callout when it would overflow the image',
        required: false,
        initialValue: true,
        defaultValue: true,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'anchorDotColor',
        type: 'select',
        description: 'Anchor dot color',
        required: false,
        initialValue: 'neutral',
        defaultValue: 'neutral',
        options: ['neutral', 'primary', 'custom'],
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'customAnchorDotColor',
        type: 'color',
        description: 'Custom anchor dot color (used when anchorDotColor is custom)',
        required: false,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'icon',
        type: 'select',
        description: 'Marker icon',
        required: true,
        initialValue: 'room',
        options: [
            { label: 'Room', value: 'room' },
            { label: 'Thermostat', value: 'thermostat' },
        ],
        category: 'MarkerAnchorPoint Props',
    },
    {
        id: 'iconSize',
        type: 'number',
        description: 'Marker icon size in pixels',
        required: false,
        initialValue: 24,
        defaultValue: 24,
        minValue: 16,
        maxValue: 80,
        valueStep: 2,
        category: 'MarkerAnchorPoint Props',
    },
    {
        id: 'markerColor',
        type: 'select',
        description: 'Marker color',
        required: false,
        initialValue: 'neutral',
        defaultValue: 'neutral',
        options: ['neutral', 'primary', 'success', 'error', 'warning', 'orange', 'purple'],
        category: 'MarkerAnchorPoint Props',
    },
    {
        id: 'label',
        type: 'string',
        description: 'Text displayed in the label chip',
        required: true,
        initialValue: 'Cabinet #2',
        category: 'LabelAnchorPoint Props',
    },
    {
        id: 'labelBgColor',
        type: 'color',
        description: 'Label chip background color',
        required: false,
        category: 'LabelAnchorPoint Props',
    },
    {
        id: 'labelColor',
        type: 'color',
        description: 'Label chip text color',
        required: false,
        category: 'LabelAnchorPoint Props',
    },
    {
        id: 'cardWidth',
        type: 'number',
        description: 'Card width in pixels',
        required: false,
        initialValue: 160,
        defaultValue: 160,
        minValue: 80,
        maxValue: 400,
        valueStep: 10,
        category: 'CardAnchorPoint Props',
    },
    {
        id: 'cardTitle',
        type: 'string',
        description: 'Card title content',
        required: false,
        category: 'CardAnchorPoint Props',
    },
    {
        id: 'cardFieldLabel',
        type: 'string',
        description: 'Card field label',
        required: false,
        category: 'CardAnchorPoint Props',
    },
    {
        id: 'cardBody',
        type: 'string',
        description: 'Card field value',
        required: false,
        category: 'CardAnchorPoint Props',
    },
];

const imageSources = {
    entrance: { light: entranceLight, dark: entranceDark },
    parts: { light: partsLight, dark: partsDark },
    cabinet: { light: cabinetLight, dark: cabinetDark },
};

type PlaygroundData = Pick<ImageAnnotatorProps, 'alt' | 'width' | 'height'> &
    Pick<
        React.ComponentProps<typeof MarkerAnchorPoint>,
        | 'x'
        | 'y'
        | 'callout'
        | 'direction'
        | 'connectorLength'
        | 'connectorColor'
        | 'connectorThickness'
        | 'autoFlip'
        | 'anchorDotColor'
        | 'iconSize'
        | 'markerColor'
    > &
    Pick<React.ComponentProps<typeof LabelAnchorPoint>, 'label' | 'labelBgColor' | 'labelColor'> &
    Pick<React.ComponentProps<typeof CardAnchorPoint>, 'cardWidth'> & {
        annotationType?: string;
        src?: string;
        icon?: string;
        cardTitle?: string;
        cardFieldLabel?: string;
        cardBody?: string;
    };

const getPlaygroundData = (data: ComponentData): ComponentData => {
    const { customAnchorDotColor, ...props } = getPropsMapping(data, inputConfig);
    if (props.anchorDotColor === 'custom') {
        if (customAnchorDotColor) {
            props.anchorDotColor = customAnchorDotColor;
        } else {
            delete props.anchorDotColor;
        }
    }
    if (!props.callout) {
        for (const key of ['direction', 'connectorLength', 'connectorColor', 'connectorThickness', 'autoFlip']) {
            delete props[key];
        }
    }
    return props;
};

const ImageAnnotatorPreview: PreviewComponent = ({ data }) => {
    const { mode, systemMode } = useColorScheme();
    const isDarkMode = (mode === 'system' ? systemMode : mode) === 'dark';
    const {
        annotationType,
        src,
        x,
        y,
        callout,
        direction,
        connectorLength,
        connectorColor,
        connectorThickness,
        autoFlip,
        anchorDotColor,
        icon,
        iconSize,
        markerColor,
        label,
        labelBgColor,
        labelColor,
        cardWidth,
        cardTitle,
        cardFieldLabel,
        cardBody,
        height,
        ...imageProps
    } = getPlaygroundData(data) as PlaygroundData;
    const anchorProps = callout
        ? {
              x,
              y,
              anchorDotColor,
              callout: true as const,
              direction,
              connectorLength,
              connectorColor,
              connectorThickness,
              autoFlip,
          }
        : { x, y, anchorDotColor };
    const selectedImageSet = imageSources[src as keyof typeof imageSources] ?? imageSources.entrance;
    const selectedImage = isDarkMode ? selectedImageSet.dark : selectedImageSet.light;
    const selectedIcon = icon === 'thermostat' ? <DeviceThermostatOutlinedIcon /> : <RoomIcon />;
    const annotation =
        annotationType === 'label' ? (
            <LabelAnchorPoint
                {...anchorProps}
                label={label}
                labelBgColor={labelBgColor || undefined}
                labelColor={labelColor || undefined}
            />
        ) : annotationType === 'card' ? (
            <CardAnchorPoint
                {...anchorProps}
                cardWidth={cardWidth}
                sx={cardTitle || cardFieldLabel || cardBody ? cardFieldStyles : undefined}
            >
                {cardTitle && <Typography variant="subtitle2">{cardTitle}</Typography>}
                {(cardFieldLabel || cardBody) && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                        <Typography variant="body2" className="card-field-label">
                            {cardFieldLabel}
                        </Typography>
                        <Typography variant="body2" className="card-field-value">
                            {cardBody}
                        </Typography>
                    </Box>
                )}
            </CardAnchorPoint>
        ) : (
            <MarkerAnchorPoint {...anchorProps} icon={selectedIcon} iconSize={iconSize} markerColor={markerColor} />
        );

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ width: '100%', height: '100%' }}>
            <ImageAnnotator src={selectedImage} {...imageProps} height={height}>
                {annotation}
            </ImageAnnotator>
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const normalizedData = getPlaygroundData(data);
    const { annotationType, src, icon, label, labelBgColor, labelColor, cardTitle, cardFieldLabel, cardBody } =
        normalizedData;
    const imageName = src === 'parts' ? 'parts' : src === 'cabinet' ? 'cabinet' : 'entrance';
    const formatProps = (keys: string[]): string => {
        const formatted = getPropsToString(normalizedData, {
            skip: Object.keys(normalizedData).filter((key) => !keys.includes(key)),
        });
        return formatted ? ` ${formatted}` : '';
    };
    const imageProps = `src={isDarkMode ? ${imageName}Dark : ${imageName}Light}${formatProps(['alt', 'width', 'height'])}`;
    const annotationProps = formatProps([
        'x',
        'y',
        'callout',
        'direction',
        'connectorLength',
        'connectorColor',
        'connectorThickness',
        'autoFlip',
        'anchorDotColor',
    ]);
    const hasCardContent = Boolean(cardTitle || cardFieldLabel || cardBody);
    const annotation =
        annotationType === 'label'
            ? `<LabelAnchorPoint${annotationProps} label={${JSON.stringify(label)}}${labelBgColor ? ` labelBgColor="${labelBgColor}"` : ''}${labelColor ? ` labelColor="${labelColor}"` : ''} />`
            : annotationType === 'card'
              ? `<CardAnchorPoint${annotationProps}${formatProps(['cardWidth'])}${hasCardContent ? ' sx={cardFieldStyles}' : ''}>\n${cardTitle ? `        <Typography variant="subtitle2">{${JSON.stringify(cardTitle)}}</Typography>\n` : ''}${cardFieldLabel || cardBody ? `        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, width: '100%' }}>\n            <Typography variant="body2" className="card-field-label">{${JSON.stringify(cardFieldLabel || '')}}</Typography>\n            <Typography variant="body2" className="card-field-value">{${JSON.stringify(cardBody || '')}}</Typography>\n        </Box>\n` : ''}    </CardAnchorPoint>`
              : `<MarkerAnchorPoint${annotationProps} icon={<${icon === 'thermostat' ? 'DeviceThermostatOutlinedIcon' : 'RoomIcon'} />}${formatProps(['iconSize', 'markerColor'])} />`;

    return `${annotationType === 'card' && hasCardContent ? `import * as BLUIColors from '@brightlayer-ui/colors';\n\n${cardFieldStylesSnippet}\n\n` : ''}<ImageAnnotator ${imageProps}>\n    ${annotation}\n</ImageAnnotator>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');
};

export const ImageAnnotatorPlaygroundComponent = (): React.JSX.Element => (
    <Box sx={{ width: '100%', height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' } }}>
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={ImageAnnotatorPreview} />
    </Box>
);
