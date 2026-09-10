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
     * @default rgba (255, 255, 255, 0.72)
     */
    labelBgColor?: string;

    /**
     * Text colour inside the chip.
     * @default #353c44
     */
    labelColor?: string;
};

const Root = styled(Typography, {
    shouldForwardProp: (prop) => !['labelBgColor', 'labelColor'].includes(prop.toString()),
})<Pick<LabelProps, 'labelBgColor' | 'labelColor'>>(({ labelBgColor, labelColor, theme }) => ({
    display: 'inline-flex',
    padding: '2px 8px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '6px',
    backgroundColor: labelBgColor ?? 'rgba(255, 255, 255, 0.72)',
    color: labelColor ?? 'black',
    borderRadius: '4px',
    border: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(2px)',
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
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
