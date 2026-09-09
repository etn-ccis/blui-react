import React, { forwardRef } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export type LabelProps = TypographyProps & {
    /**
     * Text string shown inside the chip.
     */
    label: string;

    /**
     * Background colour of the chip.
     * @default theme.palette.primary.main
     */
    labelBgColor?: string;

    /**
     * Text colour inside the chip.
     * @default theme.palette.primary.contrastText
     */
    labelColor?: string;
};

const Root = styled(Typography, {
    shouldForwardProp: (prop) => !['labelBgColor', 'labelColor'].includes(prop.toString()),
})<Pick<LabelProps, 'labelBgColor' | 'labelColor'>>(({ labelBgColor, labelColor, theme }) => ({
    alignItems: 'center',
    backgroundColor: labelBgColor || (theme.vars || theme).palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    color: labelColor || (theme.vars || theme).palette.primary.contrastText,
    display: 'inline-flex',
    fontWeight: 600,
    lineHeight: 1.2,
    minHeight: '1.5rem',
    padding: theme.spacing(0.25, 1),
    whiteSpace: 'nowrap',
}));

const LabelRender: React.ForwardRefRenderFunction<HTMLSpanElement, LabelProps> = (
    props: LabelProps,
    ref: React.Ref<HTMLSpanElement>
) => {
    const { label, labelBgColor, labelColor, variant = 'caption', ...otherProps } = props;

    return (
        <Root
            ref={ref}
            component="span"
            variant={variant}
            labelBgColor={labelBgColor}
            labelColor={labelColor}
            data-testid="blui-label-root"
            {...otherProps}
        >
            {label}
        </Root>
    );
};

/**
 * [Label](https://brightlayer-ui-components.github.io/react/components/label) component
 *
 * Renders an always-visible text chip at an anchor coordinate.
 */
export const Label = forwardRef(LabelRender);

Label.displayName = 'Label';
