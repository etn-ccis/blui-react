import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export type FileDragUploadClasses = {
    root?: string;
    dropzone?: string;
    icon?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    actions?: string;
};

export type FileDragUploadClassKey = keyof FileDragUploadClasses;

export function getFileDragUploadUtilityClass(slot: string): string {
    return generateUtilityClass('BluiFileDragUpload', slot);
}

const fileDragUploadClasses: FileDragUploadClasses = generateUtilityClasses('BluiFileDragUpload', [
    'root',
    'dropzone',
    'icon',
    'title',
    'subtitle',
    'description',
    'actions',
]);

export default fileDragUploadClasses;
