import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card';

afterEach(cleanup);

describe('Card', () => {
    it('renders the root card', () => {
        render(<Card />);

        expect(screen.getByTestId('blui-card-root')).toBeInTheDocument();
    });

    it('uses the default card width', () => {
        render(<Card />);

        expect(screen.getByTestId('blui-card-root')).toHaveStyle({ width: '160px', height: 'auto' });
    });

    it('applies a custom card width', () => {
        render(<Card cardWidth={240} />);

        expect(screen.getByTestId('blui-card-root')).toHaveStyle('width: 240px');
    });

    it('clamps card width to the minimum of 80 pixels', () => {
        render(<Card cardWidth={40} />);

        expect(screen.getByTestId('blui-card-root')).toHaveStyle('width: 80px');
    });

    it('clamps card width to the maximum of 400 pixels', () => {
        render(<Card cardWidth={480} />);

        expect(screen.getByTestId('blui-card-root')).toHaveStyle('width: 400px');
    });

    it('renders children inside the card', () => {
        render(
            <Card>
                <p>Card content</p>
            </Card>
        );

        const root = screen.getByTestId('blui-card-root');
        const content = screen.getByText('Card content');

        expect(content).toBeInTheDocument();
        expect(root).toContainElement(content);
    });

    it('forwards cardProps to the underlying MUI card', () => {
        render(<Card cardProps={{ 'aria-label': 'annotation card', className: 'custom-card' }} />);

        const root = screen.getByTestId('blui-card-root');
        expect(root).toHaveAccessibleName('annotation card');
        expect(root).toHaveClass('custom-card');
    });

    it('forwards a ref to the root card', () => {
        const ref = React.createRef<HTMLDivElement>();

        render(<Card ref={ref} />);

        expect(ref.current).toBe(screen.getByTestId('blui-card-root'));
    });
});
