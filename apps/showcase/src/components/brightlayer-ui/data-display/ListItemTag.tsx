import React from 'react';
import Typography from '@mui/material/Typography';
import { InfoListItem, ListItemTag } from '@brightlayer-ui/react-components';
import * as colors from '@brightlayer-ui/colors';
import BrightnessMedium from '@mui/icons-material/BrightnessMedium';
import { useColorScheme } from '@mui/material';
import { useDirection } from '../../../contexts/AppContext';
import Box from '@mui/material/Box';

const componentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
};

const labelStyles = {
    mb: 1,
};

export const ListItemTagExample: React.FC = () => {
    const direction = useDirection();
    const rtl = direction === 'rtl';
    const { mode } = useColorScheme();
    const isDarkMode = mode === 'dark';

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    mb: 2,
                }}
            >
                <Box sx={componentContainerStyles}>
                    <Typography sx={labelStyles} variant={'body2'}>
                        Basic Usage
                    </Typography>
                    <ListItemTag
                        label={'active'}
                        backgroundColor={isDarkMode ? colors.blue[200] : undefined}
                        fontColor={isDarkMode ? colors.blue[900] : undefined}
                    />
                </Box>
                <Box sx={componentContainerStyles}>
                    <Typography sx={labelStyles} variant={'body2'}>
                        w/ Custom Colors
                    </Typography>
                    <ListItemTag
                        label={'active'}
                        backgroundColor={isDarkMode ? colors.red[300] : colors.red['500']}
                        fontColor={isDarkMode ? colors.black[900] : colors.white['50']}
                    />
                </Box>
            </Box>
            <Box sx={{ ...componentContainerStyles, mt: 6 }}>
                <Typography sx={labelStyles} variant={'body2'}>
                    Within an Info List Item
                </Typography>
                <InfoListItem
                    icon={<BrightnessMedium />}
                    title={'Info List Item'}
                    subtitle={'with List Item Tags'}
                    rightComponent={
                        <Box sx={{ display: 'flex' }}>
                            <ListItemTag
                                label={'Build Passing'}
                                backgroundColor={isDarkMode ? colors.green[300] : colors.green['500']}
                                fontColor={isDarkMode ? colors.black[900] : colors.white['50']}
                                sx={{
                                    mr: rtl ? 0 : 2,
                                    ml: rtl ? 2 : 0,
                                }}
                            />
                            <ListItemTag
                                label={'5 Bugs'}
                                backgroundColor={isDarkMode ? colors.red[300] : colors.red['500']}
                                fontColor={isDarkMode ? colors.black[900] : colors.white['50']}
                            />
                        </Box>
                    }
                />
            </Box>
        </>
    );
};
