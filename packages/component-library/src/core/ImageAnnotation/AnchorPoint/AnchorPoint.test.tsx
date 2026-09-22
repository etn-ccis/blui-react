import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnchorDot } from './AnchorDot';
import { AnchorPoint } from './AnchorPoint';

afterEach(cleanup);

describe('AnchorPoint', () => {
    it('renders the root element', () => {
        render(<AnchorPoint x={25} y={40} />);

        expect(screen.getByTestId('blui-anchor-point-root')).toBeInTheDocument();
    });

    it('positions the root at the provided coordinates', () => {
        render(<AnchorPoint x={25} y={40} />);

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({ left: '25%', top: '40%' });
    });

    it('supports boundary coordinates', () => {
        render(<AnchorPoint x={0} y={100} />);

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({ left: '0%', top: '100%' });
    });

    it('applies the root layout styles', () => {
        render(<AnchorPoint x={50} y={50} />);

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle({
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            transform: 'translate(-50%, -50%)',
            zIndex: '1',
        });
    });

    it('renders children inside the root container', () => {
        render(
            <AnchorPoint x={50} y={50}>
                <button type="button">Open details</button>
            </AnchorPoint>
        );

        const root = screen.getByTestId('blui-anchor-point-root');
        const child = screen.getByRole('button', { name: 'Open details' });

        expect(child).toBeInTheDocument();
        expect(root).toContainElement(child);
    });

    it('applies sx styles to the root', () => {
        render(<AnchorPoint x={50} y={50} sx={{ backgroundColor: 'rgb(255, 0, 0)' }} />);

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('applies a custom root class', () => {
        render(<AnchorPoint x={50} y={50} classes={{ root: 'custom-root' }} />);

        expect(screen.getByTestId('blui-anchor-point-root')).toHaveClass('custom-root');
    });

    it('forwards a ref to the root element', () => {
        const ref = React.createRef<HTMLDivElement>();

        render(<AnchorPoint ref={ref} x={50} y={50} />);

        expect(ref.current).toBe(screen.getByTestId('blui-anchor-point-root'));
    });

    it('renders the default anchor dot with a custom color', () => {
        const { container } = render(<AnchorDot color="#123456" data-testid="anchor-dot" />);

        expect(screen.getByTestId('anchor-dot')).toBeInTheDocument();
        expect(container.querySelector('circle[r="8"]')).toHaveAttribute('stroke', '#123456');
        expect(container.querySelector('circle[r="4"]')).toHaveAttribute('fill', '#123456');
    });

    it('renders the blue anchor dot variant with a custom color', () => {
        const { container } = render(<AnchorDot variant="blue" color="#123456" data-testid="anchor-dot" />);

        expect(screen.getByTestId('anchor-dot')).toBeInTheDocument();
        expect(container.querySelector('circle[r="8.5"]')).toHaveAttribute('stroke', '#123456');
        expect(container.querySelector('circle[r="5"]')).toHaveAttribute('fill', '#123456');
    });

    it.each([
        ['right', 'row', '100%', undefined],
        ['left', 'row-reverse', undefined, '100%'],
        ['top', 'column-reverse', undefined, undefined],
        ['bottom', 'column', undefined, undefined],
    ])('positions callout content to the %s', (direction, flexDirection, left, right) => {
        render(
            <AnchorPoint x={50} y={50} callout direction={direction as 'top' | 'bottom' | 'left' | 'right'}>
                <span>Details</span>
            </AnchorPoint>
        );

        const content = screen.getByText('Details').parentElement;

        expect(content).toHaveStyle({ flexDirection });
        if (left) expect(content).toHaveStyle({ left });
        if (right) expect(content).toHaveStyle({ right });
    });
});
