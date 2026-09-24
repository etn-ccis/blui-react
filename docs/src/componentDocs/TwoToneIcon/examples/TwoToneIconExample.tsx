import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NotificationsTwoTone from '@mui/icons-material/NotificationsTwoTone';
import { TwoToneIcon, TwoToneStatus } from '@brightlayer-ui/icons-mui';
import { ExampleShowcase } from '../../../shared';

const statuses: TwoToneStatus[] = ['error', 'orange', 'warning', 'success', 'primary', 'purple', 'neutral'];

export const TwoToneIconExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <Stack direction={'row'} spacing={3} useFlexGap flexWrap={'wrap'} justifyContent={'center'}>
            {statuses.map((status) => (
                <Stack key={status} spacing={1} alignItems={'center'}>
                    <TwoToneIcon icon={NotificationsTwoTone} status={status} sx={{ fontSize: 48 }} />
                    <Typography variant={'caption'}>{status}</Typography>
                </Stack>
            ))}
        </Stack>
    </ExampleShowcase>
);
