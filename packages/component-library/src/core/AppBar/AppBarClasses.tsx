import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type AppBarClasses = {
    root?: string;
    background?: string;
    expanded?: string;
    collapsed?: string;
    expandedBackground?: string;
};

export type AppBarClassKey = keyof AppBarClasses;

export function getAppBarUtilityClass(slot: string): string {
    return generateUtilityClass('BluiAppBar', slot);
}

const appBarClasses: AppBarClasses = generateUtilityClasses('BluiAppBar', [
    'root',
    'background',
    'expanded',
    'collapsed',
    'expandedBackground',
]);

// Add this named export
export { appBarClasses as AppBarClasses };

export default appBarClasses;
