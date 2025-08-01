import React, { ReactNode, useCallback, forwardRef } from 'react';
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useDrawerContext } from '../DrawerContext';
import drawerHeaderClasses, {
    DrawerHeaderClasses,
    DrawerHeaderClassKey,
    getDrawerHeaderUtilityClass,
} from './DrawerHeaderClasses';
import clsx from 'clsx';
import { styled, SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { convertColorNameToHex } from '../../Utility';

const useUtilityClasses = (ownerState: DrawerHeaderProps): Record<DrawerHeaderClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
        background: ['background'],
        content: ['content'],
        navigation: ['navigation'],
        nonClickable: ['nonClickable'],
        nonClickableIcon: ['nonClickableIcon'],
        railIcon: ['railIcon'],
        subtitle: ['subtitle'],
        title: ['title'],
    };

    return composeClasses(slots, getDrawerHeaderUtilityClass, classes);
};

export type DrawerHeaderProps = ToolbarProps & {
    /** The color used for the background */
    backgroundColor?: string;
    /** An image to display in the header */
    backgroundImage?: string;
    /** The opacity of the background image
     *
     *  Default: 0.3
     */
    backgroundOpacity?: number;
    /** Custom classes for default style overrides */
    classes?: DrawerHeaderClasses;
    /** Optional divider which appears beneath header */
    divider?: boolean;
    /** The color of the text elements
     *
     *  Default: false
     */
    fontColor?: string;
    /** A component to render for the icon  */
    icon?: ReactNode;
    /** A function to execute when the icon is clicked
     *
     * Default: `() => {}`
     */
    onIconClick?: () => void;
    /** The text to show on the second line */
    subtitle?: string;
    /** The text to show on the first line */
    title?: string;
    /** Custom content for header title area */
    titleContent?: ReactNode;
    /** Optional sx props to apply style overrides */
    sx?: SxProps<Theme>;
};

const Root = styled(Toolbar, {
    shouldForwardProp: (prop) => !['backgroundColor', 'fontColor'].includes(prop.toString()),
})<Pick<DrawerHeaderProps, 'backgroundColor' | 'fontColor'>>(({ backgroundColor, fontColor, theme }) => ({
    width: '100%',
    alignItems: 'center',
    boxSizing: 'border-box',
    minHeight: `4rem`,
    [theme.breakpoints.down('sm')]: {
        minHeight: `3.5rem`,
    },
    backgroundColor: backgroundColor || (theme.vars || theme).palette.primary.main,
    // TODO: Update to use theme.vars.palette.primary.main
    color:
        fontColor ||
        theme.palette.getContrastText(convertColorNameToHex(backgroundColor) || theme.palette.primary.main),
    ...theme.applyStyles('dark', {
        backgroundColor: backgroundColor || (theme.vars || theme).palette.primary.dark,
        // TODO: Update to use theme.vars.palette.primary.main
        color:
            fontColor ||
            theme.palette.getContrastText(convertColorNameToHex(backgroundColor) || theme.palette.primary.dark),
    }),
    [`& .${drawerHeaderClasses.nonClickable}`]: {},
    [`& .${drawerHeaderClasses.railIcon}`]: {
        marginLeft: theme.spacing(0.5),
        minWidth: 'calc(3.5rem + 16px)',
        justifyContent: 'center',
        [`&.${drawerHeaderClasses.nonClickable}`]: {
            marginLeft: 0,
        },
    },
}));

const Background = styled(Box, {
    shouldForwardProp: (prop) => !['backgroundImage', 'backgroundOpacity'].includes(prop.toString()),
})<Pick<DrawerHeaderProps, 'backgroundImage' | 'backgroundOpacity'>>(({ backgroundImage, backgroundOpacity }) => ({
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    backgroundSize: 'cover',
    height: '100%',
    backgroundPosition: 'center',
    backgroundImage: `url(${backgroundImage})`,
    opacity: backgroundOpacity,
}));

const Navigation = styled(
    Box,
    {}
)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    minWidth: '2.5rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
}));

