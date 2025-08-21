import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import * as colors from '@brightlayer-ui/colors';
import { Spacer } from '@brightlayer-ui/react-components';
import { styled } from '@mui/material/styles';

type DeviceEditProps = {
    subTitle: string;
    updateSubTitle: (tempSubTitle: string) => void;
    navigateBack: () => void;
};

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white[50],
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.down('sm')]: {
        height: 'calc(100vh - 56px)',
    },
}));

const DialogDivider = styled(Divider)({
    width: '100%',
});

const TextFieldStyled = styled(TextField)(({ theme }) => ({
    display: 'flex',
    margin: theme.spacing(2),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
    display: 'flex',
    margin: theme.spacing(2),
}));

export const DeviceEditMobile = (props: DeviceEditProps): JSX.Element => {
    const { subTitle = '', updateSubTitle, navigateBack } = props;
    const [tempSubTitle, setTempSubTitle] = useState(subTitle);

    const onSubmit = (): void => {
        updateSubTitle(tempSubTitle);
        navigateBack();
    };

    return (
        <>
            <Container>
                <TextFieldStyled
                    onChange={(event): void => setTempSubTitle(event?.target.value)}
                    value={tempSubTitle}
                    variant="filled"
                    label="Type"
                    type="text"
                />
                <Spacer />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <DialogDivider />
                    <ButtonStyled onClick={onSubmit} color={'primary'} variant={'contained'}>
                        DONE
                    </ButtonStyled>
                </div>
            </Container>
        </>
    );
};
