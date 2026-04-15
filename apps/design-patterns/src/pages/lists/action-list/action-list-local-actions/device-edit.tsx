/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

type DialogProps = {
    open: boolean;
    handleClose: () => void;
    subTitle: string;
    updateSubTitle: (tempSubTitle: string) => void;
};

const DialogPaper = styled('div')(({ theme }) => ({
    width: 450,
    height: 600,
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
}));

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const DialogButton = styled(Button)(({ theme }) => ({
    width: '100%',
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(4),
}));

export const DeviceEdit = (props: DialogProps): JSX.Element => {
    const { open, handleClose, subTitle = '', updateSubTitle } = props;
    const [tempSubTitle, setTempSubTitle] = useState(subTitle);
    const onSubmit = (): void => {
        updateSubTitle(tempSubTitle);
        handleClose();
    };

    const onClose = (): void => {
        setTempSubTitle(subTitle);
        handleClose();
    };

    useEffect(() => {
        setTempSubTitle(subTitle);
    }, [subTitle]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                component: DialogPaper,
            }}
        >
            <DialogTitleStyled>Device</DialogTitleStyled>
            <DialogContent>
                <TextFieldStyled
                    onChange={(event): void => setTempSubTitle(event?.target.value)}
                    value={tempSubTitle}
                    variant="filled"
                    label="Type"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActionsStyled>
                <DialogButton onClick={onSubmit} color={'primary'} variant={'contained'} disableElevation={true}>
                    DONE
                </DialogButton>
            </DialogActionsStyled>
        </Dialog>
    );
};
