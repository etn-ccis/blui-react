import React, { useState } from 'react';
import Check from '@mui/icons-material/Check';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { versionHistory, type VersionHistoryItem } from '../__configuration__/navigationMenu/versionHistory';

const docsBaseUrl = (import.meta.env.VITE_PUBLIC_URL || '').replace(/\/v\d+$/, '').replace(/\/$/, '');

const getVersionUrl = (item: VersionHistoryItem): string => `${docsBaseUrl}${item.url}/`;

export const VersionMenu = (): React.JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const currentVersion = versionHistory[0];

    const handleSelect = (item: VersionHistoryItem): void => {
        setAnchorEl(null);
        if (item.url !== currentVersion.url) {
            window.location.assign(getVersionUrl(item));
        }
    };

    return (
        <>
            <ListItemButton onClick={(event): void => setAnchorEl(event.currentTarget)} sx={{ gap: 1, px: 2, py: 1.5 }}>
                <ListItemText primary={'Version'} secondary={currentVersion.label} />
                <ChevronRight fontSize={'small'} />
            </ListItemButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={(): void => setAnchorEl(null)}>
                {versionHistory.map((item) => (
                    <MenuItem
                        key={item.label}
                        selected={item.label === currentVersion.label}
                        onClick={(): void => handleSelect(item)}
                        sx={{ gap: 3, minWidth: 260 }}
                    >
                        <ListItemText primary={item.label} secondary={`${item.version}, ${item.date}`} />
                        {item.label === currentVersion.label && (
                            <ListItemIcon sx={{ minWidth: 'auto' }}>
                                <Check fontSize={'small'} color={'primary'} />
                            </ListItemIcon>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
