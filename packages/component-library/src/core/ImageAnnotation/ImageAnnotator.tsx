import React, { ReactNode, forwardRef, useContext, createContext } from 'react';
import { Box, SxProps, unstable_composeClasses as composeClasses } from '@mui/material';
import { cx } from '@emotion/css';
import { styled } from '@mui/material/styles';
import {
    ImageAnnotationClasses,
    ImageAnnotationClassKey,
    getImageAnnotationUtilityClass,
} from './ImageAnnotationClasses';

/**
 * Context for managing the global "only one card open at a time" policy
 */
type ImageAnnotatorContextValue = {
    activeId?: string;
    setActiveId?: (id: string | undefined) => void;
};

const ImageAnnotatorContext = createContext<ImageAnnotatorContextValue>({});

/**
 * Hook to access the ImageAnnotator context
 */
export const useImageAnnotatorContext = (): ImageAnnotatorContextValue => useContext(ImageAnnotatorContext);

export type ImageAnnotatorProps = {
    /**
     * Image source URL
     */
    src: string;

    /**
     * Image alt text for accessibility
     * @default ''
     */
    alt?: string;

    /**
     * Container width
     * @default '100%'
     */
    width?: string | number;

    /**
     * Container height
     * @default 'auto'
     */
    height?: string | number;

    /**
     * `AnchorPoint` instances.
     */
    children?: ReactNode;

    /**
     * Style override slots
     */
    classes?: ImageAnnotationClasses;

    /**
     * MUI sx override
     */
    sx?: SxProps;
};

const useUtilityClasses = (ownerState: ImageAnnotatorProps): Record<ImageAnnotationClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        image: ['image'],
    };

    return composeClasses(slots, getImageAnnotationUtilityClass, classes);
};

const Root = styled(Box, {
    shouldForwardProp: (prop) => !['width', 'height'].includes(prop.toString()),
})<Pick<ImageAnnotatorProps, 'width' | 'height'>>(({ width, height }) => ({
    position: 'relative',
    width: width || '100%',
    height: height || 'auto',
    display: 'block',
    overflow: 'hidden',
}));

const Image = styled('img')(() => ({
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
}));

const ImageAnnotatorRender: React.ForwardRefRenderFunction<HTMLDivElement, ImageAnnotatorProps> = (
    props: ImageAnnotatorProps,
    ref: React.Ref<HTMLDivElement>
) => {
    const { src, alt = '', width = '100%', height = 'auto', children, classes = {}, sx, ...otherProps } = props;
    const generatedClasses = useUtilityClasses({ ...props, classes });

    return (
        <Root
            ref={ref}
            className={cx(generatedClasses.root)}
            width={width}
            height={height}
            sx={sx}
            data-testid="blui-image-annotator-root"
            {...otherProps}
        >
            <Image src={src} alt={alt} className={generatedClasses.image} data-testid="blui-image-annotator-image" />
            {children}
        </Root>
    );
};

/**
 * [ImageAnnotator](https://brightlayer-ui-components.github.io/react/components/image-annotator) component
 *
 * Wraps an image and creates a relative positioning context for all anchors.
 * Supports optional global "only one card open at a time" policy.
 */
export const ImageAnnotator = forwardRef(ImageAnnotatorRender);
