/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';
import {
    AppBar,
    Button,
    Card,
    CardContent,
    Toolbar,
    Typography,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    List,
    Snackbar,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Theme, createTheme, ThemeProvider, StyledEngineProvider, styled } from '@mui/material/styles';
import * as BLUIThemes from '@brightlayer-ui/react-themes';
import MenuIcon from '@mui/icons-material/Menu';
import { Folder, Description, Publish } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { useDispatch } from 'react-redux';
import { TOGGLE_DRAWER } from '../../../redux/actions';
import * as Colors from '@brightlayer-ui/colors';
import { InfoListItem } from '@brightlayer-ui/react-components';

type FolderItem = {
    id: number;
    name: string;
    progress: number;
    status: string;
    open: boolean;
};
const foldersList = [
    { label: 'The Best Dev Team', value: '1' },
    { label: 'The Best Design Team', value: '2' },
    { label: 'The Best UX Team', value: '3' },
    { label: 'The Best Management Team', value: '4' },
    { label: 'The Best Facility Team', value: '5' },
    { label: 'The Proudest Team', value: '6' },
];
const uploadFileList: FolderItem[] = [];

const Container = styled('div')(({ theme }) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    maxWidth: 600,
    margin: '0 auto',
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
    padding: 0,
    '&:last-child': {
        paddingBottom: 0,
    },
}));

const UploadButtonContainer = styled('div')(({ theme }) => ({
    textAlign: 'right',
    paddingBottom: theme.spacing(2),
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
    width: '100%',
}));

const RadioLabel = styled('div')({
    display: 'flex',
});

const IconStyled = styled(Folder)(({ theme }) => ({
    fill: Colors.black[200],
    marginLeft: theme.spacing(0.5),
}));

const IconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(2),
    maxWidth: '40px',
    minWidth: '40px',
    width: '40px',
    marginTop: theme.spacing(1),
}));

const FormLabelStyled = styled(FormControlLabel)(({ theme }) => ({
    margin: 0,
    width: '100%',
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const ToolbarGutters = styled(Toolbar)(({ theme }) => ({
    padding: `0 ${theme.spacing(2)}`,
}));

const PlacementOfList = styled(List)(({ theme }) => ({
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        bottom: 0,
        right: 0,
        width: '100%',
    },
}));

const FileUploadItem = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '&:last-child': {
        marginBottom: 0,
    },
}));

const SnackbarRoot = styled('div')({
    position: 'inherit',
    transform: 'none',
});

const createFileItem = (increment: number): FolderItem => ({
    id: increment,
    name: 'Brightlayer UI is Awesome.pdf',
    progress: 0,
    status: `Uploading (0%)`,
    open: true,
});

let nextFileIndex = 0;

