export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // process `*.tsx` files with `ts-jest`
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png|jpe?g)$': '<rootDir>/test/__mocks__/fileMock.js',
        '^@brightlayer-ui/react-components$': '<rootDir>/../../packages/component-library/src/index.ts',
        '^@brightlayer-ui/react-themes$': '<rootDir>/../../packages/themes/src/index.ts',
    },
};
