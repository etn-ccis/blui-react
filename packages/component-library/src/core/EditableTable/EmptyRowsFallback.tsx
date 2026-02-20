import { EmptyState } from '@brightlayer-ui/react-components';
import { Add, DataArray } from '@mui/icons-material';
import { Button } from '@mui/material';
import { JSX } from 'react';

type EmptyRowsFallbackProps = {
    onAddDataPoint?: () => void;
};

export const EmptyRowsFallback = ({ onAddDataPoint }: EmptyRowsFallbackProps): JSX.Element => (
    <EmptyState
        icon={<DataArray fontSize="inherit" />}
        title="No Data Points"
        description="There are currently no data points defined for this point type."
        actions={
            <Button variant="outlined" color="primary" startIcon={<Add />} onClick={onAddDataPoint}>
                New Data Point
            </Button>
        }
    />
);
