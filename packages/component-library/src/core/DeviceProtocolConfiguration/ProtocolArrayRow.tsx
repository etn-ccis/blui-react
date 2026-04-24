import { Box, IconButton, Typography, Collapse, Badge, useTheme, Chip, alpha, Divider, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import z from 'zod';
import { formatTitle, getArrayData, shouldShowField, isArrayLengthFixed } from './ProtocolUtils';
import { Delete, ExpandMore, MoreHoriz } from '@mui/icons-material';
import { memo, useMemo, useState } from 'react';
import { ProtocolArrayRowValue } from './ProtocolArrayRowValue';
import { ProtocolListItem } from './ProtocolListItem';
import { FormFieldWrapper } from './FormComponents/FormFieldWrapper';
import { ProtocolArrayRowTooltip } from './ProtocolArrayRowTooltip';

type ProtocolArrayRowProps = {
    index: number;
    arrayName: string;
    sequenceFields: string[];
    schema: z.ZodObject;
    remove?(index: number): void;
    config?: any;
    initialExpanded?: boolean;
};

export const ProtocolArrayRow = memo(
    ({
        index,
        arrayName,
        sequenceFields,
        schema,
        remove,
        config,
        initialExpanded = false,
    }: ProtocolArrayRowProps): JSX.Element => {
        const {
            watch,
            formState: { errors },
        } = useFormContext();
        const [expanded, setExpanded] = useState(initialExpanded);
        const [isDeleting, setIsDeleting] = useState(false);
        const data = { [arrayName]: watch(arrayName) };

        const visibleFields = useMemo(
            () => sequenceFields.filter((key) => shouldShowField(key, data, arrayName, index, undefined)),
            [sequenceFields, data, arrayName, index]
        );

        const errorFields = visibleFields.filter((key) => (errors[arrayName] as any)?.[index]?.[key]);
        const errorCount = errorFields.length;
        const hasErrors = errorCount > 0;

        const theme = useTheme();

        // Show all if 4 or fewer, otherwise show 3 + "more" indicator
        const displayFieldCount = visibleFields.length <= 4 ? visibleFields.length : 3;
        const displayFields = visibleFields.slice(0, displayFieldCount);
        const remainingFields = visibleFields.slice(displayFieldCount);
        const hasMoreFields = remainingFields.length > 0;

        // Create simplified data object for remaining fields
        const remainingFieldsData = useMemo(
            () =>
                remainingFields.reduce(
                    (acc, key) => {
                        acc[key] = data[arrayName]?.[index]?.[key];
                        return acc;
                    },
                    {} as Record<string, any>
                ),
            [remainingFields, data, arrayName, index]
        );

        const handleDelete = (): void => {
            setIsDeleting(true);
            // Collapse first, then remove
            setExpanded(false);
            setTimeout(() => {
                if (remove) {
                    remove(index);
                }
            }, 300);
        };

        return (
            <Box
                sx={{
                    opacity: isDeleting ? 0 : 1,
                    maxHeight: isDeleting ? 0 : '2000px',
                    overflow: 'hidden',
                    // Can apply a transform here if it feels nice? I think fading out is fine.
                    // transform: isDeleting ? 'translateX(-20px)' : 'translateX(0)',
                    transition: 'all 0.5s ease-out',
                }}
            >
                {/* Collapsed Summary View */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        borderLeft: hasErrors ? `3px solid ${theme.palette.error.dark}` : '3px solid transparent',
                        bgcolor: hasErrors ? `${theme.palette.error.main}08` : 'transparent',
                    }}
                    onClick={() => setExpanded(!expanded)}
                >
                    {/* Index with error badge */}
                    <Badge badgeContent={errorCount} color="error" invisible={!hasErrors}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                minWidth: 32,
                                fontWeight: 600,
                            }}
                        >
                            #{index + 1}
                        </Typography>
                    </Badge>

                    <Box sx={{ position: 'relative', flex: 1, ml: 3, mr: 2, minHeight: 40 }}>
                        {!expanded && (
                            <Box
                                sx={{
                                    position: !expanded ? 'relative' : 'absolute', // Switch positions
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                                    gridAutoFlow: 'dense',
                                    gap: 2,
                                    willChange: expanded ? 'opacity' : 'auto', // Hint to browser
                                    contain: 'layout style paint',
                                }}
                            >
                                {displayFields.map((key) => {
                                    const value = data[arrayName]?.[index]?.[key];
                                    const hasError = errorFields.includes(key);

                                    return (
                                        <Box
                                            key={key}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.25,
                                                minWidth: 0,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: hasError
                                                        ? theme.palette.error.dark
                                                        : theme.palette.text.secondary,
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {formatTitle(key)}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <ProtocolArrayRowValue value={value} hasError={hasError} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                                {hasMoreFields && (
                                    <ProtocolArrayRowTooltip data={remainingFieldsData}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.25,
                                                minWidth: 0,
                                                cursor: 'help',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    textTransform: 'uppercase',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                OTHER FIELDS
                                            </Typography>
                                            <Chip
                                                icon={<MoreHoriz fontSize="small" />}
                                                label={`${remainingFields.length} more`}
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    height: 22,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    width: 'fit-content',
                                                }}
                                            />
                                        </Box>
                                    </ProtocolArrayRowTooltip>
                                )}
                            </Box>
                        )}
                        {expanded && (
                            <Box
                                sx={{
                                    position: expanded ? 'relative' : 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Box
                                    key={`expanded-${arrayName}-${index}`}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.25,
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            textTransform: 'uppercase',
                                            fontSize: '0.65rem',
                                            fontWeight: 600,
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        {formatTitle('editing')}
                                    </Typography>
                                    <Box
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <ProtocolArrayRowValue value={`${formatTitle(arrayName)} #${index + 1}`} />
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                    {/* Action buttons */}
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                        <IconButton
                            size="small"
                            sx={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                            }}
                        >
                            <ExpandMore fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Expanded Edit View */}
                <Collapse in={expanded}>
                    <Box sx={{ borderLeft: `3px solid ${theme.palette.primary.dark}` }}>
                        <Divider />
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.primary.dark, 0.05),
                                px: 2,
                                py: 1.5,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                                {config?.title ?? formatTitle(arrayName)} #{index + 1}
                            </Typography>
                            {!isArrayLengthFixed(schema, config) && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    disabled={!remove || isDeleting}
                                    startIcon={<Delete />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: `${theme.palette.error.light}20`,
                                        },
                                    }}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Item'}
                                </Button>
                            )}
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                bgcolor: alpha(theme.palette.primary.dark, 0.05),
                                px: 0,
                            }}
                        >
                            {visibleFields.map((key, fieldIndex) => {
                                const fieldData = getArrayData(key, arrayName, schema, data, index);
                                const fieldName = `${arrayName}.${index}.${key}`;

                                return (
                                    <ProtocolListItem
                                        key={key}
                                        title={formatTitle(key)}
                                        description={fieldData.description}
                                        valueComponent={
                                            <FormFieldWrapper
                                                name={fieldName}
                                                fieldData={fieldData}
                                                isListItem={true}
                                                autoFocus={initialExpanded && fieldIndex === 0}
                                            />
                                        }
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                </Collapse>
            </Box>
        );
    }
);
