import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type ImageAnnotationClasses = {
    /** Styles applied to the root element. */
    root?: string;

    /** Styles applied to the image element. */
    image?: string;
};

export type ImageAnnotationClassKey = keyof ImageAnnotationClasses;

export function getImageAnnotationUtilityClass(slot: string): string {
    return generateUtilityClass('BluiImageAnnotator', slot);
}

const imageAnnotationClasses: ImageAnnotationClasses = generateUtilityClasses('BluiImageAnnotator', ['root', 'image']);

export default imageAnnotationClasses;
