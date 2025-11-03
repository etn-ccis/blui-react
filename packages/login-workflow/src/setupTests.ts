/* eslint-disable */
import '@testing-library/jest-dom';

// Suppress ReactDOMTestUtils.act deprecation warnings that come from @testing-library/react v13.3.0
// These warnings are internal to the testing library and will be resolved when the library is updated
// Also suppress "An update to [Component] inside a test was not wrapped in act(...)" warnings
// which are caused by asynchronous state updates in components during testing
// Also suppress React Router Future Flag Warning about v7_startTransition
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]): any => {
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('ReactDOMTestUtils.act') ||
            args[0].includes('`ReactDOMTestUtils.act` is deprecated') ||
            args[0].includes('inside a test was not wrapped in act') ||
            args[0].includes('An empty string ("") was passed to the src attribute') ||
            args[0].includes('React does not recognize the') ||
            args[0].includes('prop on a DOM element') ||
            args[0].includes('Unknown event handler property') ||
            args[0].includes('It will be ignored'))
    ) {
        return;
    }
    originalError.call(console, ...args);
};
console.warn = (...args: any[]): any => {
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('React Router Future Flag Warning') ||
            args[0].includes('v7_startTransition') ||
            args[0].includes('React.startTransition') ||
            args[0].includes('react-i18next:: useTranslation') ||
            args[0].includes('NO_I18NEXT_INSTANCE'))
    ) {
        return;
    }
    originalWarn.call(console, ...args);
};
