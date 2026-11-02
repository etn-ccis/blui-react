import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppBar } from '@brightlayer-ui/react-components';
import { getBodyFiller, ExampleShowcase } from '../../../shared';

export const AppBarOverlayExample = (): React.JSX.Element => (
    <ExampleShowcase>
        <Box sx={{ height: 400, overflow: 'auto', backgroundColor: 'background.paper', width: 450, mx: 'auto' }}>
            <AppBar position="sticky" overlay color="transparent" sx={{ width: 450, mx: 'auto', zIndex: 'auto' }}>
                <Toolbar>
                    <Typography variant="h6">Overlay</Typography>
                </Toolbar>
            </AppBar>
            {getBodyFiller()}
        </Box>
    </ExampleShowcase>
);
