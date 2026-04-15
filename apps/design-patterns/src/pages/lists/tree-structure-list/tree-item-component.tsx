import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import { Spacer } from '@brightlayer-ui/react-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClosedFolderIcon from '@mui/icons-material/Folder';
import OpenFolderIcon from '@mui/icons-material/FolderOpen';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Radio from '@mui/material/Radio';
import Color from 'color';

// Styled components replacing makeStyles
const AccordionRoot = styled(Accordion, {
    shouldForwardProp: (prop) => prop !== 'first' && prop !== 'nested',
})<{ first?: boolean; nested?: boolean }>(({ theme, first, nested }) => ({
    marginBottom: '0 !important',
    marginTop: '0 !important',
    padding: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    '&::before': {
        display: 'none',
    },
    ...(first && {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        border: 'none',
    }),
    ...(nested && {
        boxShadow: 'none',
    }),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AccordionSummaryRoot = styled(AccordionSummary)(({ theme }) => ({
    height: 56,
    '&.Mui-expanded': {
        minHeight: 56,
    },
    paddingLeft: 8,
}));

const ExpandIconSelected = styled(ExpandMoreIcon)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

const FolderIcon = styled(ClosedFolderIcon)(({ theme }) => ({
    width: 18,
    height: 18,
    marginLeft: 8,
    marginRight: 16,
    color: theme.palette.text.secondary,
}));

const FolderIconSelected = styled(ClosedFolderIcon)(({ theme }) => ({
    width: 18,
    height: 18,
    marginLeft: 8,
    marginRight: 16,
    color: theme.palette.primary.main,
}));

const OpenFolderIconStyled = styled(OpenFolderIcon)(({ theme }) => ({
    width: 18,
    height: 18,
    marginLeft: 8,
    marginRight: 16,
    color: theme.palette.text.secondary,
}));

const OpenFolderIconSelected = styled(OpenFolderIcon)(({ theme }) => ({
    width: 18,
    height: 18,
    marginLeft: 8,
    marginRight: 16,
    color: theme.palette.primary.main,
}));

const AccordionDetailsRoot = styled(AccordionDetails)({
    padding: 0,
});

export type TreeItem = {
    title: string;
    id: number;
    depth?: number;
    selected?: boolean;
    opened?: boolean;
    children?: TreeItem[];
};

export type TreeItemProps = {
    id: number;
    title: string;
    depth?: number;
    selectedItemId?: number | null;
    selected?: boolean;
    childItems?: TreeItem[];
    setSelectedItem?: (id: number) => void;
};

export const TreeItemComponent = (props: TreeItemProps): JSX.Element => {
    const { id, depth = 0, title, selected, selectedItemId, childItems = [], setSelectedItem = (): void => {} } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <AccordionRoot
            elevation={0}
            square={isMobile || depth > 0}
            first={id === 0}
            nested={depth > 0}
            onClick={(event): void => {
                event.stopPropagation();
                if (childItems && childItems.length > 0) {
                    event.preventDefault();
                    setIsExpanded(!isExpanded);
                }
            }}
            expanded={isExpanded}
        >
            <AccordionSummaryRoot
                className={selected ? 'accordion-summary-selected' : ''}
                expandIcon={
                    childItems && childItems.length > 0 ? (
                        selected ? (
                            <ExpandIconSelected />
                        ) : (
                            <ExpandMoreIcon />
                        )
                    ) : undefined
                }
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Radio
                        checked={selected}
                        onClick={(event): void => {
                            event.stopPropagation();
                            setSelectedItem(id);
                        }}
                        color={'primary'}
                    />
                    <Spacer width={depth * 32} />
                    {!isExpanded && (selected ? <FolderIconSelected /> : <FolderIcon />)}
                    {isExpanded && (selected ? <OpenFolderIconSelected /> : <OpenFolderIconStyled />)}
                    <Typography variant={'subtitle1'}>{title}</Typography>
                </div>
            </AccordionSummaryRoot>
            {childItems && childItems.length > 0 && (
                <AccordionDetailsRoot>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {childItems.map((item) => (
                            <TreeItemComponent
                                key={item.id}
                                id={item.id}
                                depth={item.depth}
                                title={item.title}
                                childItems={item.children}
                                selected={selectedItemId === item.id}
                                setSelectedItem={(updatedId: number): void => {
                                    setSelectedItem(updatedId);
                                }}
                                selectedItemId={selectedItemId}
                            />
                        ))}
                    </div>
                </AccordionDetailsRoot>
            )}
            <style>
                {`
                .accordion-summary-selected {
                    background-color: ${Color(theme.palette.primary.main).fade(0.95).string()};
                    color: ${theme.palette.primary.main};
                }
                `}
            </style>
        </AccordionRoot>
    );
};
