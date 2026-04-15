import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScoreCard, Hero, HeroBanner, InfoListItem } from '@brightlayer-ui/react-components';
import { MoreVert, Star, Settings } from '@mui/icons-material';
import { action } from 'storybook/actions';
import { List, ListItem, ListItemText } from '@mui/material';
import * as Colors from '@brightlayer-ui/colors';
import { GradeA, Temp, Moisture } from '@brightlayer-ui/icons-mui';

const meta = {
    component: ScoreCard,
    argTypes: {
        headerTitle: { control: 'text' },
        headerSubtitle: { control: 'text' },
        headerInfo: { control: 'text' },
        headerColor: { control: 'color' },
        headerFontColor: { control: 'color' },
        badgeOffset: { control: 'number' },
        actionLimit: { control: 'number' },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ScoreCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBasicUsage: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo }) => (
        <ScoreCard
            sx={{ width: 350 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'High Humidity Alarm',
        headerInfo: '4 Devices',
    },
} satisfies Story;

export const WithHeroBadge: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo }) => (
        <ScoreCard
            sx={{ width: 350 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            badge={
                <Hero
                    icon={<Temp fontSize="inherit" />}
                    label="Temperature"
                    iconSize={48}
                    ChannelValueProps={{
                        value: 98,
                        units: '°F',
                    }}
                    fontSize="normal"
                />
            }
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'Normal',
        headerInfo: '4 Devices',
    },
} satisfies Story;

export const WithHeroBanner: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo }) => (
        <ScoreCard
            sx={{ width: 400 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            badge={
                <HeroBanner>
                    <Hero
                        icon={<Temp fontSize="inherit" />}
                        label="Temperature"
                        iconSize={48}
                        ChannelValueProps={{ value: 98, units: '°F' }}
                    />
                    <Hero
                        icon={<Moisture fontSize="inherit" />}
                        label="Humidity"
                        iconSize={48}
                        ChannelValueProps={{ value: 54, units: '%' }}
                    />
                </HeroBanner>
            }
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'Normal',
        headerInfo: '4 Devices',
    },
} satisfies Story;

export const WithHeaderActions: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo, actionLimit }) => (
        <ScoreCard
            sx={{ width: 350 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            actionLimit={actionLimit}
            actionItems={[
                <Star key="star" onClick={action('Star Clicked')} />,
                <Settings key="settings" onClick={action('Settings Clicked')} />,
                <MoreVert key="more" onClick={action('More Clicked')} />,
            ]}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'High Humidity Alarm',
        headerInfo: '4 Devices',
        actionLimit: 3,
    },
} satisfies Story;

export const WithActionRow: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo }) => (
        <ScoreCard
            sx={{ width: 350 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            actionRow={
                <List disablePadding>
                    <InfoListItem
                        dense
                        chevron
                        title="View Location"
                        hidePadding
                        onClick={action('View Location Clicked')}
                    />
                </List>
            }
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'Normal',
        headerInfo: '4 Devices',
    },
} satisfies Story;

export const WithScoreBadge: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo, badgeOffset }) => (
        <ScoreCard
            sx={{ width: 350 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            badge={
                <HeroBanner>
                    <Hero
                        icon={<GradeA fontSize="inherit" />}
                        label="Grade"
                        iconSize={72}
                        iconBackgroundColor={Colors.white[50]}
                        ChannelValueProps={{ value: '98', units: '/100', unitSpace: 'hide' }}
                    />
                </HeroBanner>
            }
            badgeOffset={badgeOffset}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'High Humidity Alarm',
        headerInfo: '4 Devices',
        badgeOffset: -54,
    },
} satisfies Story;

export const WithCustomColors: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo, headerFontColor }) => (
        <ScoreCard
            sx={{ width: 350 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            headerColor={Colors.green[500]}
            headerFontColor={headerFontColor}
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'High Humidity Alarm',
        headerInfo: '4 Devices',
        headerFontColor: Colors.white[50],
    },
} satisfies Story;

export const WithFullConfig: Story = {
    render: ({ headerTitle, headerSubtitle, headerInfo, headerColor, headerFontColor, actionLimit, badgeOffset }) => (
        <ScoreCard
            sx={{ width: 400 }}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerInfo={headerInfo}
            headerColor={headerColor}
            headerFontColor={headerFontColor}
            actionLimit={actionLimit}
            actionItems={[
                <Star key="star" onClick={action('Star Clicked')} />,
                <Settings key="settings" onClick={action('Settings Clicked')} />,
                <MoreVert key="more" onClick={action('More Clicked')} />,
            ]}
            badge={
                <HeroBanner>
                    <Hero
                        icon={<GradeA fontSize="inherit" />}
                        label="Grade"
                        iconSize={72}
                        iconBackgroundColor={Colors.white[50]}
                        ChannelValueProps={{ value: '98', units: '/100', unitSpace: 'hide' }}
                    />
                </HeroBanner>
            }
            badgeOffset={badgeOffset}
            actionRow={
                <List disablePadding>
                    <InfoListItem
                        dense
                        chevron
                        title="View Location"
                        hidePadding
                        onClick={action('View Location Clicked')}
                    />
                </List>
            }
        >
            <List>
                <ListItem>
                    <ListItemText primary="Body Content" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="More Content" secondary="With subtitle" />
                </ListItem>
            </List>
        </ScoreCard>
    ),
    args: {
        headerTitle: 'Substation 3',
        headerSubtitle: 'High Humidity Alarm',
        headerInfo: '4 Devices',
        headerColor: Colors.blue[500],
        headerFontColor: Colors.white[50],
        actionLimit: 3,
        badgeOffset: -54,
    },
} satisfies Story;
