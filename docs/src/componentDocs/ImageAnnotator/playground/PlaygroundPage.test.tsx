import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Playground } from '@brightlayer-ui/react-doc-components';
import { ImageAnnotator, MarkerAnchorPoint } from '@brightlayer-ui/react-components';
import { createTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import { cardFieldStyles } from '../cardFieldStyles';
import { ImageAnnotatorPlaygroundComponent } from './PlaygroundPage';

vi.mock('@brightlayer-ui/react-doc-components', async () => ({
    ...(await vi.importActual<typeof import('@brightlayer-ui/react-doc-components')>(
        '@brightlayer-ui/react-doc-components/dist/esm/index.js'
    )),
    Playground: vi.fn(() => null),
}));

vi.mock('@brightlayer-ui/react-components', () => ({
    ImageAnnotator: vi.fn(({ children }: { children: React.ReactNode }): React.JSX.Element => <>{children}</>),
    LabelAnchorPoint: ({
        labelBgColor,
        labelColor,
    }: {
        labelBgColor?: string;
        labelColor?: string;
    }): React.JSX.Element => <span data-testid="label" data-background={labelBgColor} data-color={labelColor} />,
    MarkerAnchorPoint: vi.fn((): null => null),
    CardAnchorPoint: ({ children }: { children: React.ReactNode }): React.JSX.Element => <>{children}</>,
}));

const getPlaygroundProps = (): React.ComponentProps<typeof Playground> => {
    render(<ImageAnnotatorPlaygroundComponent />);
    return vi.mocked(Playground).mock.calls.at(-1)![0];
};

describe('ImageAnnotator playground defaults', () => {
    it.each(['marker', 'label', 'card'])('uses only required props initially for %s annotations', (annotationType) => {
        const { inputConfig, previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = {
            ...Object.fromEntries(inputConfig.map((input) => [input.id, input.initialValue ?? ''])),
            annotationType,
        };

        render(<Preview data={data} />);

        const imageProps = vi.mocked(ImageAnnotator).mock.calls.at(-1)![0];
        expect(Object.fromEntries(Object.entries(imageProps).filter(([, value]) => value !== undefined))).toEqual({
            src: expect.any(String),
            children: expect.any(Object),
        });
        if (!React.isValidElement<Record<string, unknown>>(imageProps.children)) {
            throw new Error('Expected an annotation element');
        }
        expect(
            Object.fromEntries(Object.entries(imageProps.children.props).filter(([, value]) => value !== undefined))
        ).toEqual(
            annotationType === 'marker'
                ? { x: 33, y: 25, icon: expect.any(Object) }
                : annotationType === 'label'
                  ? { x: 33, y: 25, label: 'Cabinet #2' }
                  : { x: 33, y: 25, children: [undefined, undefined] }
        );
        expect(codeSnippet(data)).toBe(
            `<ImageAnnotator src={isDarkMode ? entranceDark : entranceLight}>\n    ${
                annotationType === 'marker'
                    ? '<MarkerAnchorPoint x={33} y={25} icon={<RoomIcon />} />'
                    : annotationType === 'label'
                      ? '<LabelAnchorPoint x={33} y={25} label={"Cabinet #2"} />'
                      : '<CardAnchorPoint x={33} y={25}>\n    </CardAnchorPoint>'
            }\n</ImageAnnotator>`
        );
    });

    it('keeps connector defaults unset when callouts are enabled', () => {
        const { inputConfig, previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = {
            ...Object.fromEntries(inputConfig.map((input) => [input.id, input.initialValue ?? ''])),
            callout: true,
        };

        render(<Preview data={data} />);

        const props = vi.mocked(MarkerAnchorPoint).mock.calls.at(-1)![0];
        expect(props.callout).toBe(true);
        for (const key of ['direction', 'connectorLength', 'connectorColor', 'connectorThickness', 'autoFlip']) {
            expect(props[key as keyof typeof props]).toBeUndefined();
            expect(codeSnippet(data)).not.toContain(`${key}=`);
        }
        expect(codeSnippet(data)).toContain(' callout');
    });

    it('includes customized props consistently and excludes callout settings when disabled', () => {
        const { previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = {
            src: 'parts',
            x: 0,
            y: 100,
            alt: 'Factory parts',
            width: 500,
            height: 300,
            iconSize: 32,
            markerColor: 'primary',
            callout: true,
            direction: 'left',
            connectorLength: 80,
            connectorColor: '#123456',
            connectorThickness: 2,
            autoFlip: false,
        };

        render(<Preview data={data} />);

        expect(vi.mocked(ImageAnnotator).mock.calls.at(-1)![0]).toMatchObject({
            alt: 'Factory parts',
            width: 500,
            height: 300,
        });
        expect(vi.mocked(MarkerAnchorPoint).mock.calls.at(-1)![0]).toMatchObject({
            x: 0,
            y: 100,
            iconSize: 32,
            markerColor: 'primary',
            callout: true,
            direction: 'left',
            connectorLength: 80,
            connectorColor: '#123456',
            connectorThickness: 2,
            autoFlip: false,
        });
        const snippet = codeSnippet(data);
        expect(snippet).toContain('src={isDarkMode ? partsDark : partsLight}');
        for (const prop of [
            "alt={'Factory parts'}",
            'width={500}',
            'height={300}',
            'iconSize={32}',
            "markerColor={'primary'}",
            "direction={'left'}",
            'connectorLength={80}',
            "connectorColor={'#123456'}",
            'connectorThickness={2}',
            'autoFlip={false}',
        ]) {
            expect(snippet).toContain(prop);
        }
        expect(snippet).not.toContain(' color=');

        const disabledData = { ...data, callout: false };
        render(<Preview data={disabledData} />);
        const disabledProps = vi.mocked(MarkerAnchorPoint).mock.calls.at(-1)![0];
        for (const key of ['direction', 'connectorLength', 'connectorColor', 'connectorThickness', 'autoFlip']) {
            expect(disabledProps[key as keyof typeof disabledProps]).toBeUndefined();
            expect(codeSnippet(disabledData)).not.toContain(`${key}=`);
        }
    });
});

describe('ImageAnnotator playground anchor dot colors', () => {
    it('offers neutral, primary, and custom color options', () => {
        const { inputConfig } = getPlaygroundProps();

        expect(inputConfig.find((input) => input.id === 'anchorDotColor')).toMatchObject({
            type: 'select',
            initialValue: 'neutral',
            options: ['neutral', 'primary', 'custom'],
        });
        expect(inputConfig.find((input) => input.id === 'customAnchorDotColor')).toMatchObject({
            type: 'color',
            required: false,
        });
    });

    it.each([
        ['neutral', '#ff0000', undefined],
        ['primary', '#ff0000', 'primary'],
        ['custom', '#ff0000', '#ff0000'],
        ['custom', '', undefined],
        ['custom', undefined, undefined],
        [undefined, '#ff0000', undefined],
    ])('resolves %s with custom value %s to %s', (anchorDotColor, customAnchorDotColor, expected) => {
        const { previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = { x: 33, y: 25, anchorDotColor, customAnchorDotColor };

        render(<Preview data={data} />);

        expect(vi.mocked(MarkerAnchorPoint).mock.calls.at(-1)![0].anchorDotColor).toBe(expected);
        const snippet = codeSnippet(data);
        if (expected) {
            expect(snippet).toContain(`anchorDotColor={'${expected}'}`);
        } else {
            expect(snippet).not.toContain('anchorDotColor=');
        }
        expect(snippet).not.toContain('customAnchorDotColor');
        expect(snippet).not.toContain('undefined');
    });
});

describe('ImageAnnotator playground label colors', () => {
    it('leaves initial label colors unset so the component can follow the theme', () => {
        const { inputConfig } = getPlaygroundProps();

        expect(inputConfig.find((input) => input.id === 'labelBgColor')?.initialValue).toBeUndefined();
        expect(inputConfig.find((input) => input.id === 'labelColor')?.initialValue).toBeUndefined();
    });

    it.each([undefined, ''])('passes %s colors as undefined and omits them from the snippet', (color) => {
        const { previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = {
            annotationType: 'label',
            label: 'Cabinet #2',
            labelBgColor: color,
            labelColor: color,
        };

        render(<Preview data={data} />);

        expect(screen.getByTestId('label')).not.toHaveAttribute('data-background');
        expect(screen.getByTestId('label')).not.toHaveAttribute('data-color');
        expect(codeSnippet(data)).not.toContain('labelBgColor=');
        expect(codeSnippet(data)).not.toContain('labelColor=');
    });

    it('preserves custom label colors in the preview and snippet', () => {
        const { previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = {
            annotationType: 'label',
            label: 'Cabinet #2',
            labelBgColor: '#ff0000',
            labelColor: '#00ff00',
        };

        render(<Preview data={data} />);

        expect(screen.getByTestId('label')).toHaveAttribute('data-background', '#ff0000');
        expect(screen.getByTestId('label')).toHaveAttribute('data-color', '#00ff00');
        expect(codeSnippet(data)).toContain('labelBgColor="#ff0000"');
        expect(codeSnippet(data)).toContain('labelColor="#00ff00"');
    });
});

describe('ImageAnnotator card fields', () => {
    it('renders editable labels and values and includes their styling in the snippet', () => {
        const { previewComponent: Preview, codeSnippet } = getPlaygroundProps();
        const data = {
            annotationType: 'card',
            cardTitle: 'Cabinet 2',
            cardFieldLabel: 'Load Rate',
            cardBody: '56 %',
        };

        render(<Preview data={data} />);

        expect(screen.getByText('Load Rate')).toHaveClass('card-field-label');
        expect(screen.getByText('56 %')).toHaveClass('card-field-value');
        const snippet = codeSnippet(data);
        expect(snippet).toContain('sx={cardFieldStyles}');
        expect(snippet).toContain('BLUIColors.gray[500]');
        expect(snippet).toContain('BLUIColors.black[200]');
        expect(snippet).toContain('BLUIColors.black[500]');
        expect(snippet).toContain('BLUIColors.black[50]');
        expect(snippet).toContain("textAlign: 'right'");
        expect(snippet).toContain('{"Load Rate"}');
        expect(snippet).toContain('{"56 %"}');
    });

    it.each(['light', 'dark'] as const)('uses the specified typography and %s palette', (mode) => {
        const styles = cardFieldStyles(createTheme({ palette: { mode } }));

        expect(styles['& .card-field-label, & .card-field-value']).toMatchObject({
            fontFamily: '"Open Sans", sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: 1,
            letterSpacing: 0,
        });
        expect(styles['& .card-field-label'].color).toBe(
            mode === 'dark' ? BLUIColors.black[200] : BLUIColors.gray[500]
        );
        expect(styles['& .card-field-value']).toMatchObject({
            color: mode === 'dark' ? BLUIColors.black[50] : BLUIColors.black[500],
            textAlign: 'right',
        });
    });
});
