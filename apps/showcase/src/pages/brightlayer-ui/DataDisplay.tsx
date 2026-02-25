import React from 'react';
import {
    ChannelValueExample,
    ComponentExample,
    EmptyStateExample,
    ExampleCardList,
    HeroExample,
    InfoListItemExample,
    ListItemTagExample,
    TableOfContentsExample,
    ThreeLinerExample,
    UserMenuExample,
} from '../../components';
import { usePageTitle } from '../../hooks/usePageTitle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

export const BLUIDataDisplay: React.FC = () => {
    const examples: ComponentExample[] = [
        { label: 'Channel Value', component: <ChannelValueExample /> },
        { label: 'Empty State', component: <EmptyStateExample /> },
        { label: 'Hero', component: <HeroExample /> },
        { label: 'Info List Item', component: <InfoListItemExample /> },
        { label: 'List Item Tag', component: <ListItemTagExample /> },
        { label: 'Three Liner', component: <ThreeLinerExample /> },
        { label: 'UserMenu', component: <UserMenuExample /> },
    ];
    usePageTitle('Brightlayer UI Data Display');

    return (
        <>
            <ExampleCardList examples={examples} />
            <Box sx={{ m: 2 }}>
                <Card sx={{ width: '100%' }}>
                    <CardHeader title="Table Of Contents" />
                    <CardContent>
                        <TableOfContentsExample />
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};
