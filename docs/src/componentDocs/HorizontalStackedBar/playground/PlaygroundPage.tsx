import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { InputConfig, PreviewComponent, CodeSnippetFunction, Playground } from '@brightlayer-ui/react-doc-components';
import {
    HorizontalStackedBar,
    HorizontalStackedBarItem,
    HorizontalStackedBarProps,
} from '@brightlayer-ui/react-components';
import { css } from '@emotion/css';
import { getIcon, getIconSnippetWithProps, removeEmptyProps } from '../../../shared';

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
    {
        id: 'icon',
        type: 'select',
        typeLabel: 'React.JSX.Element',
        description: 'Legend icon shown when count > 0',
        required: false,
        initialValue: 'undefined',
        defaultValue: 'undefined',
        options: ['undefined', '<TrendingUp />', '<Fan />'],
        category: 'Item Props',
    },
    {
        id: 'disabledIcon',
        type: 'select',
        typeLabel: 'React.JSX.Element',
        description: 'Legend icon shown when count = 0',
        required: false,
        initialValue: 'undefined',
        defaultValue: 'undefined',
        options: ['undefined', '<TrendingDown />', '<SensorsOff />'],
        category: 'Item Props',
    },
    {
        id: 'addOnChange',
        label: 'Add onChange',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Show callback output when a legend item or bar segment is clicked',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Optional Props',
    },
    {
        id: 'useCustomClasses',
        type: 'boolean',
        typeLabel: 'boolean',
        description: 'Apply custom classes to root, legendContainer, and barContainer',
        required: false,
        initialValue: false,
        defaultValue: false,
        category: 'Optional Props',
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
    icon?: string;
    disabledIcon?: string;
    addOnChange?: boolean;
    useCustomClasses?: boolean;
};

const customClasses: HorizontalStackedBarProps['classes'] = {
    root: css({
        border: '1px dashed rgba(11, 95, 255, 0.55)',
        borderRadius: '8px',
        padding: '8px 12px',
        height: 'auto',
    }),
    legendContainer: css({
        backgroundColor: 'rgba(11, 95, 255, 0.08)',
        borderRadius: '4px',
        padding: '4px 6px',
    }),
    barContainer: css({
        marginTop: '2px',
    }),
};

const buildData = (data: HorizontalStackedBarPlaygroundData): HorizontalStackedBarItem[] => {
    const icon = data.icon && data.icon !== 'undefined' ? getIcon(data.icon) : undefined;
    const disabledIcon =
        data.disabledIcon && data.disabledIcon !== 'undefined' ? getIcon(data.disabledIcon) : undefined;

    const baseData: HorizontalStackedBarItem[] = [
        { label: 'Failed', variant: 'failed', count: Number(data.failedCount) || 0, icon, disabledIcon },
        { label: 'Canceled', variant: 'canceled', count: Number(data.canceledCount) || 0, icon, disabledIcon },
        { label: 'Success', variant: 'success', count: Number(data.successCount) || 0, icon, disabledIcon },
        { label: 'Pending', variant: 'pending', count: Number(data.pendingCount) || 0, icon, disabledIcon },
        { label: 'Info', variant: 'info', count: Number(data.infoCount) || 0, icon, disabledIcon },
    ];

    if (!data.useCustomColors) {
        return baseData;
    }

    const customColors = ['#0b5fff', '#7b1fa2', '#2e7d32', '#ef6c00', '#00838f'];
    return baseData.map((item, index) => ({
        label: item.label,
        count: item.count,
        icon: item.icon,
        disabledIcon: item.disabledIcon,
        backgroundColor: customColors[index],
    }));
};

const HorizontalStackedBarPreview: PreviewComponent = ({ data }) => {
    const previewData = data as unknown as HorizontalStackedBarPlaygroundData;
    const [latestSelection, setLatestSelection] = React.useState<string>('');
    const selectedStatus =
        previewData.selectedStatus && previewData.selectedStatus !== 'undefined'
            ? previewData.selectedStatus
            : undefined;
    const onChange = previewData.addOnChange
        ? (selectedLabel: string): void => setLatestSelection(selectedLabel)
        : undefined;

    return (
        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ width: 'min(720px, 100%)' }}>
                <HorizontalStackedBar
                    data={buildData(previewData)}
                    {...removeEmptyProps({
                        hideEmptyCategories: previewData.hideEmptyCategories,
                        selectedStatus,
                        onChange,
                        classes: previewData.useCustomClasses ? customClasses : undefined,
                    })}
                />
                {previewData.addOnChange && (
                    <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
                        {latestSelection
                            ? `onChange selectedLabel: '${latestSelection}'`
                            : 'Click a legend item or bar segment to trigger onChange'}
                    </Box>
                )}
            </Box>
        </Stack>
    );
};

const generateSnippet: CodeSnippetFunction = (rawData) => {
    const data = rawData as unknown as HorizontalStackedBarPlaygroundData;
    const selectedStatus = data.selectedStatus && data.selectedStatus !== 'undefined' ? data.selectedStatus : undefined;
    const iconSnippet = data.icon && data.icon !== 'undefined' ? `, icon: ${getIconSnippetWithProps(data.icon)}` : '';
    const disabledIconSnippet =
        data.disabledIcon && data.disabledIcon !== 'undefined'
            ? `, disabledIcon: ${getIconSnippetWithProps(data.disabledIcon)}`
            : '';
    const items = buildData(data);
    const dataSnippet = `const data = [\n${items
        .map((item) => {
            const variantPart = item.variant ? `, variant: '${item.variant}'` : '';
            const backgroundColorPart = item.backgroundColor ? `, backgroundColor: '${item.backgroundColor}'` : '';
            return `    { label: '${item.label}', count: ${item.count}${variantPart}${backgroundColorPart}${iconSnippet}${disabledIconSnippet} }`;
        })
        .join(',\n')}\n];`;

    const classesSnippet = data.useCustomClasses
        ? `const classes = {\n    root: 'my-horizontal-stacked-bar-root',\n    legendContainer: 'my-horizontal-stacked-bar-legend-container',\n    barContainer: 'my-horizontal-stacked-bar-bar-container',\n};\n\n`
        : '';

    const optionalProps = [
        data.hideEmptyCategories ? 'hideEmptyCategories' : '',
        selectedStatus ? `selectedStatus={'${selectedStatus}'}` : '',
        data.addOnChange ? 'onChange={(selectedLabel) => console.log(selectedLabel)}' : '',
        data.useCustomClasses ? 'classes={classes}' : '',
    ]
        .filter(Boolean)
        .join('\n    ');

    return `${classesSnippet}${dataSnippet}\n\n<HorizontalStackedBar\n    data={data}${optionalProps ? `\n    ${optionalProps}` : ''}\n/>`;
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
