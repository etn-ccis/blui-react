import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrawerLite } from './DrawerLite';
import { DrawerLite as DrawerLiteFromIndex } from './index';
import { useDrawerContext } from '../Drawer';

afterEach(cleanup);
// Test component that consumes and displays drawer context values
const ContextConsumer: React.FC = () => {
    const context = useDrawerContext();
    return (
        <div>
            <span data-testid="open-value">{String(context.open)}</span>
            <span data-testid="active-item-value">{context.activeItem}</span>
        </div>
    );
};

describe('DrawerLite', () => {
    it('renders without crashing', () => {
        render(
            <DrawerLite activeItem="test-item">
                <div>Test Content</div>
            </DrawerLite>
        );
    });

    it('renders children correctly', () => {
        render(
            <DrawerLite activeItem="test-item">
                <div data-testid="child-content">Child Content</div>
            </DrawerLite>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('provides drawer context with open=true', () => {
        render(
            <DrawerLite activeItem="test-item">
                <ContextConsumer />
            </DrawerLite>
        );
        expect(screen.getByTestId('open-value')).toHaveTextContent('true');
    });

    it('provides drawer context with the correct activeItem', () => {
        render(
            <DrawerLite activeItem="my-active-item">
                <ContextConsumer />
            </DrawerLite>
        );
        expect(screen.getByTestId('active-item-value')).toHaveTextContent('my-active-item');
    });

    it('updates context when activeItem prop changes', () => {
        const { rerender } = render(
            <DrawerLite activeItem="item-1">
                <ContextConsumer />
            </DrawerLite>
        );
        expect(screen.getByTestId('active-item-value')).toHaveTextContent('item-1');

        rerender(
            <DrawerLite activeItem="item-2">
                <ContextConsumer />
            </DrawerLite>
        );
        expect(screen.getByTestId('active-item-value')).toHaveTextContent('item-2');
    });

    it('renders multiple children correctly', () => {
        render(
            <DrawerLite activeItem="test">
                <div data-testid="child-1">First Child</div>
                <div data-testid="child-2">Second Child</div>
                <div data-testid="child-3">Third Child</div>
            </DrawerLite>
        );
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
        expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('handles empty string as activeItem', () => {
        render(
            <DrawerLite activeItem="">
                <ContextConsumer />
            </DrawerLite>
        );
        expect(screen.getByTestId('active-item-value')).toHaveTextContent('');
    });

    it('handles complex nested children', () => {
        render(
            <DrawerLite activeItem="nested-test">
                <div data-testid="parent">
                    <span data-testid="nested-child">Nested Content</span>
                </div>
            </DrawerLite>
        );
        expect(screen.getByTestId('parent')).toBeInTheDocument();
        expect(screen.getByTestId('nested-child')).toBeInTheDocument();
        expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });

    it('exports DrawerLite from index', () => {
        expect(DrawerLiteFromIndex).toBe(DrawerLite);
    });
});
