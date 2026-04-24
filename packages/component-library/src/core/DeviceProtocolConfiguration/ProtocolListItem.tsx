import { BLUIColors } from '@brightlayer-ui/colors';
import { Spacer } from '@brightlayer-ui/react-components';
import { Box, Divider, Typography, Switch } from '@mui/material';
import { memo } from 'react';

type ProtocolListItemProps = {
    title: string;
    description?: string;
    valueComponent: React.ReactElement;
};

export const ProtocolListItem = memo((props: ProtocolListItemProps): JSX.Element => {
    const { title, description, valueComponent } = props;

    return (
        <>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant={'subtitle1'} align="left">
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant={'body2'} align="left" sx={{ color: BLUIColors.black[200] }}>
                            {description}
                        </Typography>
                    )}
                </Box>
                <Spacer />
                <Box
                    sx={{
                        width: valueComponent.type === Switch ? 'auto' : '280px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginLeft: '30px',
                    }}
                >
                    {valueComponent}
                </Box>
            </Box>
            <Divider />
        </>
    );
});
