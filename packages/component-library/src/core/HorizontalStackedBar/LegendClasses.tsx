import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type LegendClasses = {
    root?: string;
    icon?: string;
    label?: string;
    count?: string;
};

export type LegendClassKey = keyof LegendClasses;

export function getLegendUtilityClass(slot: string): string {
    return generateUtilityClass('BluiLegend', slot);
}

const legendClasses: LegendClasses = generateUtilityClasses('BluiLegend', ['root', 'icon', 'label', 'count']);

export default legendClasses;
