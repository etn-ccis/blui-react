import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type HorizontalStackedBarClasses = {
    root?: string;
    legendContainer?: string;
    barContainer?: string;
};

export type HorizontalStackedBarClassKey = keyof HorizontalStackedBarClasses;

export function getHorizontalStackedBarUtilityClass(slot: string): string {
    return generateUtilityClass('BluiHorizontalStackedBar', slot);
}

const horizontalStackedBarClasses: HorizontalStackedBarClasses = generateUtilityClasses('BluiHorizontalStackedBar', [
    'root',
    'legendContainer',
    'barContainer',
]);

export default horizontalStackedBarClasses;