export const ProgressBar = (): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const md = useMediaQuery(theme.breakpoints.up('md'));

    const [fileUploadList, setFileUploadList] = useState<FolderItem[]>(uploadFileList);

    const [radioButtonvalue, setRadioButtonvalue] = useState('1');
    const changeRadioGroup = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRadioButtonvalue((event.target as HTMLInputElement).value);
    };

    const uploadFile = useCallback((): void => {
        setFileUploadList((oldList) => [...oldList, createFileItem(nextFileIndex++)]);
    }, [fileUploadList, setFileUploadList]);

    const markUploadComplete = useCallback((id: number, status: string, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        } else if (!reason && status === 'Complete') {
            return;
        }
        setFileUploadList((oldList) => oldList.map((item) => (item.id === id ? { ...item, open: false } : item)));
    }, []);

    const removeFileFromList = useCallback((id: number) => {
        setFileUploadList((oldList) => oldList.filter((item) => item.id !== id));
    }, []);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            const newList = [...fileUploadList];
            for (let i = 0; i < fileUploadList.length; i++) {
                if (fileUploadList[i].progress < 100) {
                    const newPercent = Math.min(100, fileUploadList[i].progress + Math.ceil(Math.random() * 5));
                    const newItem: FolderItem = {
                        ...fileUploadList[i],
                        progress: newPercent,
                        status: `Uploading (${newPercent}%)`,
                    };
                    newList[i] = newItem;
                } else {
                    const newItem: FolderItem = {
                        ...fileUploadList[i],
                        status: `Complete`,
                    };
                    newList[i] = newItem;
                }
            }
            setFileUploadList(newList);
        }, 100);
        if (fileUploadList.length < 1) {
            clearInterval(progressInterval);
        }
        return (): void => {
            clearInterval(progressInterval);
        };
    }, [fileUploadList]);

    return (
        <div style={{ minHeight: '100vh' }}>
            <AppBar data-cy="blui-toolbar" position={'sticky'}>
                <ToolbarGutters disableGutters>
                    {md ? null : (
                        <IconButton
                            data-cy="toolbar-menu"
                            color={'inherit'}
                            onClick={(): void => {
                                dispatch({ type: TOGGLE_DRAWER, payload: true });
                            }}
                            edge={'start'}
                            style={{ marginRight: 20 }}
                            size="large"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant={'h6'} color={'inherit'}>
                        Progress Bars
                    </Typography>
                    <div />
                </ToolbarGutters>
            </AppBar>
            <Container>
                <UploadButtonContainer>
                    <Button
                        data-cy={'upload-btn'}
                        variant={'contained'}
                        color={'primary'}
                        startIcon={<Publish />}
                        onClick={uploadFile}
                    >
                        UPLOAD NEW FILE
                    </Button>
                </UploadButtonContainer>
                <Card>
                    <CardContentStyled>
                        <FormControlStyled component="fieldset">
                            <RadioGroup
                                aria-label="folder"
                                name="folder"
                                value={radioButtonvalue}
                                onChange={changeRadioGroup}
                            >
                                {foldersList.map((option, i) => (
                                    <FormLabelStyled
                                        key={i}
                                        value={option.value}
                                        control={<Radio />}
                                        label={
                                            <RadioLabel>
                                                <IconStyled />
                                                <Typography style={{ marginLeft: '16px' }}> {option.label} </Typography>
                                            </RadioLabel>
                                        }
                                    />
                                ))}
                            </RadioGroup>
                        </FormControlStyled>
                    </CardContentStyled>
                </Card>
                <PlacementOfList data-cy={'list-content'} disablePadding component="nav">
                    {fileUploadList.map(
                        (item): JSX.Element => (
                            <FileUploadItem key={item.id}>
                                <Snackbar
                                    slotProps={{
                                        root: {
                                            component: SnackbarRoot,
                                        },
                                    }}
                                    open={item.open}
                                    autoHideDuration={item.progress === 100 ? 3000 : null}
                                    onClose={(e, reason): void => markUploadComplete(item.id, item.status, reason)}
                                    TransitionProps={{
                                        timeout: 300,
                                        onExited: (): void => removeFileFromList(item.id),
                                    }}
                                    anchorOrigin={
                                        isMobile
                                            ? { vertical: 'bottom', horizontal: 'center' }
                                            : { vertical: 'bottom', horizontal: 'right' }
                                    }
                                >
                                    <div>
                                        <StyledEngineProvider injectFirst>
                                            <ThemeProvider theme={createTheme(BLUIThemes.blueDark)}>
                                                <InfoListItem
                                                    data-cy={'upload-status-snackbar'}
                                                    style={{ boxShadow: theme.shadows[6] }}
                                                    title={item.name}
                                                    subtitle={item.status}
                                                    icon={<Description />}
                                                    backgroundColor={Colors.black[900]}
                                                    rightComponent={
                                                        <Button
                                                            variant="outlined"
                                                            color="inherit"
                                                            style={{ width: 80 }}
                                                            onClick={(): void =>
                                                                markUploadComplete(item.id, item.status)
                                                            }
                                                        >
                                                            {item.progress === 100 ? 'View' : 'Cancel'}
                                                        </Button>
                                                    }
                                                />
                                                <LinearProgress variant={'determinate'} value={item.progress} />
                                            </ThemeProvider>
                                        </StyledEngineProvider>
                                    </div>
                                </Snackbar>
                            </FileUploadItem>
                        )
                    )}
                </PlacementOfList>
            </Container>
        </div>
    );
};
