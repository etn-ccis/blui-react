export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    transformIgnorePatterns: ['/node_modules/(?!@mui|@brightlayer-ui|color|color-string|color-name)'],
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less)$': '<rootDir>/test/__mocks__/fileMock.js',
        '^@brightlayer-ui/react-components$': '<rootDir>/../../packages/component-library/src/index.ts',
        '^@brightlayer-ui/react-themes$': '<rootDir>/../../packages/themes/src/index.ts',
    },
    moduleDirectories: ['node_modules', '<rootDir>/../'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
