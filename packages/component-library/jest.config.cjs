module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // process `*.tsx` files with `ts-jest`
    },
    collectCoverageFrom: ['./src/**/*.tsx'],
    coverageThreshold: {
        global: {
            lines: 86,
        },
    },
    moduleNameMapper: {
            '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
              '^@brightlayer-ui/react-themes$': '<rootDir>/../themes/src',
    },
};
