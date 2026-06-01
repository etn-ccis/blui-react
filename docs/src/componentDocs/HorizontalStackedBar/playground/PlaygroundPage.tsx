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

const iconOptions = ['undefined', '<TrendingUp />', '<Fan />', '<TrendingDown />', '<SensorsOff />'] as const;
const variantOptions = ['undefined', 'failed', 'success', 'pending', 'info', 'canceled'] as const;

const itemConfigs = [
    { key: 'failed', label: 'Failed', count: 10, variant: 'failed' as const },
    { key: 'canceled', label: 'Canceled', count: 18, variant: 'canceled' as const },
    { key: 'success', label: 'Success', count: 44, variant: 'success' as const },
    { key: 'pending', label: 'Pending', count: 28, variant: 'pending' as const },
    { key: 'info', label: 'Info', count: 19, variant: 'info' as const },
] as const;

type ItemConfig = (typeof itemConfigs)[number];

type HorizontalStackedBarPlaygroundData = {
    hideEmptyCategories?: boolean;
    selectedStatus?: string;
    addOnChange?: boolean;
    useCustomClasses?: boolean;
} & Record<`${ItemConfig['key']}Label`, string> &
    Record<`${ItemConfig['key']}Count`, number> &
    Record<`${ItemConfig['key']}Variant`, HorizontalStackedBarItem['variant'] | 'undefined'> &
    Record<`${ItemConfig['key']}BackgroundColor`, string> &
    Record<`${ItemConfig['key']}Icon`, string> &
    Record<`${ItemConfig['key']}DisabledIcon`, string>;

const buildItemInputConfig = (item: ItemConfig): InputConfig => [
    {
        id: `${item.key}Label`,
        type: 'string',
        typeLabel: 'string',
        description: `Label for the ${item.label} item`,
        required: true,
        initialValue: item.label,
        category: `Data - ${item.label}`,
    },
    {
        id: `${item.key}Count`,
        type: 'number',
        typeLabel: 'number',
        description: `Count for the ${item.label} item`,
        required: true,
        initialValue: item.count,
        minValue: 0,
        maxValue: 200,
        valueStep: 1,
        category: `Data - ${item.label}`,
    },
    {
        id: `${item.key}Variant`,
        type: 'select',
        typeLabel: "'failed' | 'success' | 'pending' | 'info' | 'canceled'",
        description: `Variant for the ${item.label} item`,
        required: false,
        initialValue: item.variant,
        defaultValue: item.variant,
        options: variantOptions as unknown as string[],
        category: `Data - ${item.label}`,
    },
    {
        id: `${item.key}BackgroundColor`,
        type: 'color',
        typeLabel: 'string',
        description: `Custom background color for the ${item.label} item`,
        required: false,
        initialValue: '',
        category: `Data - ${item.label}`,
    },
    {
        id: `${item.key}Icon`,
        type: 'select',
        typeLabel: 'React.JSX.Element',
        description: `Legend icon shown when the ${item.label} item is enabled`,
        required: false,
        initialValue: 'undefined',
        defaultValue: 'undefined',
        options: iconOptions as unknown as string[],
        category: `Data - ${item.label}`,
    },
    {
        id: `${item.key}DisabledIcon`,
        type: 'select',
        typeLabel: 'React.JSX.Element',
        description: `Legend icon shown when the ${item.label} item count is 0`,
        required: false,
        initialValue: 'undefined',
        defaultValue: 'undefined',
        options: iconOptions as unknown as string[],
        category: `Data - ${item.label}`,
    },
];

const inputConfig: InputConfig = [
    ...itemConfigs.flatMap(buildItemInputConfig),
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
];

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

const buildData = (data: HorizontalStackedBarPlaygroundData): HorizontalStackedBarItem[] =>
    itemConfigs.map((item) => {
        const label = data[`${item.key}Label` as keyof HorizontalStackedBarPlaygroundData] as string;
        const count = Number(data[`${item.key}Count` as keyof HorizontalStackedBarPlaygroundData]) || 0;
        const variant = data[`${item.key}Variant` as keyof HorizontalStackedBarPlaygroundData] as
            | HorizontalStackedBarItem['variant']
            | 'undefined';
        const backgroundColor = data[
            `${item.key}BackgroundColor` as keyof HorizontalStackedBarPlaygroundData
        ] as string;
        const icon = data[`${item.key}Icon` as keyof HorizontalStackedBarPlaygroundData] as string;
        const disabledIcon = data[`${item.key}DisabledIcon` as keyof HorizontalStackedBarPlaygroundData] as string;

        return {
            label,
            count,
            ...(variant && variant !== 'undefined' ? { variant } : {}),
            ...(backgroundColor ? { backgroundColor } : {}),
            ...(icon && icon !== 'undefined' ? { icon: getIcon(icon) } : {}),
            ...(disabledIcon && disabledIcon !== 'undefined' ? { disabledIcon: getIcon(disabledIcon) } : {}),
        };
    });

const HorizontalStackedBarPreview: PreviewComponent = ({ data }) => {
    const previewData = data as unknown as HorizontalStackedBarPlaygroundData;
    const [latestSelection, setLatestSelection] = React.useState<string>('');
    const selectedStatus = previewData.selectedStatus || undefined;
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
    const selectedStatus = data.selectedStatus || undefined;
    const items = itemConfigs.map((item) => {
        const label = data[`${item.key}Label` as keyof HorizontalStackedBarPlaygroundData] as string;
        const count = Number(data[`${item.key}Count` as keyof HorizontalStackedBarPlaygroundData]) || 0;
        const variant = data[`${item.key}Variant` as keyof HorizontalStackedBarPlaygroundData] as
            | HorizontalStackedBarItem['variant']
            | 'undefined';
        const backgroundColor = data[
            `${item.key}BackgroundColor` as keyof HorizontalStackedBarPlaygroundData
        ] as string;
        const icon = data[`${item.key}Icon` as keyof HorizontalStackedBarPlaygroundData] as string;
        const disabledIcon = data[`${item.key}DisabledIcon` as keyof HorizontalStackedBarPlaygroundData] as string;

        const variantPart = variant && variant !== 'undefined' ? `, variant: '${variant}'` : '';
        const backgroundColorPart = backgroundColor ? `, backgroundColor: '${backgroundColor}'` : '';
        const iconPart = icon && icon !== 'undefined' ? `, icon: ${getIconSnippetWithProps(icon)}` : '';
        const disabledIconPart =
            disabledIcon && disabledIcon !== 'undefined'
                ? `, disabledIcon: ${getIconSnippetWithProps(disabledIcon)}`
                : '';

        return `    { label: '${label}', count: ${count}${variantPart}${backgroundColorPart}${iconPart}${disabledIconPart} }`;
    });
    const dataSnippet = `const data = [\n${items.join(',\n')}\n];`;

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
