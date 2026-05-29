import React, { ReactNode, forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { cx } from '@emotion/css';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box, { BoxProps } from '@mui/material/Box';
import UploadIcon from '@mui/icons-material/Upload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import BlockIcon from '@mui/icons-material/Block';
import { FileDragUploadClasses, FileDragUploadClassKey, getFileDragUploadUtilityClass } from './FileDragUploadClasses';
import { unstable_composeClasses as composeClasses } from '@mui/material';

type DragState = 'idle' | 'drag-across' | 'drag-over' | 'drag-reject';

const useUtilityClasses = (ownerState: FileDragUploadProps): Record<FileDragUploadClassKey, string> => {
    const { classes } = ownerState;
    const slots = {
        root: ['root'],
        dropzone: ['dropzone'],
        icon: ['icon'],
        title: ['title'],
        subtitle: ['subtitle'],
        description: ['description'],
        actions: ['actions'],
    };
    return composeClasses(slots, getFileDragUploadUtilityClass, classes);
};

/**
 * Parse the `accept` prop into a set of MIME types and extensions.
 * Returns null if no accept is specified (accept anything).
 */
function parseAccept(accept?: string): { mimeTypes: string[]; extensions: string[] } | null {
    if (!accept) return null;
    const parts = accept
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (parts.length === 0) return null;
    const mimeTypes: string[] = [];
    const extensions: string[] = [];
    for (const part of parts) {
        if (part.startsWith('.')) {
            extensions.push(part);
        } else {
            mimeTypes.push(part);
        }
    }
    return { mimeTypes, extensions };
}

function isTypeAccepted(itemType: string, accepted: { mimeTypes: string[]; extensions: string[] }): boolean {
    const fileType = itemType.toLowerCase();
    for (const mime of accepted.mimeTypes) {
        if (mime === fileType) return true;
        if (mime.endsWith('/*')) {
            const prefix = mime.slice(0, -1);
            if (fileType.startsWith(prefix)) return true;
        }
    }
    // If only extensions are specified, we can't reliably check during drag
    if (accepted.mimeTypes.length === 0 && accepted.extensions.length > 0) {
        return true;
    }
    return false;
}

function countFileItems(items: DataTransferItemList): number {
    let count = 0;
    for (const item of Array.from(items)) {
        if (item.kind === 'file') count++;
    }
    return count;
}

function checkDragCompatibility(
    dataTransfer: DataTransfer,
    accepted: { mimeTypes: string[]; extensions: string[] } | null
): boolean {
    if (!accepted) return true;
    const items = dataTransfer.items;
    if (!items || items.length === 0) return true;
    for (const item of Array.from(items)) {
        if (item.kind === 'file') {
            // Unknown type — can't reject during drag, allow it through
            if (!item.type) continue;
            if (!isTypeAccepted(item.type, accepted)) return false;
        }
    }
    return true;
}

/**
 * Check if a single File matches the accepted types/extensions.
 * Used at drop time when full file info (name, type) is available.
 */
function isFileAccepted(file: File, accepted: { mimeTypes: string[]; extensions: string[] }): boolean {
    if (file.type && isTypeAccepted(file.type, accepted)) return true;
    if (accepted.extensions.length > 0) {
        const name = file.name.toLowerCase();
        for (const ext of accepted.extensions) {
            if (name.endsWith(ext)) return true;
        }
    }
    return false;
}

/**
 * Filter a FileList to only files matching the accept constraint.
 * Returns a new DataTransfer's FileList so the consumer gets a real FileList.
 */
function filterFiles(files: FileList, accepted: { mimeTypes: string[]; extensions: string[] } | null): FileList {
    if (!accepted) return files;
    const dt = new DataTransfer();
    for (const file of Array.from(files)) {
        if (isFileAccepted(file, accepted)) {
            dt.items.add(file);
        }
    }
    return dt.files;
}

export type FileDragUploadProps = Omit<BoxProps, 'title'> & {
    /** The main title text
     *
     * Default: 'Upload a File'
     */
    title?: ReactNode;
    /** Title shown during drag-over state
     *
     * Default: 'Drop Here'
     */
    dragTitle?: ReactNode;
    /** Title shown when an incompatible file type is dragged over
     *
     * Default: 'Wrong File Type'
     */
    invalidTypeTitle?: ReactNode;
    /** Title shown when too many files are dragged over (multiple={false})
     *
     * Default: 'Too Many Files'
     */
    tooManyFilesTitle?: ReactNode;
    /** Instruction text shown below the title
     *
     * Default: 'Use upload button or drag files here'
     */
    subtitle?: ReactNode;
    /** Additional description (e.g., file size limits, allowed formats)
     *
     * Default: 'Max file size: 5 MB\nAllowed format: Any'
     */
    description?: ReactNode;
    /** Whether to allow multiple file uploads
     *
     * Default: false
     */
    multiple?: boolean;
    /** Accepted file types, comma-separated (e.g., 'application/pdf', 'image/*') */
    accept?: string;
    /** Callback when files are selected or dropped */
    onFilesSelected?: (files: FileList) => void;
    /** Use compact variant for limited space
     *
     * Default: false
     */
    compact?: boolean;
    /** Custom icon for idle state */
    icon?: ReactNode;
    /** Custom icon for drag-over state */
    dragIcon?: ReactNode;
    /** Custom button to replace the default upload button (unmanaged by the component) */
    customButton?: ReactNode;
    /** Custom classes for default style overrides */
    classes?: FileDragUploadClasses;
    /** Additional props for the hidden file input */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const Root = styled(
    Box,
    {}
)({
    position: 'relative',
});

const DropzoneBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'dragState' && prop !== 'isCompact',
})<{
    dragState: DragState;
    isCompact: boolean;
}>(({ theme, dragState, isCompact }) => {
    const isActive = dragState !== 'idle';
    const isReject = dragState === 'drag-reject';
    const isDragOver = dragState === 'drag-over';

    const getBorderColor = (): string => {
        if (isReject) return (theme.vars || theme).palette.error.main;
        if (isActive) return (theme.vars || theme).palette.primary.main;
        return (theme.vars || theme).palette.divider;
    };

    const getDarkBorderColor = (): string => {
        if (isReject) return (theme.vars || theme).palette.error.dark;
        if (isActive) return (theme.vars || theme).palette.primary.dark;
        return (theme.vars || theme).palette.divider;
    };

    return {
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isCompact ? theme.spacing(2) : theme.spacing(1),
        padding: isCompact ? '1rem 1.875rem' : '2.25rem 1.875rem',
        border: `4px ${isDragOver || isReject ? 'solid' : 'dashed'} ${getBorderColor()}`,
        borderRadius: isCompact ? theme.spacing(0.5) : theme.spacing(1),
        backgroundColor: isReject
            ? `color-mix(in srgb, ${(theme.vars || theme).palette.error.main} 5%, transparent)`
            : isActive
              ? (theme.vars || theme).palette.action.hover
              : 'transparent',
        cursor: isReject ? 'no-drop' : isDragOver ? 'copy' : 'pointer',
        transition: 'border-color 0.15s, background-color 0.15s',
        textAlign: isCompact ? 'left' : 'center',
        ...theme.applyStyles('dark', {
            borderColor: getDarkBorderColor(),
            backgroundColor: isReject
                ? `color-mix(in srgb, ${(theme.vars || theme).palette.error.dark} 20%, transparent)`
                : isActive
                  ? (theme.vars || theme).palette.action.hover
                  : 'transparent',
        }),
    };
});

const IconBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'dragState' && prop !== 'isCompact',
})<{ dragState: DragState; isCompact: boolean }>(({ theme, dragState, isCompact }) => ({
    display: 'flex',
    fontSize: isCompact ? 48 : 56,
    color:
        dragState === 'drag-reject'
            ? (theme.vars || theme).palette.error.main
            : dragState !== 'idle'
              ? (theme.vars || theme).palette.primary.main
              : (theme.vars || theme).palette.action.active,
}));

const TextContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isCompact',
})<{ isCompact: boolean }>(({ isCompact }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingBottom: '4px',
    alignItems: 'flex-start',
    alignSelf: isCompact ? undefined : 'stretch',
    flex: isCompact ? 1 : undefined,
    minWidth: isCompact ? 0 : undefined,
}));

const TitleText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'dragState',
})<{ dragState: DragState }>(({ theme, dragState }) => ({
    fontWeight: 600,
    lineHeight: 'normal',
    alignSelf: 'stretch',
    color:
        dragState === 'drag-reject'
            ? (theme.vars || theme).palette.error.main
            : dragState !== 'idle'
              ? (theme.vars || theme).palette.primary.main
              : (theme.vars || theme).palette.text.primary,
}));

const SubtitleText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'dragState',
})<{ dragState: DragState }>(({ theme, dragState }) => ({
    fontWeight: 600,
    lineHeight: 'normal',
    alignSelf: 'stretch',
    color:
        dragState !== 'idle' ? (theme.vars || theme).palette.text.disabled : (theme.vars || theme).palette.text.primary,
}));

