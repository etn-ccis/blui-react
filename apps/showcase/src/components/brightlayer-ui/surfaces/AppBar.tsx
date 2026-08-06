import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import { getBodyFiller } from '../../../utils/utils';
import { AppBar, ThreeLiner } from '@brightlayer-ui/react-components';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/icons-material/Menu';

const containerStyles = {
    mb: 2,
    overflow: 'hidden',
    height: 400,
    '& .title': {},
    '& .subtitle': {},
    '& .info': {},

    '& .expanded': {
        '& .liner': {
            top: 64,
        },
    },

    '& .collapsed': {
        '& .title': {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        '& .subtitle': {
            fontSize: 0,
        },
        '& .info': {
            fontSize: '1rem',
            fontWeight: 400,
            mt: '-0.25rem',
        },
    },
};

const linerStyles = {
    top: 0,
    position: 'relative',
};

const stickyAppBarStyles = {
    zIndex: 0,
};

export const BLUIAppBarExample: React.FC = () => (
    <>
        <Box sx={containerStyles}>
            <AppBar
                classes={{ collapsed: 'collapsed', expanded: 'expanded' }}
                scrollContainerId={'appbarBodyFiller1'}
                position={'sticky'}
                style={stickyAppBarStyles}
            >
                <Toolbar>
                    <ThreeLiner
                        sx={linerStyles}
                        className={'liner'}
                        classes={{ title: 'title' }}
                        title={'Title'}
                        animationDuration={300}
                    />
                </Toolbar>
            </AppBar>
            <Box id="appbarBodyFiller1" sx={{ height: 400, overflow: 'scroll' }}>
                {getBodyFiller()}
            </Box>
        </Box>

        <Box sx={containerStyles}>
            <AppBar
                classes={{ collapsed: 'collapsed', expanded: 'expanded' }}
                scrollContainerId={'appbarBodyFiller2'}
                position={'sticky'}
                style={stickyAppBarStyles}
            >
                <Toolbar>
                    <ThreeLiner
                        sx={linerStyles}
                        className={'liner'}
                        classes={{ title: 'title', subtitle: 'subtitle', info: 'info' }}
                        title={'W/ Dynamic Content'}
                        subtitle={'Subtitle'}
                        info={'Info'}
                        animationDuration={300}
                    />
                </Toolbar>
            </AppBar>
            <Box id="appbarBodyFiller2" sx={{ height: 400, overflow: 'scroll' }}>
                {getBodyFiller()}
            </Box>
        </Box>
        <Box sx={{ ...containerStyles, position: 'relative', overflow: 'auto' }}>
            <AppBar position="sticky" variant="collapsed" overlay style={stickyAppBarStyles}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" size="large">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">Transparent Overlay</Typography>
                </Toolbar>
            </AppBar>
            {getBodyFiller()}
        </Box>
        <Box sx={{ ...containerStyles, position: 'relative' }}>
            <Box id="appbarBodyFiller3" sx={{ height: 400, overflow: 'auto' }}>
                <AppBar
                    classes={{ collapsed: 'collapsed', expanded: 'expanded' }}
                    position={'sticky'}
                    overlay
                    scrollContainerId={'appbarBodyFiller3'}
                    style={stickyAppBarStyles}
                >
                    <Toolbar>
                        <ThreeLiner
                            sx={linerStyles}
                            className={'liner'}
                            classes={{ title: 'title', subtitle: 'subtitle', info: 'info' }}
                            title={'Extended AppBar Overlay'}
                            subtitle={'Subtitle'}
                            info={'Info'}
                            animationDuration={300}
                        />
                    </Toolbar>
                </AppBar>
                {getBodyFiller()}
            </Box>
        </Box>
    </>
);
