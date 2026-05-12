import React from 'react';
import { Legend } from '@brightlayer-ui/react-components';
import Box from '@mui/material/Box';
import { Cancel, CheckCircle } from '@mui/icons-material';

export const LegendExample: React.FC = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Legend label={'Deployed'} icon={<Cancel fontSize="medium" />} iconColor={''} count={0} />
        <Legend
            label={'Deployed'}
            backgroundColor={'#2CA618'}
            icon={<CheckCircle fontSize="medium" sx={{ color: '#fff' }} />}
            iconColor={''}
            count={0}
        />
    </Box>
);
