export type VersionHistoryItem = {
    label: string;
    version: string;
    date: string;
    url: string;
};

// Ordered newest to oldest. Keep this list in sync with deployed vN snapshot folders.
export const versionHistory: VersionHistoryItem[] = [
    { label: 'React v1', version: 'v1', date: 'Current release', url: '' },
];
