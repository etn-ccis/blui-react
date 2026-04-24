import { Add } from '@mui/icons-material';
import { Box, Button, Divider, Paper, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { FieldValues, UseFieldArrayAppend } from 'react-hook-form';
import { getArrayData, isArrayLengthFixed } from './ProtocolUtils';
import z from 'zod';

type ProtocolConfigListProps = {
    title: string;
    children: ReactNode;
    config?: any;
    schema?: z.ZodObject;
    add?: UseFieldArrayAppend<FieldValues, any>;
};

export const ProtocolConfigList = (props: ProtocolConfigListProps): JSX.Element => {
    const theme = useTheme();
    const { title, children, config, schema, add } = props;

    const handleAdd = (): void => {
        if (!config || !schema || !add) return;

        // Generate default values from schema
        const defaultItem: Record<string, any> = {};
        config.keys.forEach((key: string) => {
            const fieldData = getArrayData(key, config.arrayName, schema);
            defaultItem[key] = fieldData.defaultValue;
        });

        add?.(defaultItem);
    };

    return (
        <Paper sx={{ mt: 2 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" color={theme.palette.primary.main} align="left">
                    {title}
                </Typography>
                {config && schema && !isArrayLengthFixed(schema, config) && (
                    <Button startIcon={<Add />} onClick={handleAdd} variant="outlined" disabled={!add}>
                        New Item
                    </Button>
                )}
            </Box>
            <Divider />
            {children}
        </Paper>
    );
};

export default ProtocolConfigList;
