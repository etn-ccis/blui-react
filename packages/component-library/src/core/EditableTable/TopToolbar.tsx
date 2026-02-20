import { Badge, Box, Tab, Tabs } from '@mui/material';
import {
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_TableInstance,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
} from 'material-react-table';
import { formatPointTypeName } from './SchemaUtils';
import { FormDeviceResource } from './hooks/useDataPointsForm';
import { JSX } from 'react';

type TopToolbarProps = {
    table: MRT_TableInstance<FormDeviceResource>;
    currentTab: string;
    uniquePointTypes: string[];
    dirtyTabs: Set<string>;
    tabErrorCounts: Map<string, number>;
    onTabChange: (event: React.SyntheticEvent, newTab: string) => void;
};

export const TopToolbar = ({
    table,
    currentTab,
    uniquePointTypes,
    dirtyTabs,
    tabErrorCounts,
    onTabChange,
}: TopToolbarProps): JSX.Element => (
    <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
            value={currentTab}
            onChange={onTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ pl: 2, flex: 1 }}
        >
            {uniquePointTypes.map((type) => {
                const errorCount = tabErrorCounts.get(type) ?? 0;
                const hasErrors = errorCount > 0;
                const isDirty = dirtyTabs.has(type);

                return (
                    <Tab
                        key={type}
                        value={type}
                        label={
                            <Badge
                                color={hasErrors ? 'error' : 'primary'}
                                variant={hasErrors ? 'standard' : 'dot'}
                                badgeContent={hasErrors ? errorCount : undefined}
                                invisible={!hasErrors && !isDirty}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        right: hasErrors ? -6 : -4,
                                        top: 4,
                                        fontSize: '0.6rem',
                                        height: hasErrors ? 16 : undefined,
                                        minWidth: hasErrors ? 16 : undefined,
                                    },
                                }}
                            >
                                {formatPointTypeName(type)}
                            </Badge>
                        }
                        sx={{ textTransform: 'none' }}
                    />
                );
            })}
        </Tabs>
        <Box sx={{ display: 'flex', gap: 0.5, pr: 1, alignItems: 'center' }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleGlobalFilterButton table={table} />
            {/* Removed for now as popover is now used */}
            {/* <MRT_ToggleFiltersButton table={table} /> */}
            <MRT_ShowHideColumnsButton table={table} />
            {/* Removed for now as compact sizing is sufficient */}
            {/* <MRT_ToggleDensePaddingButton table={table} /> */}
            <MRT_ToggleFullScreenButton table={table} />
        </Box>
    </Box>
);
