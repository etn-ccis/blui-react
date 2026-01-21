import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserMenu } from '@brightlayer-ui/react-components';
import { action } from 'storybook/actions';
import Avatar from '@mui/material/Avatar';
import Email from '@mui/icons-material/Email';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Settings from '@mui/icons-material/Settings';
import Pets from '@mui/icons-material/Pets';
import * as Colors from '@brightlayer-ui/colors';

const meta = {
    component: UserMenu,
    argTypes: {
        menuTitle: { control: 'text' },
        menuSubtitle: { control: 'text' },
        useBottomSheetAt: { control: 'number' },
        avatarBackgroundColor: { control: 'color' },
        avatarColor: { control: 'color' },
        menuFontColor: { control: 'color' },
        menuIconColor: { control: 'color' },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultMenuGroup = [
    {
        title: 'Settings',
        icon: <Settings />,
        onClick: action('Settings Clicked'),
    },
    {
        title: 'Contact Us',
        icon: <Email />,
        onClick: action('Contact Clicked'),
    },
    {
        title: 'Log Out',
        icon: <ExitToApp />,
        onClick: action('Log Out Clicked'),
    },
];

export const WithBasicUsage: Story = {
    render: ({
        menuTitle,
        menuSubtitle,
        useBottomSheetAt,
        avatarBackgroundColor,
        avatarColor,
        menuFontColor,
        menuIconColor,
    }: {
        menuTitle?: string;
        menuSubtitle?: string;
        useBottomSheetAt?: number;
        avatarBackgroundColor?: string;
        avatarColor?: string;
        menuFontColor?: string;
        menuIconColor?: string;
    }) => (
        <UserMenu
            avatar={
                <Avatar
                    sx={{
                        backgroundColor: avatarBackgroundColor,
                        color: avatarColor,
                    }}
                >
                    UI
                </Avatar>
            }
            menuGroups={[
                {
                    items: defaultMenuGroup,
                    fontColor: menuFontColor,
                    iconColor: menuIconColor,
                },
            ]}
            menuTitle={menuTitle}
            menuSubtitle={menuSubtitle}
            useBottomSheetAt={useBottomSheetAt}
            onOpen={action('Menu Opened')}
            onClose={action('Menu Closed')}
        />
    ),
    args: {
        menuTitle: undefined,
        menuSubtitle: undefined,
        useBottomSheetAt: 600,
        avatarBackgroundColor: Colors.blue[500],
        avatarColor: Colors.white[50],
        menuFontColor: undefined,
        menuIconColor: undefined,
    },
} satisfies Story;

export const WithCustomColors: Story = {
    render: ({
        menuTitle,
        menuSubtitle,
        useBottomSheetAt,
        avatarBackgroundColor,
        avatarColor,
        menuFontColor,
        menuIconColor,
    }: {
        menuTitle?: string;
        menuSubtitle?: string;
        useBottomSheetAt?: number;
        avatarBackgroundColor?: string;
        avatarColor?: string;
        menuFontColor?: string;
        menuIconColor?: string;
    }) => (
        <UserMenu
            avatar={
                <Avatar
                    sx={{
                        backgroundColor: avatarBackgroundColor,
                        color: avatarColor,
                    }}
                >
                    UI
                </Avatar>
            }
            menuGroups={[
                {
                    items: defaultMenuGroup,
                    fontColor: menuFontColor,
                    iconColor: menuIconColor,
                },
            ]}
            menuTitle={menuTitle}
            menuSubtitle={menuSubtitle}
            useBottomSheetAt={useBottomSheetAt}
            onOpen={action('Menu Opened')}
            onClose={action('Menu Closed')}
        />
    ),
    args: {
        menuTitle: undefined,
        menuSubtitle: undefined,
        useBottomSheetAt: 600,
        avatarBackgroundColor: Colors.blue[800],
        avatarColor: Colors.white[50],
        menuFontColor: Colors.blue[800],
        menuIconColor: Colors.blue[800],
    },
} satisfies Story;

export const WithNonTextAvatar: Story = {
    render: ({
        menuTitle,
        menuSubtitle,
        useBottomSheetAt,
        avatarBackgroundColor,
        avatarColor,
        menuFontColor,
        menuIconColor,
    }: {
        menuTitle?: string;
        menuSubtitle?: string;
        useBottomSheetAt?: number;
        avatarBackgroundColor?: string;
        avatarColor?: string;
        menuFontColor?: string;
        menuIconColor?: string;
    }) => (
        <UserMenu
            avatar={
                <Avatar
                    sx={{
                        backgroundColor: avatarBackgroundColor,
                        color: avatarColor,
                    }}
                >
                    <Pets />
                </Avatar>
            }
            menuGroups={[
                {
                    items: defaultMenuGroup,
                    fontColor: menuFontColor,
                    iconColor: menuIconColor,
                },
            ]}
            menuTitle={menuTitle}
            menuSubtitle={menuSubtitle}
            useBottomSheetAt={useBottomSheetAt}
            onOpen={action('Menu Opened')}
            onClose={action('Menu Closed')}
        />
    ),
    args: {
        menuTitle: undefined,
        menuSubtitle: undefined,
        useBottomSheetAt: 600,
        avatarBackgroundColor: Colors.blue[500],
        avatarColor: Colors.white[50],
        menuFontColor: undefined,
        menuIconColor: undefined,
    },
} satisfies Story;

export const WithMenuHeader: Story = {
    render: ({
        menuTitle,
        menuSubtitle,
        useBottomSheetAt,
        avatarBackgroundColor,
        avatarColor,
        menuFontColor,
        menuIconColor,
    }: {
        menuTitle?: string;
        menuSubtitle?: string;
        useBottomSheetAt?: number;
        avatarBackgroundColor?: string;
        avatarColor?: string;
        menuFontColor?: string;
        menuIconColor?: string;
    }) => (
        <UserMenu
            avatar={
                <Avatar
                    sx={{
                        backgroundColor: avatarBackgroundColor,
                        color: avatarColor,
                    }}
                >
                    UI
                </Avatar>
            }
            menuGroups={[
                {
                    items: defaultMenuGroup,
                    fontColor: menuFontColor,
                    iconColor: menuIconColor,
                },
            ]}
            menuTitle={menuTitle}
            menuSubtitle={menuSubtitle}
            useBottomSheetAt={useBottomSheetAt}
            onOpen={action('Menu Opened')}
            onClose={action('Menu Closed')}
        />
    ),
    args: {
        menuTitle: 'Menu Title',
        menuSubtitle: 'Menu Subtitle',
        useBottomSheetAt: 600,
        avatarBackgroundColor: Colors.blue[500],
        avatarColor: Colors.white[50],
        menuFontColor: undefined,
        menuIconColor: undefined,
    },
} satisfies Story;
