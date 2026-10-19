import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Playground } from '@brightlayer-ui/react-doc-components';
import { createTheme } from '@mui/material/styles';
import * as BLUIColors from '@brightlayer-ui/colors';
import { cardFieldStyles } from '../cardFieldStyles';
import { ImageAnnotatorPlaygroundComponent } from './PlaygroundPage';

vi.mock('@brightlayer-ui/react-doc-components', () => ({
    Playground: vi.fn(() => null),
}));

vi.mock('../../../shared', async () => {
    const { removeEmptyProps } = await import('../../../shared/utilities');
    return { removeEmptyProps };
});

vi.mock('@brightlayer-ui/react-components', () => ({
    ImageAnnotator: ({ children }: { children: React.ReactNode }): React.JSX.Element => <>{children}</>,
    LabelAnchorPoint: ({
        labelBgColor,
        labelColor,
    }: {
        labelBgColor?: string;
        labelColor?: string;
    }): React.JSX.Element => <span data-testid="label" data-background={labelBgColor} data-color={labelColor} />,
    MarkerAnchorPoint: (): null => null,
    CardAnchorPoint: ({ children }: { children: React.ReactNode }): React.JSX.Element => <>{children}</>,
}));

const getPlaygroundProps = (): React.ComponentProps<typeof Playground> => {
    render(<ImageAnnotatorPlaygroundComponent />);
    return vi.mocked(Playground).mock.calls.at(-1)![0];
};

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
