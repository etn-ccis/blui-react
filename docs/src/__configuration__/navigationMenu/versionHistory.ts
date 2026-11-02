export type VersionHistoryItem = {
    date: string;
    url: string;
    packages: Array<{
        name: string;
        version: string;
    }>;
};

// Ordered newest to oldest. Keep this list in sync with deployed vN snapshot folders.
export const versionHistory: VersionHistoryItem[] = [
    {
        date: 'November 2026',
        url: '',
        packages: [
            { name: '@brightlayer-ui/react-components', version: '8.0.6' },
            { name: '@brightlayer-ui/react-themes', version: '9.1.2' },
            { name: '@brightlayer-ui/react-auth-workflow', version: '7.0.3' },
        ],
    },
    {
        date: 'October 2026',
        url: '/v1',
        packages: [
            { name: '@brightlayer-ui/react-components', version: '8.0.5' },
            { name: '@brightlayer-ui/react-themes', version: '9.1.0' },
            { name: '@brightlayer-ui/react-auth-workflow', version: '7.0.3' },
        ],
    },
];
