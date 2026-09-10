import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';
import { Marker } from './Marker';

afterEach(cleanup);

const renderMarker = (marker: React.ReactElement): ReturnType<typeof render> =>
    render(<ThemeProvider theme={theme}>{marker}</ThemeProvider>);

describe('Marker', () => {
    it('renders the root marker', () => {
        renderMarker(<Marker />);

        expect(screen.getByTestId('blui-marker-root')).toBeInTheDocument();
    });

    it('applies the fixed marker layout styles', () => {
        renderMarker(<Marker />);

        expect(screen.getByTestId('blui-marker-root')).toHaveStyle({
            display: 'flex',
            width: '40px',
            height: '40px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '80px',
        });
    });

    it('renders children inside the marker', () => {
        renderMarker(
            <Marker>
                <button type="button">Marker action</button>
            </Marker>
        );

        const root = screen.getByTestId('blui-marker-root');
        const child = screen.getByRole('button', { name: 'Marker action' });

        expect(child).toBeInTheDocument();
        expect(root).toContainElement(child);
    });

    it('does not forward iconSize to the DOM', () => {
        renderMarker(<Marker iconSize={32} />);

        expect(screen.getByTestId('blui-marker-root')).not.toHaveAttribute('iconSize');
    });

    it('forwards a ref to the root marker', () => {
        const ref = React.createRef<HTMLDivElement>();

        renderMarker(<Marker ref={ref} />);

        expect(ref.current).toBe(screen.getByTestId('blui-marker-root'));
    });
});
