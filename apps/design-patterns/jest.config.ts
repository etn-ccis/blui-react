export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        // process `*.tsx` files with `ts-jest`
    },
    transformIgnorePatterns: ['/node_modules/(?!@mui|@brightlayer-ui)'],
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
        "\\.(css|less)$": "<rootDir>/test/__mocks__/fileMock.js",
        "^@brightlayer-ui/react-components$": "<rootDir>/../../packages/component-library/src/index.ts",
        "^@brightlayer-ui/react-themes$": "<rootDir>/../../packages/themes/src/index.ts"
    },
    moduleDirectories: ['node_modules', '<rootDir>/../'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
};
