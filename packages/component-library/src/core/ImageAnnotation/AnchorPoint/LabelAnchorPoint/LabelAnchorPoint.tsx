import React, { forwardRef } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { AnchorPoint, AnchorPointProps } from '../AnchorPoint';

export type LabelProps = AnchorPointProps &
    TypographyProps & {
        /**
         * Text string shown inside the chip.
         */
        label: string;

        /**
         * Background colour of the chip.
         * @default rgba (255, 255, 255, 0.72)
         */
        labelBgColor?: string;

        /**
         * Text colour inside the chip.
         * @default #353c44
         */
        labelColor?: string;
    };

const StyledLabel = styled(Typography, {
    shouldForwardProp: (prop) => !['labelBgColor', 'labelColor'].includes(prop.toString()),
})<Pick<LabelProps, 'labelBgColor' | 'labelColor'>>(({ labelBgColor, labelColor, theme }) => ({
    display: 'inline-flex',
    padding: '2px 8px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: labelBgColor ?? theme.vars?.palette?.background?.default ?? theme.palette.background.default,
    color: labelColor ?? theme.vars?.palette?.text?.primary ?? theme.palette.text.primary,
    borderRadius: '4px',
    border: '1px solid rgba(77, 92, 106, 0.12)',
    backdropFilter: 'blur(2px)',
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    maxWidth: '180px',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 12px 0 rgba(0, 0, 0, 0.12)',
}));

const LabelRender: React.ForwardRefRenderFunction<unknown, LabelProps> = (props: LabelProps, ref: any) => {
    const { label, labelBgColor, labelColor, ...otherProps } = props;

    return (
        <AnchorPoint {...(otherProps as AnchorPointProps)}>
            <StyledLabel
                ref={ref}
                component="span"
                labelBgColor={labelBgColor}
                labelColor={labelColor}
                data-testid="blui-label-root"
                {...otherProps}
            >
                {label}
            </StyledLabel>
        </AnchorPoint>
    );
};

/**
 * [Label](https://brightlayer-ui-components.github.io/react/components/label) component
 *
 * Renders an always-visible text chip at an anchor coordinate.
 */
export const LabelAnchorPoint = forwardRef(LabelRender);

LabelAnchorPoint.displayName = 'LabelAnchorPoint';
