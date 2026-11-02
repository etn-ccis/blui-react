import React, { forwardRef, ReactNode } from 'react';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import { AnchorPoint, AnchorPointProps } from '../components';
import Color from 'color';

const MIN_CARD_WIDTH = 80;
const MAX_CARD_WIDTH = 400;

export type CardContentData = {
    cardHeader: string;
    cardData: Array<{
        label: string;
        value: string;
    }>;
};

const isCardContentData = (content: CardProps['cardContent']): content is CardContentData =>
    typeof content === 'object' && content !== null && 'cardHeader' in content && 'cardData' in content;

export type CardProps = MuiCardProps &
    AnchorPointProps & {
        /**
         * Content rendered inside the card when cardContent is undefined.
         */
        children?: ReactNode;

        /**
         * Card width in px, clamped between 80 and 400; height expands to fit content.
         * @default 160
         */
        cardWidth?: number;

        /**
         * A header and label/value rows, or custom React content.
         * Takes precedence over children when provided.
         */
        cardContent?: CardContentData | ReactNode;
    };

const CardHeader = styled(Typography)({
    width: '100%',
    minWidth: 0,
    overflowWrap: 'anywhere',
});

const CardDataRow = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    width: '100%',
    marginTop: '4px',
    marginBottom: '4px',
}));

const CardField = styled(Typography)(({ theme }) => ({
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1,
    letterSpacing: 0,
    minWidth: 0,
    overflowWrap: 'anywhere',
    '&.card-field-label': {
        color: BLUIColors.gray[500],
        ...theme.applyStyles('dark', { color: BLUIColors.black[200] }),
    },
    '&.card-field-value': {
        textAlign: 'right',
        color: BLUIColors.black[500],
        ...theme.applyStyles('dark', { color: BLUIColors.black[50] }),
    },
}));

const CardDivider = styled(Divider)(({ theme }) => ({
    width: '100%',
    borderColor: 'rgba(77, 92, 106, 0.12)',
    boxShadow: '0 0 20px #FFF, 0 0 12px #FFF, 0 0 8px #FFF, 0 0 6px #FFF',
    ...theme.applyStyles('dark', {
        borderColor: 'rgba(245, 250, 255, 0.10)',
        boxShadow:
            '0 0 20px rgba(0, 0, 0, 0.64), 0 0 12px rgba(0, 0, 0, 0.64), 0 0 8px rgba(0, 0, 0, 0.64), 0 0 6px rgba(0, 0, 0, 0.64)',
    }),
}));

const StyledCard = styled(MuiCard, {
    shouldForwardProp: (prop) => prop !== 'cardWidth',
})<Pick<CardProps, 'cardWidth'>>(({ cardWidth, theme }) => ({
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: `${theme.spacing(1.25)} ${theme.spacing(1.5)}`,
    width: cardWidth,
    position: 'relative',
    zIndex: 0,
    background: Color(BLUIColors.white[50]).alpha(0.72).string(),
    backdropFilter: 'blur(2px)',
    border: '1px solid rgba(77, 92, 106, 0.12)',
    borderRadius: theme.spacing(1),
    boxShadow: '0 1px 12px 0 rgba(0, 0, 0, 0.12)',
    textShadow: '0 0 20px #FFF, 0 0 12px #FFF, 0 0 8px #FFF, 0 0 6px #FFF',
    ...theme.applyStyles('dark', {
        background: 'rgba(14, 18, 24, 0.64)',
        textShadow:
            '0 0 20px rgba(0, 0, 0, 0.64), 0 0 12px rgba(0, 0, 0, 0.64), 0 0 8px rgba(0, 0, 0, 0.64), 0 0 6px rgba(0, 0, 0, 0.64)',
    }),
}));

const CardRender: React.ForwardRefRenderFunction<unknown, CardProps> = (props: CardProps, ref: any) => {
    const {
        children,
        cardContent,
        cardWidth = 160,
        x,
        y,
        classes,
        sx,
        callout,
        direction,
        connectorLength,
        connectorColor,
        connectorThickness,
        autoFlip,
        anchorDotColor,
        ...cardProps
    } = props;

    const clampedWidth = Math.min(Math.max(cardWidth, MIN_CARD_WIDTH), MAX_CARD_WIDTH);
    const content = cardContent === undefined ? children : cardContent;
    const anchorPointProps = {
        x,
        y,
        classes,
        sx,
        callout,
        direction,
        connectorLength,
        connectorColor,
        connectorThickness,
        autoFlip,
        anchorDotColor,
    } as AnchorPointProps;

    return (
        <AnchorPoint {...anchorPointProps}>
            <StyledCard ref={ref} cardWidth={clampedWidth} sx={sx} data-testid="blui-card-root" {...cardProps}>
                {isCardContentData(content) ? (
                    <>
                        <CardHeader variant="subtitle2">{content.cardHeader}</CardHeader>
                        <CardDivider />
                        {content.cardData.map(({ label, value }, index) => (
                            <CardDataRow key={index}>
                                <CardField variant="body2" className="card-field-label">
                                    {label}
                                </CardField>
                                <CardField variant="body2" className="card-field-value">
                                    {value}
                                </CardField>
                            </CardDataRow>
                        ))}
                    </>
                ) : (
                    content
                )}
            </StyledCard>
        </AnchorPoint>
    );
};

/**
 * [Card](https://brightlayer-ui-components.github.io/react/components/card) component
 *
 * Renders an always-visible card pinned directly at the anchor coordinate.
 */
export const CardAnchorPoint = forwardRef(CardRender);

CardAnchorPoint.displayName = 'CardAnchorPoint';
