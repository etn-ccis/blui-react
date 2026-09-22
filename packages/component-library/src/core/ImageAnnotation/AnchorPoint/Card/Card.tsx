import React, { forwardRef, ReactNode } from 'react';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { AnchorPoint, AnchorPointProps } from '../AnchorPoint';

const MIN_CARD_WIDTH = 80;
const MAX_CARD_WIDTH = 400;

export type CardProps = MuiCardProps &
    AnchorPointProps & {
        /**
         * Any JSX rendered inside the card.
         */
        children?: ReactNode;

        /**
         * Card width in px, clamped between 80 and 400; height expands to fit content.
         * @default 160
         */
        cardWidth?: number;
    };

const StyledCard = styled(MuiCard, {
    shouldForwardProp: (prop) => prop !== 'cardWidth',
})<Pick<CardProps, 'cardWidth'>>(({ cardWidth, theme }) => ({
    height: 'auto',
    padding: theme.spacing(1.5),
    width: cardWidth,
}));

const CardRender: React.ForwardRefRenderFunction<HTMLDivElement, CardProps> = (
    props: CardProps,
    ref: React.Ref<HTMLDivElement>
) => {
    const { children, cardWidth = 160, ...otherProps } = props;

    const clampedWidth = Math.min(Math.max(cardWidth, MIN_CARD_WIDTH), MAX_CARD_WIDTH);

    return (
        <AnchorPoint {...otherProps}>
            <StyledCard ref={ref} cardWidth={clampedWidth} data-testid="blui-card-root" {...otherProps}>
                {children}
            </StyledCard>
        </AnchorPoint>
    );
};

/**
 * [Card](https://brightlayer-ui-components.github.io/react/components/card) component
 *
 * Renders an always-visible card pinned directly at the anchor coordinate.
 */
export const Card = forwardRef(CardRender);

Card.displayName = 'Card';
