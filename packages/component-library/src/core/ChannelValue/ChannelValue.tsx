import React, { useCallback, forwardRef } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { cx } from '@emotion/css';
import { styled } from '@mui/material/styles';
import channelValueClasses, {
    ChannelValueClasses,
    ChannelValueClassKey,
    getChannelValueUtilityClass,
} from './ChannelValueClasses';
import { unstable_composeClasses as composeClasses, ThemeProvider } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

const useUtilityClasses = (ownerState: ChannelValueProps): Record<ChannelValueClassKey, string> => {
    const { classes } = ownerState;

    const slots = {
        root: ['root'],
        icon: ['icon'],
        text: ['text'],
        value: ['value'],
        units: ['units'],
    };

    return composeClasses(slots, getChannelValueUtilityClass, classes);
};

export type ChannelValueProps = Omit<BoxProps, 'prefix'> & {
    /** Custom classes for default style overrides */
    classes?: ChannelValueClasses;
    /** The color used for the text elements
     *
     * Default: 'inherit'
     */
    color?: string;
    /** The size to use for the text elements
     *
     *  Default: 'inherit'
     */
    fontSize?: number | string;
    /** A component to render for the icon */
    icon?: React.JSX.Element;
    /** Whether to show the units before the value (e.g., for currency)
     *
     *  Default: false
     */
    prefix?: boolean;
    /** Text to display for the units (light text) */
    units?: string;
    /** Whether to show a space between the value and units
     *
     * Default: auto (shows space except for white list items)
     *
     * prefixUnitAllowSpaceList: ['$'];
     * suffixUnitAllowSpaceList: ['%', '℉','°F','℃','°C','°']
     */
    unitSpace?: 'show' | 'hide' | 'auto';
    /** Text to display for the value (bold text) */
    value: number | string;
};

const Root = styled(Box)<Pick<ChannelValueProps, 'fontSize' | 'color'>>(({ fontSize, color }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: 1.2,
    fontSize: fontSize,
    color: color,
    [`& .${channelValueClasses.text}`]: { fontSize: 'inherit', lineHeight: 'inherit', letterSpacing: 0 },
}));

const IconSpan = styled(
    'span',
    {}
)(() => ({
    marginRight: '0.35em',
    display: 'inline',
    fontSize: 'inherit',
}));

const Unit = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'isSuffix',
})<TypographyProps & { isSuffix: boolean }>(({ isSuffix }) => ({
    fontWeight: 300,
    ...(isSuffix === true && {
        marginLeft: '0.25em',
    }),
}));

const Value = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'isPrefix',
})<TypographyProps & { isPrefix: boolean }>(({ isPrefix }) => ({
    fontWeight: 600,
    ...(isPrefix === true && {
        marginLeft: '0.25em',
    }),
}));

const changeIconDisplay = (newIcon: React.JSX.Element): React.JSX.Element =>
    React.cloneElement(newIcon, {
        style: Object.assign({}, newIcon.props.style, { display: 'block', fontSize: 'inherit' }),
    });

const prefixUnitAllowSpaceList = ['$'];
const suffixUnitAllowSpaceList = ['%', '℉', '°F', '℃', '°C', '°'];

const ChannelValueRender: React.ForwardRefRenderFunction<unknown, ChannelValueProps> = (
    props: ChannelValueProps,
    ref: any
) => {
    const {
        className: userClassName,
        icon,
        prefix = false,
        units,
        unitSpace,
        value,
        color = 'inherit',
        fontSize = 'inherit',
        ...otherProps
    } = props;
    const generatedClasses = useUtilityClasses(props);

    const applyPrefix = useCallback(
        (): boolean =>
            prefix && unitSpace !== 'hide' && (unitSpace === 'show' || !prefixUnitAllowSpaceList.includes(units)),
        [prefix, units, unitSpace]
    );

    const applySuffix = useCallback(
        (): boolean =>
            !prefix && unitSpace !== 'hide' && (unitSpace === 'show' || !suffixUnitAllowSpaceList.includes(units)),
        [prefix, units, unitSpace]
    );

    const getUnitElement = useCallback(
        (): React.JSX.Element => (
            <>
                {units && (
                    <Unit
                        variant={'h6'}
                        color={'inherit'}
                        className={cx(generatedClasses.text, generatedClasses.units)}
                        isSuffix={applySuffix()}
                        data-testid={'blui-channel-value-units'}
                    >
                        {units}
                    </Unit>
                )}
            </>
        ),
        [units, generatedClasses, applySuffix]
    );

    return (
        <ThemeProvider theme={theme}>
            <Root
                as="span"
                ref={ref}
                className={cx(generatedClasses.root, userClassName)}
                data-testid={'blui-channel-value-root-test'}
                fontSize={fontSize}
                color={color}
                {...otherProps}
            >
                {icon && (
                    <IconSpan className={generatedClasses.icon} data-testid={'blui-channel-value-icon'}>
                        {changeIconDisplay(icon)}
                    </IconSpan>
                )}
                {prefix && getUnitElement()}
                <Value
                    variant={'h6'}
                    color={'inherit'}
                    className={cx(generatedClasses.text, generatedClasses.value)}
                    data-testid={'blui-channel-value-value'}
                    isPrefix={applyPrefix()}
                >
                    {value}
                </Value>
                {!prefix && getUnitElement()}
            </Root>
        </ThemeProvider>
    );
};
/**
 * [ChannelValue](https://brightlayer-ui-components.github.io/react/components/channel-value) component
 *
 * Used to show a stylized value and its units.
 * You may also include an icon.
 */
export const ChannelValue = forwardRef(ChannelValueRender);

ChannelValue.displayName = 'ChannelValue';
