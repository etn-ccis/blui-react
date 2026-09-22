import React, { useId } from 'react';
import { useTheme } from '@mui/material/styles';

export type AnchorDotProps = Omit<React.SVGProps<SVGSVGElement>, 'color'> & {
    /**
     * Visual treatment for the anchor dot.
     * @default default
     */
    variant?: 'default' | 'blue';

    /**
     * Fill colour for the anchor dot.
     */
    fillColor?: string;
};

export const AnchorDot = ({ fillColor, variant = 'default', ...svgProps }: AnchorDotProps): React.JSX.Element => {
    const id = useId().replace(/:/g, '');
    const defaultBlurId = `anchor-dot-blur-${id}`;
    const defaultShadowId = `anchor-dot-shadow-${id}`;
    const blueBlurId = `anchor-dot-blue-blur-${id}`;
    const theme = useTheme();
    const dotColor = fillColor ?? (variant === 'blue' ? theme.palette.primary.main : theme.palette.background.paper);

    if (variant === 'blue') {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                {...svgProps}
            >
                <g opacity="0.4" filter={`url(#${blueBlurId})`}>
                    <circle cx="11" cy="11" r="8.5" stroke={dotColor} />
                </g>
                <circle cx="11" cy="11" r="5" fill={dotColor} stroke="white" strokeWidth="2" />
                <defs>
                    <filter
                        id={blueBlurId}
                        x="0"
                        y="0"
                        width="22"
                        height="22"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur" />
                    </filter>
                </defs>
            </svg>
        );
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" {...svgProps}>
            <g opacity="0.5" filter={`url(#${defaultBlurId})`}>
                <circle cx="11" cy="11" r="8" stroke={dotColor} strokeWidth="2" />
            </g>
            <g filter={`url(#${defaultShadowId})`}>
                <circle cx="11" cy="11" r="4" fill={dotColor} />
            </g>
            <defs>
                <filter
                    id={defaultBlurId}
                    x="0"
                    y="0"
                    width="22"
                    height="22"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur" />
                </filter>
                <filter
                    id={defaultShadowId}
                    x="4.5"
                    y="4.5"
                    width="13"
                    height="13"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="effect1_dropShadow" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
                </filter>
            </defs>
        </svg>
    );
};

AnchorDot.displayName = 'AnchorDot';
