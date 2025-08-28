import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { interleave, separate, withKeys } from './utilities';

describe('utilities', () => {
    describe('interleave', () => {
        it('should interleave array elements with separator', () => {
            const array = ['A', 'B', 'C'];
            const separator = () => <span>|</span>;

            const result = interleave(array, separator);

            expect(result).toHaveLength(5); // 3 elements + 2 separators
            expect(result[0]).toBe('A');
            expect(result[2]).toBe('B');
            expect(result[4]).toBe('C');
        });

        it('should handle empty array', () => {
            const array: any[] = [];
            const separator = () => <span>|</span>;

            const result = interleave(array, separator);

            expect(result).toHaveLength(0);
        });

        it('should handle single element array', () => {
            const array = ['A'];
            const separator = () => <span>|</span>;

            const result = interleave(array, separator);

            expect(result).toHaveLength(1);
            expect(result[0]).toBe('A');
        });

        it('should call separator function correct number of times', () => {
            const array = ['A', 'B', 'C', 'D'];
            const separator = jest.fn(() => <span>|</span>);

            interleave(array, separator);

            expect(separator).toHaveBeenCalledTimes(3); // n-1 separators for n elements
        });
    });

    describe('separate', () => {
        it('should separate array elements with interpunct', () => {
            const array = ['A', 'B', 'C'];
            const interpunct = () => <span>•</span>;

            const result = separate(array, interpunct);

            expect(result).toHaveLength(5); // 3 elements + 2 interpuncts
        });

        it('should handle empty array', () => {
            const array: any[] = [];
            const interpunct = () => <span>•</span>;

            const result = separate(array, interpunct);

            expect(result).toHaveLength(0);
        });

        it('should call interpunct function correct number of times', () => {
            const array = ['A', 'B', 'C'];
            const interpunct = jest.fn(() => <span>•</span>);

            separate(array, interpunct);

            expect(interpunct).toHaveBeenCalledTimes(2); // n-1 interpuncts for n elements
        });
    });

    describe('withKeys', () => {
        it('should wrap array elements with React.Fragment and keys', () => {
            const array = [<div>A</div>, <div>B</div>, <div>C</div>];

            const result = withKeys(array);

            expect(result).toHaveLength(3);

            // Render each element to verify they're wrapped correctly
            result.forEach((element: any, index: number) => {
                expect(React.isValidElement(element)).toBe(true);
                expect(element.type).toBe(React.Fragment);
                expect(element.key).toBe(index.toString());
            });
        });

        it('should handle empty array', () => {
            const array: any[] = [];

            const result = withKeys(array);

            expect(result).toHaveLength(0);
        });

        it('should handle array with mixed content types', () => {
            const array = ['text', <div>element</div>, 123, null];

            const result = withKeys(array);

            expect(result).toHaveLength(4);
            result.forEach((element: any, index: number) => {
                expect(React.isValidElement(element)).toBe(true);
                expect(element.type).toBe(React.Fragment);
                expect(element.key).toBe(index.toString());
            });
        });

        it('should render correctly', () => {
            const array = [<div key="1">First</div>, <div key="2">Second</div>];
            const result = withKeys(array);

            const { container } = render(<div>{result}</div>);

            expect(container.textContent).toBe('FirstSecond');
        });
    });
});
