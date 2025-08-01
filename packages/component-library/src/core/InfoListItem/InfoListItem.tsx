import React, { ReactNode, useCallback, forwardRef } from 'react';
import { ListItemProps } from '@mui/material/ListItem';
import { ListItemButtonProps as MuiListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { separate, withKeys } from '../utilities';
import {
    Icon,
    Info,
    InfoListItemChevron,
    InfoListItemContentContainer,
    InfoListItemDivider,
    InfoListItemText,
    RightComponent,
    Root,
    StatusStripe,
    Subtitle,
    SubtitleSeparator,
} from './InfoListItemStyledComponents';
import { getInfoListItemUtilityClass, InfoListItemClassKey, InfoListItemClasses } from './InfoListItemClasses';
import { cx } from '@emotion/css';

const MAX_SUBTITLE_ELEMENTS = 6;

const useUtilityClasses = (ownerState: InfoListItemProps): Record<InfoListItemClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        avatar: ['avatar'],
        divider: ['divider'],
        icon: ['icon'],
        info: ['info'],
        listItemText: ['listItemText'],
        listItemButtonRoot: ['listItemButtonRoot'],
        rightComponent: ['rightComponent'],
        separator: ['separator'],
        statusStripe: ['statusStripe'],
        subtitle: ['subtitle'],
        title: ['title'],
        chevron: ['chevron'],
    };

    return composeClasses(slots, getInfoListItemUtilityClass, classes);
};

