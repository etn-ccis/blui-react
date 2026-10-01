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
import { ImageAnnotator, ImageAnnotatorProps } from '@brightlayer-ui/react-components';
import { removeEmptyProps } from '../../../shared';

const inputConfig: InputConfig = [
    {
        id: 'src',
        type: 'string',
        description: 'Image source URL',
        required: true,
        initialValue: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        category: 'Required Props',
    },
    {
        id: 'alt',
        type: 'string',
        description: 'Image alt text',
        required: false,
        initialValue: 'Landscape',
        category: 'Optional Props',
    },
];

const ImageAnnotatorPreview: PreviewComponent = ({ data }) => {
    const { ...props } = data as unknown as ImageAnnotatorProps;
    return (
        <Stack alignItems="center" justifyContent="center" sx={{ width: '100%', height: '100%' }}>
            <ImageAnnotator src={''} {...removeEmptyProps(props)} />
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) =>
    `<ImageAnnotator\n    ${getPropsToString(getPropsMapping(data, inputConfig), { join: '\n\t' })}\n/>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');

export const ImageAnnotatorPlaygroundComponent = (): React.JSX.Element => (
    <Box sx={{ width: '100%', height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' } }}>
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={ImageAnnotatorPreview} />
    </Box>
);