const DescriptionText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'dragState',
})<{ dragState: DragState }>(({ theme, dragState }) => ({
    lineHeight: 'normal',
    alignSelf: 'stretch',
    color:
        dragState !== 'idle' ? (theme.vars || theme).palette.text.disabled : (theme.vars || theme).palette.text.primary,
    whiteSpace: 'pre-line',
    ...theme.applyStyles('dark', {
        color:
            dragState !== 'idle'
                ? (theme.vars || theme).palette.text.disabled
                : (theme.vars || theme).palette.text.secondary,
    }),
}));

const UploadButton = styled(Button)({
    '& .MuiButton-startIcon > *:nth-of-type(1)': {
        fontSize: 16,
    },
});

const FileDragUploadRender: React.ForwardRefRenderFunction<unknown, FileDragUploadProps> = (
    props: FileDragUploadProps,
    ref: any
) => {
    const {
        className: userClassName,
        title = 'Upload a File',
        dragTitle = 'Drop Here',
        invalidTypeTitle = 'Wrong File Type',
        tooManyFilesTitle = 'Too Many Files',
        subtitle = 'Use upload button or drag files here',
        description = 'Max file size: 5 MB\nAllowed format: Any',
        multiple = false,
        accept,
        onFilesSelected,
        compact = false,
        icon,
        dragIcon,
        customButton,
        inputProps,
        ...otherProps
    } = props;

    const generatedClasses = useUtilityClasses(props);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState<DragState>('idle');
    const dragCounterRef = useRef(0);
    const zoneCounterRef = useRef(0);
    const acceptedRef = useRef(parseAccept(accept));
    const rejectReasonRef = useRef<'type' | 'count'>('type');

    useEffect(() => {
        acceptedRef.current = parseAccept(accept);
    }, [accept]);

    const isActive = dragState !== 'idle';
    const isReject = dragState === 'drag-reject';

    // Native dragover listener on dropzone — uses stopPropagation to prevent
    // the window handler from overriding dropEffect
    useEffect(() => {
        const el = dropzoneRef.current;
        if (!el) return;
        const handleNativeDragOver = (e: DragEvent): void => {
            e.preventDefault();
            e.stopPropagation();
            if (!e.dataTransfer) return;
            const compatible = checkDragCompatibility(e.dataTransfer, acceptedRef.current);
            const tooMany = !multiple && countFileItems(e.dataTransfer.items) > 1;
            if (compatible && !tooMany) {
                e.dataTransfer.dropEffect = 'copy';
                setDragState((prev) => (prev !== 'drag-over' ? 'drag-over' : prev));
            } else {
                e.dataTransfer.dropEffect = 'none';
                rejectReasonRef.current = !compatible ? 'type' : 'count';
                setDragState((prev) => (prev !== 'drag-reject' ? 'drag-reject' : prev));
            }
        };
        el.addEventListener('dragover', handleNativeDragOver);
        return (): void => {
            el.removeEventListener('dragover', handleNativeDragOver);
        };
    }, [multiple]);

    // Global drag listeners with counter-based tracking
    useEffect(() => {
        const handleDragEnter = (e: DragEvent): void => {
            e.preventDefault();
            dragCounterRef.current++;
            if (dragCounterRef.current === 1) {
                const compatible = e.dataTransfer ? checkDragCompatibility(e.dataTransfer, acceptedRef.current) : true;
                if (!compatible) return; // Incompatible files stay idle
                setDragState((prev) => (prev === 'drag-over' || prev === 'drag-reject' ? prev : 'drag-across'));
            }
        };
        const handleDragLeave = (e: DragEvent): void => {
            e.preventDefault();
            dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
            if (dragCounterRef.current === 0) {
                zoneCounterRef.current = 0;
                setDragState('idle');
            }
        };
        const handleDragOver = (e: DragEvent): void => {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'none';
            }
        };
        const handleDrop = (e: DragEvent): void => {
            e.preventDefault();
            dragCounterRef.current = 0;
            zoneCounterRef.current = 0;
            setDragState('idle');
        };

        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);
        return (): void => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, []);

    const handleZoneDragEnter = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            zoneCounterRef.current++;
            const compatible = checkDragCompatibility(e.dataTransfer, acceptedRef.current);
            const tooMany = !multiple && countFileItems(e.dataTransfer.items) > 1;
            if (compatible && !tooMany) {
                setDragState('drag-over');
            } else {
                rejectReasonRef.current = !compatible ? 'type' : 'count';
                setDragState('drag-reject');
            }
        },
        [multiple]
    );

    const handleZoneDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        zoneCounterRef.current--;
        if (zoneCounterRef.current <= 0) {
            zoneCounterRef.current = 0;
            if (dragCounterRef.current > 0) {
                setDragState((prev) => {
                    if (prev === 'drag-reject') return 'idle';
                    return 'drag-across';
                });
            } else {
                setDragState('idle');
            }
        }
    }, []);

    const handleZoneDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            dragCounterRef.current = 0;
            zoneCounterRef.current = 0;
            setDragState('idle');
            if (isReject) return;
            const compatible = checkDragCompatibility(e.dataTransfer, acceptedRef.current);
            if (!compatible) return;
            const allFiles = e.dataTransfer.files;
            const filtered = filterFiles(allFiles, acceptedRef.current);
            if (!multiple && filtered.length > 1) return;
            if (filtered.length > 0) {
                onFilesSelected?.(filtered);
            }
        },
        [isReject, multiple, onFilesSelected]
    );

    const handleClick = useCallback(() => {
        if (!customButton) {
            inputRef.current?.click();
        }
    }, [customButton]);

    const handleButtonClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        inputRef.current?.click();
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                onFilesSelected?.(files);
            }
            e.target.value = '';
        },
        [onFilesSelected]
    );

    // Icon rendering
    const renderedIcon = isReject ? (
        <BlockIcon fontSize="inherit" />
    ) : isActive ? (
        dragIcon || <FileUploadIcon fontSize="inherit" />
    ) : (
        icon || <UploadIcon fontSize="inherit" />
    );

    // Title rendering
    const displayedTitle = isReject
        ? rejectReasonRef.current === 'count'
            ? tooManyFilesTitle
            : invalidTypeTitle
        : isActive
          ? dragTitle
          : title;

    // Button rendering
    const defaultButton = (
        <UploadButton
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<FileUploadIcon />}
            onClick={handleButtonClick}
            disabled={isActive}
        >
            Upload
        </UploadButton>
    );

    return (
        <Root
            ref={ref}
            className={cx(generatedClasses.root, userClassName)}
            data-testid={'blui-file-drag-upload-root'}
            {...otherProps}
        >
            <DropzoneBox
                ref={dropzoneRef}
                className={generatedClasses.dropzone}
                data-testid={'blui-file-drag-upload-dropzone'}
                dragState={dragState}
                isCompact={compact}
                onDragEnter={handleZoneDragEnter}
                onDragLeave={handleZoneDragLeave}
                onDrop={handleZoneDrop}
                onClick={handleClick}
                onKeyDown={(e): void => {
                    if ((e.key === 'Enter' || e.key === ' ') && !customButton) {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                role="button"
                tabIndex={0}
            >
                <IconBox className={generatedClasses.icon} dragState={dragState} isCompact={compact}>
                    {renderedIcon}
                </IconBox>

                <TextContainer isCompact={compact}>
                    {displayedTitle &&
                        (typeof displayedTitle === 'string' ? (
                            <TitleText
                                variant={compact ? 'body1' : 'h6'}
                                className={generatedClasses.title}
                                dragState={dragState}
                            >
                                {displayedTitle}
                            </TitleText>
                        ) : (
                            displayedTitle
                        ))}
                    {subtitle &&
                        (typeof subtitle === 'string' ? (
                            <SubtitleText
                                variant={compact ? 'body2' : 'subtitle1'}
                                className={generatedClasses.subtitle}
                                dragState={dragState}
                            >
                                {isActive || isReject ? (displayedTitle !== subtitle ? subtitle : null) : subtitle}
                            </SubtitleText>
                        ) : (
                            subtitle
                        ))}
                    {description &&
                        (typeof description === 'string' ? (
                            <DescriptionText
                                variant="body2"
                                className={generatedClasses.description}
                                dragState={dragState}
                            >
                                {description}
                            </DescriptionText>
                        ) : (
                            description
                        ))}
                </TextContainer>

                <Box className={generatedClasses.actions}>{customButton || defaultButton}</Box>
            </DropzoneBox>

            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                data-testid={'blui-file-drag-upload-input'}
                {...inputProps}
            />
        </Root>
    );
};

/**
 * [FileDragUpload](https://brightlayer-ui-components.github.io/react/components/file-drag-upload) component
 *
 * The `<FileDragUpload>` component provides a dropzone for uploading files via click or drag-and-drop.
 * It supports multiple drag states (idle, drag-across, drag-over, drag-reject), file type validation
 * via the `accept` prop, and both default and compact layout variants.
 */
export const FileDragUpload = forwardRef(FileDragUploadRender);

FileDragUpload.displayName = 'FileDragUpload';