export type DividerType = 'full' | 'partial';
export type InfoListItemProps = Omit<ListItemProps, 'title' | 'divider'> & {
    /** Show colored background for icon
     *
     * Default: false
     */
    avatar?: boolean;
    /** The color used for the background */
    backgroundColor?: string;
    /** Add a chevron icon on the right
     *
     * Default: false
     */
    chevron?: boolean;
    /** Color override for the chevron icon */
    chevronColor?: string;
    /** Custom classes for default style overrides */
    classes?: InfoListItemClasses;
    /** Show a row separator below the row */
    divider?: DividerType;
    /** Main text color */
    fontColor?: string;
    /** Remove left padding if no icon is used
     *
     * Default: false
     */
    hidePadding?: boolean;
    /** A component to render for the icon */
    icon?: React.JSX.Element;
    /** Color override for the row icon */
    iconColor?: string;
    /** Icon alignment when `avatar` is set to false
     *
     * Default: 'left
     */
    iconAlign?: 'left' | 'center' | 'right';
    /** The text to show on the third line */
    info?: string | Array<string | React.JSX.Element>;
    /** Component to render on the left side */
    leftComponent?: ReactNode;
    /** Component to render on the right side */
    rightComponent?: ReactNode;
    /** Whether to apply material ripple effect on click
     *
     * Default: false
     */
    ripple?: boolean;
    /** Status stripe and icon color */
    statusColor?: string;
    /** The text to show on the second line */
    subtitle?: string | Array<string | React.JSX.Element>;
    /** Separator character for subtitle and info
     *
     * Default: '·' ('\u00B7')
     */
    subtitleSeparator?: string;
    /** The text to show on the first line */
    title: ReactNode;
    /** Whether the info line text should wrap to multiple lines on overflow
     *
     * Default: false
     */
    wrapInfo?: boolean;
    /** Whether the subtitle line text should wrap to multiple lines on overflow
     *
     * Default: false
     */
    wrapSubtitle?: boolean;
    /** Whether the title line text should wrap to multiple lines on overflow
     *
     * Default: false
     */
    wrapTitle?: boolean;
    /** Used to override [ListItemButton](https://mui.com/api/list-item-button/) default props */
    ListItemButtonProps?: Partial<MuiListItemButtonProps>;
};
const InfoListItemRender: React.ForwardRefRenderFunction<unknown, InfoListItemProps> = (
    props: InfoListItemProps,
    ref: any
) => {
    const generatedClasses = useUtilityClasses(props);
    const {
        avatar = false,
        chevron = false,
        dense = false,
        className: userClassName,
        divider,
        hidePadding = false,
        icon,
        leftComponent,
        rightComponent,
        ripple = false,
        subtitle,
        subtitleSeparator = '\u00B7',
        info,
        title,
        wrapInfo = false,
        wrapSubtitle = false,
        wrapTitle = false,
        // ignore unused vars so that we can do prop transferring to the root element

        backgroundColor,
        chevronColor,
        fontColor,
        iconAlign = 'left',
        iconColor,
        statusColor,
        onClick,
        ...otherListItemProps
    } = props;

    const getIcon = useCallback((): React.JSX.Element | undefined => {
        if (icon) {
            return (
                <ListItemAvatar style={{ minWidth: 'unset' }}>
                    <Icon
                        statusColor={statusColor}
                        iconColor={iconColor}
                        avatar={avatar}
                        iconAlign={iconAlign}
                        className={generatedClasses[avatar ? 'avatar' : 'icon']}
                    >
                        {icon}
                    </Icon>
                </ListItemAvatar>
            );
        } else if (!hidePadding) {
            return (
                // a dummy component to maintain the padding
                <ListItemAvatar style={{ minWidth: 'unset' }}>
                    <Icon
                        className={generatedClasses.avatar}
                        statusColor={statusColor}
                        iconColor={iconColor}
                        avatar={avatar}
                        isInvisible={true}
                    />
                </ListItemAvatar>
            );
        }
    }, [avatar, icon, iconAlign, iconColor, statusColor, hidePadding, generatedClasses]);

    const getRightComponent = useCallback(
        (): React.JSX.Element | undefined => (
            <>
                {rightComponent && (
                    <RightComponent className={generatedClasses.rightComponent}>{rightComponent}</RightComponent>
                )}
                {chevron && (
                    <InfoListItemChevron
                        chevronColor={chevronColor}
                        color={'inherit'}
                        role={'button'}
                        className={generatedClasses.chevron}
                    />
                )}
            </>
        ),
        [rightComponent, chevron, chevronColor, generatedClasses]
    );

    const getSeparator = useCallback(
        (): React.JSX.Element => (
            <SubtitleSeparator className={generatedClasses.separator} component="span">
                {subtitleSeparator || '\u00B7'}
            </SubtitleSeparator>
        ),
        [generatedClasses, subtitleSeparator]
    );

    const getSubtitle = useCallback((): string | null => {
        if (!subtitle) {
            return null;
        }
        if (typeof subtitle === 'string') {
            return subtitle;
        }

        const subtitleParts = Array.isArray(subtitle) ? [...subtitle] : [subtitle];
        const renderableSubtitleParts = subtitleParts.splice(0, MAX_SUBTITLE_ELEMENTS);

        return withKeys(separate(renderableSubtitleParts, () => getSeparator()));
    }, [subtitle, getSeparator]);

    const getInfo = useCallback((): string | null => {
        if (!info) {
            return null;
        }
        if (typeof info === 'string') {
            return info;
        }

        const infoParts = Array.isArray(info) ? [...info] : [info];
        const renderableInfoParts = infoParts.splice(0, MAX_SUBTITLE_ELEMENTS);

        return withKeys(separate(renderableInfoParts, () => getSeparator()));
    }, [info, getSeparator]);

    const getInfoListItemContent = (): React.JSX.Element => (
        <>
            <StatusStripe
                statusColor={statusColor}
                className={generatedClasses.statusStripe}
                data-testid={'blui-status-stripe'}
            />
            {divider && <InfoListItemDivider divider={divider} className={generatedClasses.divider} />}
            {(icon || !hidePadding) && getIcon()}
            {leftComponent}
            <InfoListItemText
                primary={title}
                leftComponent={leftComponent}
                className={generatedClasses.listItemText}
                secondary={
                    subtitle || info ? (
                        <>
                            {subtitle ? (
                                <Subtitle
                                    variant="subtitle2"
                                    component="div"
                                    fontColor={fontColor}
                                    noWrap={!wrapSubtitle}
                                    className={generatedClasses.subtitle}
                                >
                                    {getSubtitle()}
                                </Subtitle>
                            ) : undefined}
                            {info ? (
                                <Info
                                    variant={'body2'}
                                    component="div"
                                    fontColor={fontColor}
                                    noWrap={!wrapInfo}
                                    className={generatedClasses.info}
                                >
                                    {getInfo()}
                                </Info>
                            ) : undefined}
                        </>
                    ) : undefined
                }
                primaryTypographyProps={{
                    noWrap: !wrapTitle,
                    variant: 'body1',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    display: 'block',
                    color: fontColor || 'inherit',
                    className: generatedClasses.title,
                    component: 'div',
                }}
                secondaryTypographyProps={{
                    variant: 'subtitle2',
                    color: 'textPrimary',
                }}
            />
            {getRightComponent()}
        </>
    );

    return (
        <Root
            onClick={onClick}
            backgroundColor={backgroundColor}
            wrapSubtitle={wrapSubtitle}
            wrapTitle={wrapTitle}
            wrapInfo={wrapInfo}
            dense={dense}
            ripple={ripple}
            iconColor={iconColor}
            className={cx(generatedClasses.root, userClassName)}
            ref={ref}
            {...otherListItemProps}
        >
            {onClick && ripple ? (
                <InfoListItemContentContainer className={generatedClasses.listItemButtonRoot} focusRipple={ripple}>
                    {getInfoListItemContent()}
                </InfoListItemContentContainer>
            ) : (
                getInfoListItemContent()
            )}
        </Root>
    );
};
/**
 * [InfoListItem](https://brightlayer-ui-components.github.io/react/components/info-list-item) component
 *
 * The `<InfoListItem>` is intended to be used in [`<List>`](https://material-ui.com/api/list/) views. It positions a title as well as optional subtitle(s), icon, and status stripe.
 */
export const InfoListItem = forwardRef(InfoListItemRender);

InfoListItem.displayName = 'InfoListItem';
