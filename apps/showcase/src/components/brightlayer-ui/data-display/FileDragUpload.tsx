import React, { useState } from 'react';
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

export const FileDragUploadExample: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const handleFiles = (files: FileList): void => {
        setSelectedFiles(Array.from(files).map((f) => f.name));
    };

    return (
        <>
            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Default (No Props Required)
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload onFilesSelected={handleFiles} />
                </Box>
                {selectedFiles.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {selectedFiles.map((name) => (
                            <Chip key={name} label={name} size="small" />
                        ))}
                    </Box>
                )}
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
                        onFilesSelected={handleFiles}
                    />
                </Box>
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
                        onFilesSelected={handleFiles}
                    />
                </Box>
            </Box>

            <Box sx={containerStyles}>
                <Typography sx={sectionTitleStyles} variant={'body1'}>
                    Single File
                </Typography>
                <Box sx={{ maxWidth: 340, mx: 'auto' }}>
                    <FileDragUpload
                        description={'Max file size: 5 MB\nOnly one file allowed'}
                        multiple={false}
                        onFilesSelected={handleFiles}
                    />
                </Box>
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
                        onFilesSelected={handleFiles}
                    />
                </Box>
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
                        onFilesSelected={handleFiles}
                    />
                </Box>
            </Box>
        </>
    );
};
