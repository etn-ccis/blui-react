import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InfoListItem } from '@brightlayer-ui/react-components';
import { Alarm, Notifications, Info, Warning, Error, ChevronRight, MoreVert } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const meta: Meta<typeof InfoListItem> = {
    title: 'Components/InfoListItem',
    component: InfoListItem,
    argTypes: {
        title: { control: 'text' },
        subtitle: { control: 'text' },
        info: { control: 'text' },
        divider: {
            control: 'select',
            options: ['full', 'partial', undefined],
        },
        dense: { control: 'boolean' },
        chevron: { control: 'boolean' },
        hidePadding: { control: 'boolean' },
        ripple: { control: 'boolean' },
        statusColor: { control: 'color' },
        fontColor: { control: 'color' },
        iconColor: { control: 'color' },
        backgroundColor: { control: 'color' },
        avatar: { control: 'boolean' },
        iconAlign: {
            control: 'select',
            options: ['left', 'center', 'right'],
        },
        wrapTitle: { control: 'boolean' },
        wrapSubtitle: { control: 'boolean' },
        wrapInfo: { control: 'boolean' },
    },
    args: {
        title: 'Info List Item',
        chevron: false,
        dense: false,
        hidePadding: false,
        ripple: false,
        avatar: false,
        wrapTitle: false,
        wrapSubtitle: false,
        wrapInfo: false,
    },
};

export default meta;
type Story = StoryObj<typeof InfoListItem>;

export const Default: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with basic usage',
    },
};

export const WithIcon: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with an icon',
        icon: <Alarm />,
    },
};

export const WithStatusColor: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with status color',
        icon: <Warning />,
        statusColor: '#ffb74d',
    },
};

export const WithAvatar: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with avatar',
        icon: <Notifications />,
        avatar: true,
        statusColor: '#2196f3',
    },
};

export const WithChevron: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with chevron',
        icon: <Info />,
        chevron: true,
    },
};

export const WithRightComponent: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with right component',
        icon: <Alarm />,
        rightComponent: (
            <IconButton edge="end">
                <MoreVert />
            </IconButton>
        ),
    },
};

export const WithLeftComponent: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with left component',
        leftComponent: (
            <IconButton>
                <ChevronRight />
            </IconButton>
        ),
    },
};

export const DenseLayout: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'dense layout',
        icon: <Alarm />,
        dense: true,
    },
};

export const WithDivider: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with full divider',
        icon: <Alarm />,
        divider: 'full',
    },
};

export const WithPartialDivider: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with partial divider',
        icon: <Alarm />,
        divider: 'partial',
    },
};

export const WithInfo: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'Subtitle text',
        info: 'Additional info',
        icon: <Info />,
    },
};

export const WithCustomColors: Story = {
    args: {
        title: 'Info List Item',
        subtitle: 'with custom colors',
        icon: <Error />,
        statusColor: '#f44336',
        iconColor: '#ffffff',
        fontColor: '#333333',
        backgroundColor: '#fafafa',
        avatar: true,
    },
};

export const Clickable: Story = {
    args: {
        title: 'Clickable Item',
        subtitle: 'Click me!',
        icon: <Alarm />,
        chevron: true,
        ripple: true,
        onClick: () => alert('Item clicked!'),
    },
};