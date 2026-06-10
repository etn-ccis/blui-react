import React from 'react';
import { Box, Tooltip, Checkbox } from '@mui/material';
import Color from 'color';
import * as BLUIColors from '@brightlayer-ui/colors';
import { BinaryCellProps } from './types';
import { DataTableData } from '../types';

const CELL_HOVER_BG = Color(BLUIColors.black[500]).alpha(0.05).string();

/**
 * BinaryCell handles the rendering of checkbox/boolean cells in display mode.
 *
 * Features:
 * - Checkbox on left, text (0/1) on right
 * - Edited cell indicator (blue dot in top-right)
 * - Error tooltips
 * - Hover background
 */
export const BinaryCell = <TData extends DataTableData>({
    cell,
    row,
    validationErrors,
    editedRows,
    originalDataMap,
}: BinaryCellProps<TData>): React.ReactElement => {
    const cellKey = `${row.id}_${cell.column.id}` as keyof TData;
    const errorMessage = validationErrors?.[cellKey] as string | undefined;
    const value = cell.getValue<boolean>();

    const isNewRow = editedRows[row.id] !== undefined && !originalDataMap.has(row.id);
    const isCellEdited =
        isNewRow ||
        (editedRows[row.id] !== undefined &&
            editedRows[row.id][cell.column.id] !== originalDataMap.get(row.id)?.[cell.column.id]);

    const cellChildren: React.ReactNode[] = [];

    // Show edited indicator (blue dot)
    if (isCellEdited) {
        cellChildren.push(
            <Box
                key="dot"
                sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: BLUIColors.blue[500],
                    pointerEvents: 'none',
                }}
            />
        );
    }

    // Content: checkbox on left (50%), text (0/1) on right (50%)
    cellChildren.push(
        <Box key="content" sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'stretch' }}>
            {/* Checkbox half - 50% width, center-aligned; pointer cursor signals one-click toggle */}
            <Box
                data-binary-half="left"
                sx={{
                    flex: '0 0 50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pl: '16px',
                }}
            >
                <Checkbox
                    checked={value ?? false}
                    size="small"
                    sx={{
                        padding: 0,
                        pointerEvents: 'none', // Non-interactive in display mode
                    }}
                />
            </Box>
            {/* Text half - 50% width, center-aligned; text cursor signals click-to-edit */}
            <Box
                sx={{
                    flex: '0 0 50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'text',
                    pr: '16px',
                }}
            >
                <span>{value ? '1' : '0'}</span>
            </Box>
        </Box>
    );

    const hoverBox = (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: 52,
                display: 'flex',
                alignItems: 'stretch',
                '&:hover': { backgroundColor: CELL_HOVER_BG },
            }}
        >
            {cellChildren}
        </Box>
    );

    if (errorMessage) {
        return (
            <Tooltip title={errorMessage} arrow placement="top">
                {hoverBox}
            </Tooltip>
        );
    }

    return hoverBox;
};
