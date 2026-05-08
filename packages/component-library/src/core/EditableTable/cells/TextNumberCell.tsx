import React from 'react';
import { Box, Tooltip } from '@mui/material';
import Color from 'color';
import * as BLUIColors from '@brightlayer-ui/colors';
import { TextNumberCellProps } from './types';
import { EditableTableData } from '../types';

const CELL_HOVER_BG = Color(BLUIColors.black[500]).alpha(0.05).string();

/**
 * TextNumberCell handles the rendering of text and number cells.
 * Numbers are right-aligned, text is left-aligned.
 *
 * Features:
 * - Edited cell indicator (blue dot in top-right)
 * - Error tooltips
 * - Hover background
 * - Custom cell rendering support
 */
export const TextNumberCell = <TData extends EditableTableData>({
    cell,
    row,
    renderedCellValue,
    validationErrors,
    editedRows,
    originalDataMap,
}: TextNumberCellProps<TData>): React.ReactElement => {
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

    // Content wrapper
    cellChildren.push(
        <Box key="content" sx={{ flex: 1, minWidth: 0 }}>
            {renderedCellValue}
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
