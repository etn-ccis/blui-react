import React from 'react';
import { Drawer as MuiDrawer, Typography, List, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TFunction } from 'i18next';

// Load moment.js locales
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/zh-cn';
import 'moment/locale/ar';
import 'moment/locale/pt';

import BoltIcon from '@mui/icons-material/OfflineBolt';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

import { english } from './translations/english';
import './translations/i18n';
import { InfoListItem } from '@brightlayer-ui/react-components';

const Header = styled('div')(({ theme }) => ({
    height: '180px',
    color: 'white',
    background: theme.palette.primary.main,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
}));

const FlexVert = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: '100%',
    width: '100%',
});

type IconArrayType = Array<{ icon: React.ReactNode; flipRTL: boolean }>;

const iconArray: IconArrayType = [
    { icon: <HomeIcon />, flipRTL: false },
    { icon: <FolderIcon />, flipRTL: false },
    { icon: <ErrorIcon />, flipRTL: true },
    { icon: <SettingsIcon />, flipRTL: false },
    { icon: <HelpIcon />, flipRTL: true },
];

const menuItems = english.translations.MENU_ITEMS;

type DrawerProps = {
    R2L: boolean;
    open: boolean;
    drawerToggler: () => void;
    translator: TFunction;
    lang: string;
};

export const Drawer = (props: DrawerProps): JSX.Element => {
    const { R2L, open, drawerToggler, translator: t, lang } = props;
    const theme = useTheme();

    return (
        <MuiDrawer
            open={open}
            onClose={drawerToggler}
            PaperProps={{ sx: { maxWidth: '85%', width: 350 } }}
            anchor={R2L ? 'left' : 'right'}
        >
            <FlexVert>
                <Header dir={R2L ? 'rtl' : 'ltr'}>
                    <BoltIcon style={{ fontSize: '64px', transform: 'rotate(42deg)' }} />
                    <div style={{ padding: theme.spacing(0.5) }}>
                        <Typography variant={'h5'} color={'inherit'}>
                            {t('Brightlayer')} UI
                        </Typography>
                        <Typography variant={'subtitle1'} color={'inherit'}>
                            {t('I18N')}
                        </Typography>
                        <Typography variant={'subtitle1'} color={'inherit'}>
                            {moment()
                                .locale(lang === 'zh' ? 'zh-cn' : lang)
                                .format('LL')}
                        </Typography>
                    </div>
                </Header>
                <div>
                    <List dir={R2L ? 'rtl' : 'ltr'} disablePadding>
                        {Object.keys(menuItems).map((menuItem, index) => (
                            <InfoListItem
                                dense
                                title={t(`MENU_ITEMS.${menuItem}`)}
                                icon={
                                    <span
                                        style={
                                            R2L && iconArray[index].flipRTL ? { transform: 'scaleX(-1)' } : undefined
                                        }
                                    >
                                        {iconArray[index].icon}
                                    </span>
                                }
                                key={menuItem}
                                onClick={drawerToggler}
                                style={R2L ? { textAlign: 'right' } : undefined}
                            />
                        ))}
                    </List>
                </div>
            </FlexVert>
        </MuiDrawer>
    );
};
