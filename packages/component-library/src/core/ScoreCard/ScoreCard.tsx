import React, { useCallback, forwardRef } from 'react';
import { cx } from '@emotion/css';
import Card, { CardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import * as Colors from '@brightlayer-ui/colors';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ScoreCardClasses, ScoreCardClassKey, getScoreCardUtilityClass } from './ScoreCardClasses';
import { unstable_composeClasses as composeClasses } from '@mui/material';

const useUtilityClasses = (ownerState: ScoreCardProps): Record<ScoreCardClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        actionItems: ['actionItems'],
        badgeWrapper: ['badgeWrapper'],
        bodyWrapper: ['bodyWrapper'],
        content: ['content'],
        header: ['header'],
        headerBackground: ['headerBackground'],
        headerContent: ['headerContent'],
        headerInfo: ['headerInfo'],
        headerTitle: ['headerTitle'],
        headerSubtitle: ['headerSubtitle'],
    };

    return composeClasses(slots, getScoreCardUtilityClass, classes);
};

export type ScoreCardProps = CardProps &
    BoxProps & {
        /** Icons to show to the right of the text */
        actionItems?: React.JSX.Element[];
        /** Max number of actionItems in the header
         *
         * Default: 3
         */
        actionLimit?: number;
        /** Component to render for the footer */
        actionRow?: React.JSX.Element;
        /** Component to render in the call-out area on the right side of the card body.
         *
         * This is usually a single `Hero` or `HeroBanner`containing multiple Heroes.
         */
        badge?: React.JSX.Element;
        /** Vertical offset for the badge component
         *
         * Default: 0
         */
        badgeOffset?: number;
        /** Custom classes for default style overrides */
        classes?: ScoreCardClasses;
        /** An image to display in the header */
        headerBackgroundImage?: string;
        /** The color of the header
         *
         * Default: (theme.vars || theme).palette.primary.main
         */
        headerColor?: string;
        /** The color for text and icons in header
         *
         * Default: white
         */
        headerFontColor?: string;
        /** Tertiary text */
        headerInfo?: string | React.JSX.Element;
        /** The primary text */
        headerTitle: string;
        /** The secondary text */
        headerSubtitle?: string | React.JSX.Element;
    };

const fontColor = (headerFontColor: string): string => headerFontColor || Colors.white[50];

const Root = styled(
    Card,
    {}
)(() => ({
    flex: '1 1 0px',
}));

const FlexColumn = styled(
    Box,
    {}
)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: '1 1 0px',
    overflow: 'hidden',
}));

const Header = styled(Box, {
    shouldForwardProp: (prop) => !['headerColor', 'headerFontColor'].includes(prop.toString()),
})<Pick<ScoreCardProps, 'headerColor' | 'headerFontColor'>>(({ headerColor, headerFontColor, theme }) => ({
    height: `6.25rem`,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: headerColor || (theme.vars || theme).palette.primary.main,
    color: fontColor(headerFontColor),
    ...theme.applyStyles('dark', {
        backgroundColor: headerColor || (theme.vars || theme).palette.primary.dark,
    }),
}));

const HeaderContent = styled(
    Box,
    {}
)(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    zIndex: 1,
    alignItems: 'flex-start',
    padding: `1rem ${theme.spacing(2)} 0 ${theme.spacing(2)}`,
}));

const HeaderTitle = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'headerFontColor',
})<Pick<ScoreCardProps, 'headerFontColor'>>(({ headerFontColor }) => ({
    color: fontColor(headerFontColor),
    lineHeight: 1.4,
}));

const HeaderSubtitle = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'headerFontColor',
})<Pick<ScoreCardProps, 'headerFontColor'>>(({ headerFontColor }) => ({
    color: fontColor(headerFontColor),
    lineHeight: 1.4,
}));

const HeaderInfo = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'headerFontColor',
})<Pick<ScoreCardProps, 'headerFontColor'>>(({ headerFontColor }) => ({
    color: fontColor(headerFontColor),
    fontWeight: 300,
}));

const HeaderBackground = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'headerBackgroundImage',
})<Pick<ScoreCardProps, 'headerBackgroundImage'>>(({ headerBackgroundImage }) => ({
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    backgroundSize: 'cover',
    height: '100%',
    opacity: 0.3,
    backgroundPosition: 'center',
    backgroundImage: `url(${headerBackgroundImage})`,
}));

const Content = styled(
    Box,
    {}
)(() => ({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
}));

const BodyWrapper = styled(
    Box,
    {}
)(() => ({
    flex: '1 1 0px',
}));

const BadgeWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'badgeOffset',
})<Pick<ScoreCardProps, 'badgeOffset'>>(({ badgeOffset, theme }) => ({
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    alignSelf: badgeOffset !== 0 ? 'flex-start' : 'center',
    marginTop: badgeOffset,
}));

