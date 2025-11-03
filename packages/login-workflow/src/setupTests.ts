import '@testing-library/jest-dom';

// Suppress ReactDOMTestUtils.act deprecation warnings that come from @testing-library/react v13.3.0
// These warnings are internal to the testing library and will be resolved when the library is updated
const originalError = console.error;
console.error = (...args: any[]): any => {
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('ReactDOMTestUtils.act') || args[0].includes('`ReactDOMTestUtils.act` is deprecated'))
    ) {
        return;
    }
    originalError.call(console, ...args);
};
