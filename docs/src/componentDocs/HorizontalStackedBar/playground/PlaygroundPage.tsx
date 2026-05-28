import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { InputConfig, PreviewComponent, CodeSnippetFunction, Playground } from '@brightlayer-ui/react-doc-components';
import { HorizontalStackedBar, HorizontalStackedBarItem } from '@brightlayer-ui/react-components';
import { removeEmptyProps } from '../../../shared';

const inputConfig: InputConfig = [
    {
        id: 'failedCount',
        type: 'number',
        typeLabel: 'number',
        description: 'Count for the Failed category',
        required: true,
        initialValue: 10,
        minValue: 0,
        maxValue: 200,
        valueStep: 1,
        category: 'Data',
    },
    {
        id: 'canceledCount',
        type: 'number',
        typeLabel: 'number',
        description: 'Count for the Canceled category',
        required: true,
        initialValue: 18,
        minValue: 0,
        maxValue: 200,
        valueStep: 1,
        category: 'Data',
    },
    {
        id: 'successCount',
        type: 'number',
        typeLabel: 'number',
        description: 'Count for the Success category',
        required: true,
        initialValue: 44,
        minValue: 0,
        maxValue: 200,
        valueStep: 1,
        category: 'Data',
    },
    {
        id: 'pendingCount',
        type: 'number',
        typeLabel: 'number',
        description: 'Count for the Pending category',
        required: true,
        initialValue: 28,
        minValue: 0,
        maxValue: 200,
        valueStep: 1,
        category: 'Data',
    },
    {
        id: 'infoCount',
        type: 'number',
        typeLabel: 'number',
        description: 'Count for the Info category',
        required: true,
        initialValue: 19,
        minValue: 0,
        maxValue: 200,
        valueStep: 1,
        category: 'Data',
    },
    {
        id: 'hideEmptyCategories',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Hide legend entries with count = 0',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Optional Props',
    },
    {
        id: 'selectedStatus',
        type: 'select',
        typeLabel: 'string',
        description: 'Controlled selected category label',
        required: false,
        initialValue: 'undefined',
        defaultValue: 'undefined',
        options: ['undefined', 'Failed', 'Canceled', 'Success', 'Pending', 'Info'],
        category: 'Optional Props',
    },
    {
        id: 'useCustomColors',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Use custom background colors instead of variants',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Other Configuration',
    },
];

type HorizontalStackedBarPlaygroundData = {
    failedCount: number;
    canceledCount: number;
    successCount: number;
    pendingCount: number;
    infoCount: number;
    hideEmptyCategories?: boolean;
    selectedStatus?: string;
    useCustomColors?: boolean;
};

const buildData = (data: HorizontalStackedBarPlaygroundData): HorizontalStackedBarItem[] => {
    const baseData: HorizontalStackedBarItem[] = [
        { label: 'Failed', variant: 'failed', count: Number(data.failedCount) || 0 },
        { label: 'Canceled', variant: 'canceled', count: Number(data.canceledCount) || 0 },
        { label: 'Success', variant: 'success', count: Number(data.successCount) || 0 },
        { label: 'Pending', variant: 'pending', count: Number(data.pendingCount) || 0 },
        { label: 'Info', variant: 'info', count: Number(data.infoCount) || 0 },
    ];

    if (!data.useCustomColors) {
        return baseData;
    }

    const customColors = ['#0b5fff', '#7b1fa2', '#2e7d32', '#ef6c00', '#00838f'];
    return baseData.map((item, index) => ({
        label: item.label,
        count: item.count,
        backgroundColor: customColors[index],
    }));
};

const HorizontalStackedBarPreview: PreviewComponent = ({ data }) => {
    const previewData = data as unknown as HorizontalStackedBarPlaygroundData;
    const selectedStatus =
        previewData.selectedStatus && previewData.selectedStatus !== 'undefined'
            ? previewData.selectedStatus
            : undefined;

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: 'min(720px, 100%)' }}>
                <HorizontalStackedBar
                    data={buildData(previewData)}
                    {...removeEmptyProps({ hideEmptyCategories: previewData.hideEmptyCategories, selectedStatus })}
                />
            </Box>
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (rawData) => {
    const data = rawData as unknown as HorizontalStackedBarPlaygroundData;
    const selectedStatus = data.selectedStatus && data.selectedStatus !== 'undefined' ? data.selectedStatus : undefined;
    const items = buildData(data);
    const dataSnippet = `const data = [\n${items
        .map((item) => {
            const variantPart = item.variant ? `, variant: '${item.variant}'` : '';
            const backgroundColorPart = item.backgroundColor ? `, backgroundColor: '${item.backgroundColor}'` : '';
            return `    { label: '${item.label}', count: ${item.count}${variantPart}${backgroundColorPart} }`;
        })
        .join(',\n')}\n];`;

    const optionalProps = [
        data.hideEmptyCategories ? 'hideEmptyCategories' : '',
        selectedStatus ? `selectedStatus={'${selectedStatus}'}` : '',
    ]
        .filter(Boolean)
        .join('\n    ');

    return `${dataSnippet}\n\n<HorizontalStackedBar\n    data={data}${optionalProps ? `\n    ${optionalProps}` : ''}\n/>`;
};

export const HorizontalStackedBarPlaygroundComponent = (): React.JSX.Element => (
    <Box
        sx={{
            width: '100%',
            height: { xs: 'calc(100vh - 105px)', sm: 'calc(100vh - 113px)' },
        }}
    >
        <Playground
            inputConfig={inputConfig}
            codeSnippet={generateSnippet}
            previewComponent={HorizontalStackedBarPreview}
        />
    </Box>
);
