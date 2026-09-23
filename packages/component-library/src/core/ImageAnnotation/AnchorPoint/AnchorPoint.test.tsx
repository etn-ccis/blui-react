import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnchorDot } from './AnchorDot';
import { AnchorPoint } from './AnchorPoint';

afterEach(cleanup);

const setRect = (element: Element, rect: Partial<DOMRect>): void => {
    element.getBoundingClientRect = (): DOMRect =>
        ({
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
            ...rect,
        }) as DOMRect;
};

const renderWithContainer = (props: React.ComponentProps<typeof AnchorPoint>): ReturnType<typeof render> =>
    render(
        <div data-testid="blui-image-annotator-root">
            <AnchorPoint {...props}>
                <span>Details</span>
            </AnchorPoint>
        </div>
    );

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

    it('applies a gradient to the connector when given two line colors', () => {
        render(
            <AnchorPoint x={50} y={50} callout direction="right" lineColor={['#111111', '#eeeeee']}>
                <span>Details</span>
            </AnchorPoint>
        );

        const connector = screen.getByText('Details').parentElement?.firstElementChild;

        expect(connector).toHaveStyle({
            background: 'linear-gradient(to right, #111111, #eeeeee)',
        });
    });

    it('renders the default anchor dot with a custom color', () => {
        const { container } = render(<AnchorDot fillColor="#123456" data-testid="anchor-dot" />);

        expect(screen.getByTestId('anchor-dot')).toBeInTheDocument();
        expect(container.querySelector('circle[r="8"]')).toHaveAttribute('stroke', '#123456');
        expect(container.querySelector('circle[r="4"]')).toHaveAttribute('fill', '#123456');
    });

    it('renders the blue anchor dot variant with a custom color', () => {
        const { container } = render(<AnchorDot variant="blue" fillColor="#123456" data-testid="anchor-dot" />);

        expect(screen.getByTestId('anchor-dot')).toBeInTheDocument();
        expect(container.querySelector('circle[r="8.5"]')).toHaveAttribute('stroke', '#123456');
        expect(container.querySelector('circle[r="5"]')).toHaveAttribute('fill', '#123456');
    });

    it.each([
        ['right', 'row', 'calc(100% + 4px)', undefined, undefined, undefined],
        ['left', 'row-reverse', undefined, 'calc(100% + 4px)', undefined, undefined],
        ['top', 'column-reverse', undefined, undefined, undefined, 'calc(100% + 4px)'],
        ['bottom', 'column', undefined, undefined, 'calc(100% + 4px)', undefined],
    ])('positions callout content to the %s', (direction, flexDirection, left, right, top, bottom) => {
        render(
            <AnchorPoint x={50} y={50} callout direction={direction as 'top' | 'bottom' | 'left' | 'right'}>
                <span>Details</span>
            </AnchorPoint>
        );

        const content = screen.getByText('Details').parentElement;

        expect(content).toHaveStyle({ flexDirection });
        if (left) expect(content).toHaveStyle({ left });
        if (right) expect(content).toHaveStyle({ right });
        if (top) expect(content).toHaveStyle({ top });
        if (bottom) expect(content).toHaveStyle({ bottom });
    });

    it('keeps the preferred direction when the callout fits', () => {
        const resizeObserver = jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
        global.ResizeObserver = resizeObserver as unknown as typeof ResizeObserver;

        renderWithContainer({ x: 50, y: 50, callout: true, direction: 'right' });

        const container = screen.getByTestId('blui-image-annotator-root');
        const root = screen.getByTestId('blui-anchor-point-root');
        const content = screen.getByText('Details').parentElement;
        setRect(container, { left: 0, right: 400, top: 0, bottom: 200 });
        setRect(root, { left: 200, right: 218, top: 100, bottom: 118, width: 18, height: 18 });
        setRect(content!, { width: 100, height: 40 });

        expect(content).toHaveStyle({ flexDirection: 'row' });
    });

    it('flips a horizontal callout when the preferred side overflows', () => {
        const observe = jest.fn();
        const disconnect = jest.fn();
        global.ResizeObserver = jest.fn(() => ({ observe, disconnect })) as unknown as typeof ResizeObserver;

        renderWithContainer({ x: 50, y: 50, callout: true, direction: 'right' });

        const container = screen.getByTestId('blui-image-annotator-root');
        const root = screen.getByTestId('blui-anchor-point-root');
        const content = screen.getByText('Details').parentElement;
        setRect(container, { left: 0, right: 250, top: 0, bottom: 200 });
        setRect(root, { left: 200, right: 218, top: 100, bottom: 118, width: 18, height: 18 });
        setRect(content!, { width: 100, height: 40 });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(content).toHaveStyle({ flexDirection: 'row-reverse', right: 'calc(100% + 4px)' });
        cleanup();
        expect(disconnect).toHaveBeenCalled();
    });

    it('flips a vertical callout when the preferred side overflows', () => {
        global.ResizeObserver = jest.fn(() => ({
            observe: jest.fn(),
            disconnect: jest.fn(),
        })) as unknown as typeof ResizeObserver;

        renderWithContainer({ x: 50, y: 50, callout: true, direction: 'top' });

        const container = screen.getByTestId('blui-image-annotator-root');
        const root = screen.getByTestId('blui-anchor-point-root');
        const content = screen.getByText('Details').parentElement;
        setRect(container, { left: 0, right: 400, top: 0, bottom: 150 });
        setRect(root, { left: 200, right: 218, top: 20, bottom: 38, width: 18, height: 18 });
        setRect(content!, { width: 100, height: 60 });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(content).toHaveStyle({ flexDirection: 'column', top: 'calc(100% + 4px)' });
    });

    it('supports the down direction for gradients and fallback placement', () => {
        global.ResizeObserver = jest.fn(() => ({
            observe: jest.fn(),
            disconnect: jest.fn(),
        })) as unknown as typeof ResizeObserver;

        renderWithContainer({
            x: 50,
            y: 50,
            callout: true,
            direction: 'down',
            lineColor: ['#111111', '#eeeeee'],
        });

        const container = screen.getByTestId('blui-image-annotator-root');
        const root = screen.getByTestId('blui-anchor-point-root');
        const content = screen.getByText('Details').parentElement;
        const connector = content?.firstElementChild;
        setRect(container, { left: 0, right: 400, top: 0, bottom: 400 });
        setRect(root, { left: 200, right: 218, top: 100, bottom: 118, width: 18, height: 18 });
        setRect(content!, { width: 100, height: 400 });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(connector).toHaveStyle({ background: 'linear-gradient(to bottom, #111111, #eeeeee)' });
        expect(content).toHaveStyle({ flexDirection: 'column', top: 'calc(100% + 4px)' });
    });

    it('uses the side with more room when neither side fits', () => {
        global.ResizeObserver = jest.fn(() => ({
            observe: jest.fn(),
            disconnect: jest.fn(),
        })) as unknown as typeof ResizeObserver;

        renderWithContainer({ x: 50, y: 50, callout: true, direction: 'left' });

        const container = screen.getByTestId('blui-image-annotator-root');
        const root = screen.getByTestId('blui-anchor-point-root');
        const content = screen.getByText('Details').parentElement;
        setRect(container, { left: 0, right: 400, top: 0, bottom: 200 });
        setRect(root, { left: 300, right: 318, top: 100, bottom: 118, width: 18, height: 18 });
        setRect(content!, { width: 200, height: 40 });

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        expect(content).toHaveStyle({ flexDirection: 'row-reverse' });
    });

    it('does not attach overflow handling when autoFlip is disabled', () => {
        const addEventListener = jest.spyOn(window, 'addEventListener');
        global.ResizeObserver = jest.fn() as unknown as typeof ResizeObserver;

        renderWithContainer({ x: 50, y: 50, callout: true, direction: 'right', autoFlip: false });

        expect(global.ResizeObserver).not.toHaveBeenCalled();
        expect(addEventListener).not.toHaveBeenCalledWith('resize', expect.any(Function));
        addEventListener.mockRestore();
    });

    it('handles environments without ResizeObserver', () => {
        const originalResizeObserver = global.ResizeObserver;
        global.ResizeObserver = undefined as unknown as typeof ResizeObserver;

        expect(() => renderWithContainer({ x: 50, y: 50, callout: true, direction: 'right' })).not.toThrow();

        cleanup();
        global.ResizeObserver = originalResizeObserver;
    });
});
