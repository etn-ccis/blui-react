import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type AnchorPointClasses = {
    /** Styles applied to the root element. */
    root?: string;

    /** Styles applied to the marker (dot) element. */
    marker?: string;

    /** Styles applied to the connector line element (`card`/`callout` variants only). */
    connector?: string;

    /** Styles applied to the content container (`label`/`card`/`callout` variants). */
    content?: string;
};

export type AnchorPointClassKey = keyof AnchorPointClasses;

export function getAnchorPointUtilityClass(slot: string): string {
    return generateUtilityClass('BluiAnchorPoint', slot);
}

const anchorPointClasses: AnchorPointClasses = generateUtilityClasses('BluiAnchorPoint', [
    'root',
    'marker',
    'connector',
    'content',
]);

export default anchorPointClasses;