const ActionItems = styled(
    Box,
    {}
)(({ theme }) => ({
    marginLeft: theme.spacing(1.5),
    cursor: 'pointer',
}));

const ScoreCardRender: React.ForwardRefRenderFunction<unknown, ScoreCardProps> = (props: ScoreCardProps, ref: any) => {
    const {
        actionLimit = 3,
        actionItems,
        actionRow,
        badge,
        headerBackgroundImage,
        children,
        className: userClassName,
        headerInfo,
        headerTitle,
        headerSubtitle,
        headerColor,
        headerFontColor,
        badgeOffset = 0,
        ...otherCardProps
    } = props;

    const generatedClasses = useUtilityClasses(props);

    const getBackgroundImage = useCallback((): React.JSX.Element | undefined => {
        if (headerBackgroundImage) {
            return (
                <HeaderBackground
                    className={generatedClasses.headerBackground}
                    headerBackgroundImage={headerBackgroundImage}
                />
            );
        }
    }, [headerBackgroundImage, generatedClasses]);

    const getHeaderInfo = useCallback((): React.JSX.Element | undefined => {
        if (!headerInfo) return;
        if (typeof headerInfo === 'string') {
            return (
                <HeaderInfo
                    noWrap
                    variant={'body2'}
                    headerFontColor={headerFontColor}
                    className={generatedClasses.headerInfo}
                >
                    {headerInfo}
                </HeaderInfo>
            );
        }
        return headerInfo;
    }, [headerFontColor, headerInfo, generatedClasses]);

    const getHeaderSubtitle = useCallback((): React.JSX.Element | undefined => {
        if (!headerSubtitle) return;
        if (typeof headerSubtitle === 'string') {
            return (
                <HeaderSubtitle
                    headerFontColor={headerFontColor}
                    noWrap
                    variant={'body2'}
                    className={generatedClasses.headerSubtitle}
                >
                    {headerSubtitle}
                </HeaderSubtitle>
            );
        }
        return headerSubtitle;
    }, [headerFontColor, headerSubtitle, generatedClasses]);

    const getHeaderText = useCallback(
        (): React.JSX.Element => (
            <FlexColumn>
                <HeaderTitle
                    headerFontColor={headerFontColor}
                    variant={'h6'}
                    noWrap
                    className={generatedClasses.headerTitle}
                >
                    {headerTitle}
                </HeaderTitle>
                {getHeaderSubtitle()}
                {getHeaderInfo()}
            </FlexColumn>
        ),
        [generatedClasses, headerFontColor, headerTitle, getHeaderSubtitle, getHeaderInfo]
    );

    const getActionItems = useCallback((): React.JSX.Element[] | undefined => {
        if (actionItems) {
            return actionItems.slice(0, actionLimit).map((actionItem, index) => (
                <ActionItems key={`${index}`} className={generatedClasses.actionItems} data-testid={'blui-action-item'}>
                    {actionItem}
                </ActionItems>
            ));
        }
    }, [actionItems, actionLimit, generatedClasses]);

    const getHeroes = useCallback((): React.JSX.Element | undefined => {
        if (badge) {
            return (
                <BadgeWrapper
                    className={generatedClasses.badgeWrapper}
                    badgeOffset={badgeOffset}
                    data-testid={'blui-badge-wrapper'}
                >
                    {badge}
                </BadgeWrapper>
            );
        }
    }, [badge, badgeOffset, generatedClasses]);

    const getFooter = useCallback((): React.JSX.Element | undefined => {
        if (actionRow) {
            return (
                <>
                    <Divider />
                    {actionRow}
                </>
            );
        }
    }, [actionRow]);

    return (
        <Root
            ref={ref}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-score-card-root'}
            {...otherCardProps}
        >
            <Header
                data-testid={'blui-score-card-header'}
                className={generatedClasses.header}
                headerColor={headerColor}
                headerFontColor={headerFontColor}
            >
                {getBackgroundImage()}
                <HeaderContent className={generatedClasses.headerContent}>
                    {getHeaderText()}
                    {getActionItems()}
                </HeaderContent>
            </Header>
            <Content className={generatedClasses.content} data-testid={'blui-body-content'}>
                <BodyWrapper className={generatedClasses.bodyWrapper} data-testid={'blui-body-wrapper'}>
                    {children}
                </BodyWrapper>
                {getHeroes()}
            </Content>
            {getFooter()}
        </Root>
    );
};
/**
 * [ScoreCard](https://brightlayer-ui-components.github.io/react/components/score-card) component
 *
 * Card component that calls attention to particular values.
 */
export const ScoreCard = forwardRef(ScoreCardRender);

ScoreCard.displayName = 'ScoreCard';