const Content = styled(
    Box,
    {}
)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: '4rem',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'column',
    width: 'calc(100% - 2.5rem - 32px)',
    boxSizing: 'border-box',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
        minHeight: `3.5rem`,
    },
}));

const Title = styled(
    Typography,
    {}
)(() => ({
    fontWeight: 600,
    lineHeight: '1.6rem', // Anything lower than 1.6rem cuts off bottom text of 'g' or 'y'.
}));

const Subtitle = styled(
    Typography,
    {}
)(() => ({
    lineHeight: '1.2rem', // Anything lower than 1.2rem cuts off bottom text of 'g' or 'y'.
    marginTop: '-0.125rem',
}));

const NonClickableIcon = styled(
    Box,
    {}
)(() => ({
    display: 'flex',
    padding: 0,
}));

const DrawerHeaderRender: React.ForwardRefRenderFunction<unknown, DrawerHeaderProps> = (
    props: DrawerHeaderProps,
    ref: any
) => {
    const generatedClasses = useUtilityClasses(props);
    const {
        backgroundImage,
        divider = false,
        icon,
        onIconClick,
        subtitle,
        title,
        titleContent,
        backgroundColor,
        backgroundOpacity = 0.3,
        fontColor,
        disableGutters,
        sx,

        ...otherToolbarProps
    } = props;

    const { variant = 'persistent', condensed = false } = useDrawerContext();

    const getHeaderContent = useCallback(
        (): ReactNode =>
            titleContent || (
                <Content className={generatedClasses.content}>
                    <Title
                        noWrap
                        variant={'h6'}
                        className={generatedClasses.title}
                        data-testid={'blui-drawer-header-title'}
                    >
                        {title}
                    </Title>

                    {subtitle && (
                        <Subtitle
                            noWrap
                            variant={'body2'}
                            className={generatedClasses.subtitle}
                            data-testid={'blui-drawer-header-subtitle'}
                        >
                            {subtitle}
                        </Subtitle>
                    )}
                </Content>
            ),
        [generatedClasses, title, subtitle, titleContent]
    );

    const getBackgroundImage = useCallback(
        (): React.JSX.Element | null =>
            backgroundImage ? (
                <Background
                    className={generatedClasses.background}
                    backgroundImage={backgroundImage}
                    backgroundOpacity={backgroundOpacity}
                />
            ) : null,
        [backgroundImage, generatedClasses, backgroundOpacity]
    );

    return (
        <>
            <Root
                ref={ref}
                data-testid={'blui-drawer-header'}
                className={generatedClasses.root}
                backgroundColor={backgroundColor}
                fontColor={fontColor}
                disableGutters={disableGutters}
                sx={sx}
                {...otherToolbarProps}
            >
                {getBackgroundImage()}
                {icon && (
                    <Navigation
                        className={clsx(generatedClasses.navigation, {
                            [generatedClasses.railIcon]: variant === 'rail' && !condensed,
                            [generatedClasses.nonClickable]: variant === 'rail' && !condensed && !onIconClick,
                        })}
                    >
                        {onIconClick && (
                            <IconButton
                                color={'inherit'}
                                onClick={(): void => {
                                    onIconClick();
                                }}
                                edge={'start'}
                                size={'large'}
                            >
                                {icon}
                            </IconButton>
                        )}
                        {!onIconClick && (
                            <NonClickableIcon className={generatedClasses.nonClickableIcon}>{icon}</NonClickableIcon>
                        )}
                    </Navigation>
                )}
                {getHeaderContent()}
            </Root>
            {divider && <Divider />}
        </>
    );
};
/**
 * [DrawerHeader](https://brightlayer-ui-components.github.io/react/components/drawer-header) component
 *
 * The `<DrawerHeader>` contains the content at the top of the `<Drawer>`. By default, it renders multiple lines of text in the Brightlayer UI style. If you supply a `titleContent`, you can render your own custom content in the title area.
 */
export const DrawerHeader = forwardRef(DrawerHeaderRender);

DrawerHeader.displayName = 'DrawerHeader';
