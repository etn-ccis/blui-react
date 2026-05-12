import React from 'react';
import { HorizontalBar, Legend } from '@brightlayer-ui/react-components';
import Box from '@mui/material/Box';
import { Cancel, CheckCircle, Error, Pending, PlayCircle } from '@mui/icons-material';

export const HorizontalBarExample: React.FC = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', flex: 1 }}>
            <Legend
                label={'Failed'}
                icon={<Error fontSize="medium" sx={{ color: '#fff' }} />}
                iconColor={''}
                count={5}
                backgroundColor={'#CA3C3D'}
            />
            <Legend
                label={'Cancelled'}
                backgroundColor={'#2CA618'}
                icon={<Cancel fontSize="medium" sx={{ color: '#fff' }} />}
                iconColor={''}
                count={16}
            />
            <Legend
                label={'Deployed'}
                icon={<CheckCircle fontSize="medium" />}
                iconColor={''}
                count={45}
                backgroundColor={'#aec8aa'}
            />
            <Legend
                label={'Deploying'}
                backgroundColor={'#2CA618'}
                icon={<PlayCircle fontSize="medium" sx={{ color: '#fff' }} />}
                iconColor={''}
                count={3}
            />
            <Legend
                label={'Pending'}
                backgroundColor={'#2CA618'}
                icon={<Pending fontSize="medium" sx={{ color: '#fff' }} />}
                iconColor={''}
                count={80}
            />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
            <HorizontalBar name={'Failed'} color={'#727E84'} barPercentage={25} />
            <HorizontalBar name={'Cancelled'} color={'#2296d0'} barPercentage={75} />
            <HorizontalBar name={'Deployed'} color={'#ea2929'} barPercentage={75} />
            <HorizontalBar name={'Deploying'} color={'#727E84'} barPercentage={100} />
            <HorizontalBar name={'Pending'} color={'#dd75d2'} barPercentage={125} />
        </Box>
    </Box>
);
