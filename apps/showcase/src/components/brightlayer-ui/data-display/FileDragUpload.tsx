import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import PhotoIcon from '@mui/icons-material/Photo';
import { FileDragUpload } from '@brightlayer-ui/react-components';

const containerStyles = {
    mb: 4,
};

const sectionTitleStyles = {
    mb: 2,
};

const SelectedFileChips: React.FC<{ files: string[] }> = ({ files }) =>
    files.length > 0 ? (
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {files.map((name) => (
                <Chip key={name} label={name} size="small" />
            ))}
        </Box>
    ) : null;

const useFileHandler = (): { files: string[]; handleFiles: (fl: FileList) => void } => {
    const [files, setFiles] = useState<string[]>([]);
    const handleFiles = useCallback((fl: FileList): void => {
        setFiles(Array.from(fl).map((f) => f.name));
    }, []);
    return { files, handleFiles };
};

export const FileDragUploadExample: React.FC = () => {
    const defaultEx = useFileHandler();
    const imageEx = useFileHandler();
    const pdfEx = useFileHandler();
    const singleEx = useFileHandler();
    const singlePdfEx = useFileHandler();
    const compactEx = useFileHandler();

    return (
        <>
            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Default (No Props Required)
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload onFilesSelected={defaultEx.handleFiles} />
                </Box>
                <SelectedFileChips files={defaultEx.files} />
            </Box>

            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Custom Title & Image Accept
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload
                        title="Upload a Photo"
                        icon={<PhotoIcon fontSize={'inherit'} />}
                        description={'Max file size: 25 MB\nAllowed format: PNG, JPG, WEBP, TIFF, SVG'}
                        accept="image/png,image/jpeg,image/webp,image/tiff,image/svg+xml"
                        multiple
                        onFilesSelected={imageEx.handleFiles}
                    />
                </Box>
                <SelectedFileChips files={imageEx.files} />
            </Box>

            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    PDF Only
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload
                        subtitle="Upload a document"
                        description={'Max file size: 10 MB\nAllowed format: PDF'}
                        accept="application/pdf"
                        multiple
                        onFilesSelected={pdfEx.handleFiles}
                    />
                </Box>
                <SelectedFileChips files={pdfEx.files} />
            </Box>

            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Single File
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload
                        description={'Max file size: 5 MB\nOnly one file allowed'}
                        multiple={false}
                        onFilesSelected={singleEx.handleFiles}
                    />
                </Box>
                <SelectedFileChips files={singleEx.files} />
            </Box>

            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Single File — PDF Only
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload
                        description={'Max file size: 10 MB\nAllowed format: PDF\nOnly one file allowed'}
                        accept="application/pdf"
                        multiple={false}
                        onFilesSelected={singlePdfEx.handleFiles}
                    />
                </Box>
                <SelectedFileChips files={singlePdfEx.files} />
            </Box>

            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Compact Variant
                </Typography>
                <Box sx={{ maxWidth: 576, mx: 'auto' }}>
                    <FileDragUpload
                        compact
                        description={'Max file size: 25 MB\nAllowed format: PNG, JPG, WEBP, TIFF, SVG'}
                        accept="image/png,image/jpeg,image/webp,image/tiff,image/svg+xml"
                        onFilesSelected={compactEx.handleFiles}
                    />
                </Box>
                <SelectedFileChips files={compactEx.files} />
            </Box>
        </>
    );
};
