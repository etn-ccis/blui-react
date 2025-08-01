import React, { forwardRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { SpacerClasses, getSpacerUtilityClass, SpacerClassKey } from './SpacerClasses';
import { styled } from '@mui/material/styles';

const useUtilityClasses = (ownerState: SpacerProps): Record<SpacerClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
    };

    return composeClasses(slots, getSpacerUtilityClass, classes);
};

export type SpacerProps = BoxProps & {
    /** Flex grow/shrink value for flex layouts
     *
     * Default: 1
     */
    flex?: number;
    /** Height (in px) for static layouts */
    height?: number | string;
    /** Width (in px) for static layouts */
    width?: number | string;
    /** Custom classes for default style overrides */
    classes?: SpacerClasses;
};

const Root = styled(
    Box,
    {}
)<Pick<SpacerProps, 'flex' | 'height' | 'width'>>(({ flex, height, width }) => ({
    flex: `${flex} ${flex} ${flex === 0 ? 'auto' : '0px'}`,
    height: height || 'auto',
    width: width || 'auto',
}));

const SpacerRender: React.ForwardRefRenderFunction<unknown, SpacerProps> = (props: SpacerProps, ref: any) => {
    const { children, flex = 1, height, width, ...otherProps } = props;
    const ownerState = {
        ...props,
    };
    const generatedClasses = useUtilityClasses(ownerState);

    return (
        <Root
            ref={ref}
            data-testid={'blui-spacer-root'}
            flex={flex}
            height={height}
            width={width}
            className={generatedClasses.root}
            {...otherProps}
        >
            {children}
        </Root>
    );
};
/**
 * [Spacer](https://brightlayer-ui-components.github.io/react/components/spacer) component
 *
 * An invisible utility component that acts as a spacer element in various layouts. It works with flexbox sizing or fixed sizing.
 */
export const Spacer = forwardRef(SpacerRender);

Spacer.displayName = 'Spacer';
