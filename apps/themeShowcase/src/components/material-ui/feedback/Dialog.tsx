import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { TransitionProps } from '@mui/material/transitions/transition';
import Close from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';

const buttonStyles = {
    mb: 2,
    width: 300,
};

const Transition = React.forwardRef(
    (props: TransitionProps & { children: React.ReactElement<any, any> }, ref: React.Ref<unknown>) => (
        <Slide direction="up" ref={ref} {...props} />
    )
);

export const DialogExample: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [fullDialogOpen, setFullDialogOpen] = React.useState(false);

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleFullDialogClickOpen = (): void => {
        setFullDialogOpen(true);
    };

    const handleFullDialogClose = (): void => {
        setFullDialogOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Button variant="outlined" color="primary" onClick={handleClickOpen} sx={buttonStyles}>
                Open Dialog
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{'Is Brightlayer UI Your Favorite Design System?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We assume this is rhetorical, but we wanted to ask anyway. The disagree button is disabled as a
                        feature, not a bug. 😉
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled>
                        Disagree
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <Button variant="outlined" color="primary" onClick={handleFullDialogClickOpen} sx={buttonStyles}>
                Open Full Screen Dialog
            </Button>
            <Dialog fullScreen open={fullDialogOpen} onClose={handleFullDialogClose} TransitionComponent={Transition}>
                <AppBar
                    sx={{
                        position: 'relative',
                    }}
                    color={'primary'}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleFullDialogClose}
                            aria-label="close"
                            size="large"
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 2.5, flex: 1 }}>
                            Select Your Favorite Brightlayer UI Component
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleFullDialogClose}>
                            Save
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItemButton>
                        <ListItemText
                            primary="AppBar"
                            secondary="An extension of the default AppBar from Material UI that can be resized / collapsed as the page is scrolled"
                        />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemText
                            primary="ChannelValue"
                            secondary="A component used to display...a channel value (and units)"
                        />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemText
                            primary="EmptyState"
                            secondary="A component that can be used as a placeholder when no data is present"
                        />
                    </ListItemButton>
                </List>
            </Dialog>
        </Box>
    );
};
