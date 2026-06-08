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
import { FileDragUpload, FileDragUploadProps } from '@brightlayer-ui/react-components';
import { getIcon, getIconSnippetWithProps, removeEmptyProps } from '../../../shared';

const inputConfig: InputConfig = [
    // Optional Props
    {
        id: 'title',
        type: 'string',
        typeLabel: 'ReactNode',
        description: 'The main title text',
        required: false,
        initialValue: 'Upload a File',
        category: 'Optional Props',
    },
    {
        id: 'subtitle',
        type: 'string',
        typeLabel: 'ReactNode',
        description: 'Instruction text shown below the title',
        required: false,
        initialValue: 'Use upload button or drag files here',
        category: 'Optional Props',
    },
    {
        id: 'description',
        type: 'string',
        typeLabel: 'ReactNode',
        description: 'Additional description (e.g., file size limits)',
        required: false,
        initialValue: 'Max file size: 5 MB\nAllowed format: Any',
        category: 'Optional Props',
    },
    {
        id: 'dragTitle',
        type: 'string',
        typeLabel: 'ReactNode',
        description: 'Title shown during drag-over state',
        required: false,
        initialValue: 'Drop Here',
        category: 'Optional Props',
    },
    {
        id: 'invalidTypeTitle',
        type: 'string',
        typeLabel: 'ReactNode',
        description: 'Title shown when an incompatible file type is dragged over',
        required: false,
        initialValue: 'Wrong File Type',
        category: 'Optional Props',
    },
    {
        id: 'tooManyFilesTitle',
        type: 'string',
        typeLabel: 'ReactNode',
        description: 'Title shown when too many files are dragged over',
        required: false,
        initialValue: 'Too Many Files',
        category: 'Optional Props',
    },
    {
        id: 'accept',
        type: 'string',
        typeLabel: 'string',
        description: 'Accepted file types, comma-separated',
        required: false,
        initialValue: '',
        category: 'Optional Props',
    },
    {
        id: 'icon',
        type: 'select',
        typeLabel: 'ReactNode',
        description: 'Custom icon for idle state',
        initialValue: 'undefined',
        options: ['undefined', '<UploadFile />', '<CloudUpload />', '<Photo />', '<Folder />'],
        required: false,
        category: 'Optional Props',
    },
    {
        id: 'dragIcon',
        type: 'select',
        typeLabel: 'ReactNode',
        description: 'Custom icon for drag-over state',
        initialValue: 'undefined',
        options: ['undefined', '<UploadFile />', '<CloudUpload />', '<Photo />', '<Folder />'],
        required: false,
        category: 'Optional Props',
    },

    // Other Configuration
    {
        id: 'compact',
        type: 'boolean',
        description: 'Use compact variant for limited space',
        required: false,
        initialValue: false,
        category: 'Other Configuration',
    },
    {
        id: 'multiple',
        type: 'boolean',
        description: 'Whether to allow multiple file uploads',
        required: false,
        initialValue: false,
        category: 'Other Configuration',
    },
];

const FileDragUploadPreview: PreviewComponent = ({ data }) => {
    const { icon, dragIcon, ...rest } = data as unknown as FileDragUploadProps & { icon: string; dragIcon: string };

    const isCompact = Boolean((rest as Record<string, unknown>).compact);

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <FileDragUpload
                {...removeEmptyProps(rest)}
                icon={getIcon(icon, { fontSize: 'inherit' })}
                dragIcon={getIcon(dragIcon, { fontSize: 'inherit' })}
                sx={isCompact ? { width: 576 } : { width: 340 }}
                onFilesSelected={(): void => {}}
            />
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (data) => {
    const normalizedData = {
        ...data,
        description: typeof data.description === 'string' ? data.description.replace(/\n/g, '\\n') : data.description,
    };
    return `<FileDragUpload 
    ${getPropsToString(getPropsMapping(normalizedData, inputConfig), { join: '\n\t', skip: ['icon', 'dragIcon'] })}
    ${data.icon && data.icon !== 'undefined' ? `icon={${getIconSnippetWithProps(data.icon as string, { fontSize: 'inherit' })}}` : ''}
    ${data.dragIcon && data.dragIcon !== 'undefined' ? `dragIcon={${getIconSnippetWithProps(data.dragIcon as string, { fontSize: 'inherit' })}}` : ''}
    onFilesSelected={(files) => { /* handle files */ }}
/>`
        .replace(/^\s*$(?:\r\n?|\n)/gm, '')
        .replace(/(?:^|)( {4}|\t)/gm, '    ');
};

export const FileDragUploadPlaygroundComponent = (): React.JSX.Element => (
    <Box
        sx={{
            width: '100%',
            height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' },
        }}
    >
        <Playground inputConfig={inputConfig} codeSnippet={generateSnippet} previewComponent={FileDragUploadPreview} />
    </Box>
);
