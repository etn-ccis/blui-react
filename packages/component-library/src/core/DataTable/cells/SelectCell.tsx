import React from 'react';
import { Box, Tooltip } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Color from 'color';
import * as BLUIColors from '@brightlayer-ui/colors';
import { SelectCellProps } from './types';
import { DataTableData } from '../types';

const CELL_HOVER_BG = Color(BLUIColors.black[500]).alpha(0.05).string();

/**
 * SelectCell handles the rendering of dropdown/select cells.
 *
 * Features:
 * - Dropdown selection display
 * - Edited cell indicator (blue dot in top-right)
 * - Error tooltips
 * - Hover background
 */
export const SelectCell = <TData extends DataTableData>({
    cell,
    row,
    renderedCellValue,
    validationErrors,
    editedRows,
    originalDataMap,
}: SelectCellProps<TData>): React.ReactElement => {
    const cellKey = `${row.id}_${cell.column.id}` as keyof TData;
    const errorMessage = validationErrors?.[cellKey] as string | undefined;

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

    // Content wrapper — text on left, arrow icon on right (matches collapsed Autocomplete state)
    cellChildren.push(
        <Box key="content" sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>{renderedCellValue}</Box>
            <ArrowDropDownIcon
                sx={{
                    flexShrink: 0,
                    color: 'action.active',
                    fontSize: '1.5rem',
                    mr: '-8px', // align with SimpleSelectInput's endAdornment at right: 8px inside px: 2
                }}
            />
        </Box>
    );

    const hoverBox = (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                minHeight: 52,
                display: 'flex',
                alignItems: 'center',
                px: 2,
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
