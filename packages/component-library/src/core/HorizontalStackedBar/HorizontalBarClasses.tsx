import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type HorizontalBarClasses = {
    root?: string;
};

export type HorizontalBarClassKey = keyof HorizontalBarClasses;

export function getHorizontalBarUtilityClass(slot: string): string {
    return generateUtilityClass('BluiHorizontalBar', slot);
}

const horizontalBarClasses: HorizontalBarClasses = generateUtilityClasses('BluiHorizontalBar', ['root']);

export default horizontalBarClasses;
