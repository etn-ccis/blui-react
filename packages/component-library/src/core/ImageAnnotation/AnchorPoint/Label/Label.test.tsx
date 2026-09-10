import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { Label } from './Label';

afterEach(cleanup);

const renderLabel = (label: React.ReactElement): ReturnType<typeof render> =>
    render(<ThemeProvider theme={theme}>{label}</ThemeProvider>);

describe('Label', () => {
    it('renders the root label with its text', () => {
        renderLabel(<Label label="Room temperature" />);

        const root = screen.getByTestId('blui-label-root');

        expect(root).toBeInTheDocument();
        expect(root).toHaveTextContent('Room temperature');
        expect(root.tagName).toBe('SPAN');
    });

    it('uses the caption variant by default', () => {
        renderLabel(<Label label="Default label" />);

        expect(screen.getByTestId('blui-label-root')).toHaveClass('MuiTypography-caption');
    });

    it('applies custom background and text colors', () => {
        renderLabel(<Label label="Colored label" labelBgColor="#123456" labelColor="#abcdef" />);

        expect(screen.getByTestId('blui-label-root')).toHaveStyle({
            backgroundColor: '#123456',
            color: '#abcdef',
        });
    });

    it('forwards Typography props to the root label', () => {
        renderLabel(
            <Label label="Forwarded label" variant="h6" className="custom-label" aria-label="annotation label" />
        );

        const root = screen.getByTestId('blui-label-root');

        expect(root).toHaveClass('MuiTypography-h6', 'custom-label');
        expect(root).toHaveAccessibleName('annotation label');
    });

    it('does not forward styling props to the DOM', () => {
        renderLabel(<Label label="Styled label" labelBgColor="#123456" labelColor="#abcdef" />);

        const root = screen.getByTestId('blui-label-root');

        expect(root).not.toHaveAttribute('labelBgColor');
        expect(root).not.toHaveAttribute('labelColor');
    });

    it('forwards a ref to the root label', () => {
        const ref = React.createRef<HTMLSpanElement>();

        renderLabel(<Label ref={ref} label="Ref label" />);

        expect(ref.current).toBe(screen.getByTestId('blui-label-root'));
    });
});
