import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import RoomIcon from '@mui/icons-material/Room';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import { CodeSnippetFunction, InputConfig, Playground, PreviewComponent } from '@brightlayer-ui/react-doc-components';
import {
    CardAnchorPoint,
    ImageAnnotator,
    ImageAnnotatorProps,
    LabelAnchorPoint,
    MarkerAnchorPoint,
} from '@brightlayer-ui/react-components';
import { removeEmptyProps } from '../../../shared';
import entranceLight from '../images/entrance1.png';
import entranceDark from '../images/entrance2.png';
import partsLight from '../images/parts1.png';
import partsDark from '../images/parts2.png';
import cabinetLight from '../images/cabinet1.png';
import cabinetDark from '../images/cabinet2.png';

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
        initialValue: 'Cleanroom entrance',
        category: 'ImageAnnotator Props',
    },
    {
        id: 'width',
        type: 'number',
        description: 'Container width in pixels',
        required: false,
        initialValue: 600,
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
        initialValue: 0,
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
        initialValue: true,
        defaultValue: false,
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'direction',
        type: 'select',
        description: 'Callout content direction',
        required: false,
        initialValue: 'right',
        options: ['top', 'bottom', 'down', 'left', 'right'],
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'connectorLength',
        type: 'number',
        description: 'Callout connector length in pixels',
        required: false,
        initialValue: 50,
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
        initialValue: '#ffffff',
        category: 'Shared AnchorPoint Props',
    },
    {
        id: 'connectorThickness',
        type: 'number',
        description: 'Callout connector width in pixels',
        required: false,
        initialValue: 2,
        minValue: 1,
        maxValue: 12,
        valueStep: 1,
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
        type: 'color',
        description: 'Anchor dot color',
        required: false,
        initialValue: '#ffffff',
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
        initialValue: 40,
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
        initialValue: 'primary',
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
        initialValue: '#ffffff',
        category: 'LabelAnchorPoint Props',
    },
    {
        id: 'labelColor',
        type: 'color',
        description: 'Label chip text color',
        required: false,
        initialValue: '#353c44',
        category: 'LabelAnchorPoint Props',
    },
    {
        id: 'cardWidth',
        type: 'number',
        description: 'Card width in pixels',
        required: false,
        initialValue: 160,
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
        initialValue: 'Cabinet 1',
        category: 'CardAnchorPoint Props',
    },
    {
        id: 'cardBody',
        type: 'string',
        description: 'Card body content',
        required: false,
        initialValue: 'Health: Good',
        category: 'CardAnchorPoint Props',
    },
];

const imageSources = {
    entrance: { light: entranceLight, dark: entranceDark },
    parts: { light: partsLight, dark: partsDark },
    cabinet: { light: cabinetLight, dark: cabinetDark },
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
        cardBody,
        height,
        ...imageProps
    } = data as Record<string, any>;
    const anchorProps = {
        x,
        y,
        callout,
        direction,
        connectorLength,
        connectorColor,
        connectorThickness,
        autoFlip,
        anchorDotColor,
    };
    const selectedImageSet = imageSources[src as keyof typeof imageSources] ?? imageSources.entrance;
    const selectedImage = isDarkMode ? selectedImageSet.dark : selectedImageSet.light;
    const selectedIcon = icon === 'thermostat' ? <DeviceThermostatOutlinedIcon /> : <RoomIcon />;
    const annotation =
        annotationType === 'label' ? (
            <LabelAnchorPoint {...anchorProps} label={label} labelBgColor={labelBgColor} labelColor={labelColor} />
        ) : annotationType === 'card' ? (
            <CardAnchorPoint {...anchorProps} cardWidth={cardWidth}>
                <Typography variant="subtitle2">{cardTitle}</Typography>
                <Typography variant="body2">{cardBody}</Typography>
            </CardAnchorPoint>
        ) : (
            <MarkerAnchorPoint {...anchorProps} icon={selectedIcon} iconSize={iconSize} color={markerColor} />
        );

    const props = {
        ...imageProps,
        src: selectedImage,
        width: imageProps.width,
        ...(height ? { height } : {}),
    } as ImageAnnotatorProps;

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ width: '100%', height: '100%' }}>
            <ImageAnnotator src={selectedImage} {...removeEmptyProps(props)}>
                {annotation}
            </ImageAnnotator>
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const { annotationType, src, icon, markerColor, label, labelBgColor, labelColor, cardTitle, cardBody, ...props } =
        data as Record<string, any>;
    const imageName = src === 'parts' ? 'parts' : src === 'cabinet' ? 'cabinet' : 'entrance';
    const imageProps = `src={isDarkMode ? ${imageName}Dark : ${imageName}Light} alt="${props.alt}" width={${props.width}}${props.height ? ` height={${props.height}}` : ''}`;
    const annotationProps = ` x={${props.x}} y={${props.y}}${props.callout ? ` callout direction="${props.direction}" connectorLength={${props.connectorLength}} connectorColor="${props.connectorColor}" connectorThickness={${props.connectorThickness}} autoFlip={${props.autoFlip}}` : ''} anchorDotColor="${props.anchorDotColor}"`;
    const annotation =
        annotationType === 'label'
            ? `<LabelAnchorPoint${annotationProps} label="${label}" labelBgColor="${labelBgColor}" labelColor="${labelColor}" />`
            : annotationType === 'card'
              ? `<CardAnchorPoint${annotationProps} cardWidth={${props.cardWidth}}>\n\t\t<Typography variant="subtitle2">${cardTitle}</Typography>\n\t\t<Typography variant="body2">${cardBody}</Typography>\n\t</CardAnchorPoint>`
              : `<MarkerAnchorPoint${annotationProps} icon={<${icon === 'thermostat' ? 'DeviceThermostatOutlinedIcon' : 'RoomIcon'} />} iconSize={${props.iconSize}} color="${markerColor}" />`;

    return `<ImageAnnotator ${imageProps}>\n\t${annotation}\n</ImageAnnotator>`;
};

export const ImageAnnotatorPlaygroundComponent = (): React.JSX.Element => (
    <Box sx={{ width: '100%', height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' } }}>
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={ImageAnnotatorPreview} />
    </Box>
);
