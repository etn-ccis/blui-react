import React from 'react';
import { ChannelValue, ThreeLiner } from '@brightlayer-ui/react-components';
import TrendingUp from '@mui/icons-material/TrendingUp';
import { useColorScheme } from '@mui/material';
import { useDirection } from '../../../contexts/AppContext';
import { getStatusColor } from '../../../utils/statusColors';

export const ThreeLinerExample: React.FC = () => {
    const direction = useDirection();
    const rtl = direction === 'rtl';
    const { mode } = useColorScheme();
    const isDarkMode = mode === 'dark';

    return (
        <>
            <ThreeLiner title={'Three Liner Component'} subtitle={'with basic usage'} info={'...and a third line'} />
            <ThreeLiner
                sx={{ mt: 4 }}
                title={'Three Liner Component'}
                subtitle={'with custom content'}
                info={
                    <ChannelValue
                        value={'123'}
                        units={'hz'}
                        icon={
                            <TrendingUp
                                htmlColor={getStatusColor(isDarkMode, 'red')}
                                sx={rtl ? { transform: 'scaleX(-1)' } : {}}
                            />
                        }
                    />
                }
            />
        </>
    );
};
