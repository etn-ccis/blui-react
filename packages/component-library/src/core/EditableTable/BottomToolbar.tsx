import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { JSX, memo } from 'react';

type BottomToolbarProps = {
    onAddDataPoint: () => void;
};

export const BottomToolbar = memo(
    ({ onAddDataPoint }: BottomToolbarProps): JSX.Element => (
        <Button startIcon={<Add />} onClick={onAddDataPoint}>
            New Data Point
        </Button>
    )
);
