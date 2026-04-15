import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThreeLiner, ToolbarMenu, AppBar } from '@brightlayer-ui/react-components';
import { TrendingUp, Home, Menu } from '@mui/icons-material';
import { Box, Toolbar, IconButton, Typography, Chip } from '@mui/material';
import * as Colors from '@brightlayer-ui/colors';

const meta = {
    component: ThreeLiner,
    argTypes: {
        animationDuration: { control: 'number' },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ThreeLiner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
    render: ({ title, subtitle, info }) => <ThreeLiner title={title} subtitle={subtitle} info={info} />,
    args: {
        title: 'title',
        subtitle: 'subtitle',
        info: 'info',
    },
} satisfies Story;

export const WithTwoLines: Story = {
    render: ({ title, subtitle }) => <ThreeLiner title={title} subtitle={subtitle} />,
    args: {
        title: 'Title',
        subtitle: 'Subtitle',
    },
} satisfies Story;

export const WithOneLine: Story = {
    render: ({ title }) => <ThreeLiner title={title} />,
    args: {
        title: 'Single Line Title',
    },
} satisfies Story;

export const WithCustomContent: Story = {
    render: () => <ThreeLiner title="Three Liner Component" subtitle="with custom content" info={<TrendingUp />} />,
} satisfies Story;

export const WithToolbarMenu: Story = {
    render: () => (
        <ThreeLiner
            title="title"
            subtitle="subtitle"
            info={
                <ToolbarMenu
                    label="info"
                    menuGroups={[
                        {
                            items: [{ title: 'Menu Item 1' }, { title: 'Menu Item 2' }, { title: 'Menu Item 3' }],
                        },
                    ]}
                />
            }
        />
    ),
} satisfies Story;

export const WithMixedContent: Story = {
    render: (): React.JSX.Element => {
        const titleContent = (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Home />
                <span>Dashboard</span>
            </Box>
        );
        const infoContent = <Chip label="Active" color="success" size="small" />;

        return <ThreeLiner title={titleContent as any} subtitle="Current Status Overview" info={infoContent as any} />;
    },
} satisfies Story;

export const WithAnimationDuration: Story = {
    render: ({ title, subtitle, info, animationDuration }) => (
        <ThreeLiner title={title} subtitle={subtitle} info={info} animationDuration={animationDuration} />
    ),
    args: {
        title: 'Animated Title',
        subtitle: 'Animated Subtitle',
        info: 'Animated Info',
        animationDuration: 1000,
    },
} satisfies Story;

export const WithCustomStyles: Story = {
    render: () => (
        <ThreeLiner
            title="Styled Title"
            subtitle="Styled Subtitle"
            info="Styled Info"
            sx={{
                color: Colors.blue[500],
                '& .BluiThreeLiner-title': {
                    fontWeight: 700,
                    fontSize: '2rem',
                },
                '& .BluiThreeLiner-subtitle': {
                    fontStyle: 'italic',
                },
                '& .BluiThreeLiner-info': {
                    color: Colors.gray[500],
                },
            }}
        />
    ),
} satisfies Story;

export const WithinAppBar: Story = {
    render: (): React.JSX.Element => {
        const [collapsed, setCollapsed] = React.useState(false);
        const bodyRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            const handleScroll = (): void => {
                if (bodyRef.current) {
                    setCollapsed(bodyRef.current.scrollTop > 60);
                }
            };

            const body = bodyRef.current;
            if (body) {
                body.addEventListener('scroll', handleScroll);
                return (): void => body.removeEventListener('scroll', handleScroll);
            }
        }, []);

        return (
            <Box sx={{ width: '100%', minWidth: 350, height: 400, overflow: 'hidden' }}>
                <AppBar
                    variant={collapsed ? 'collapsed' : 'expanded'}
                    sx={{
                        position: 'sticky',
                        zIndex: 'auto',
                        [`&.collapsed .BluiThreeLiner-title`]: {
                            fontSize: '1.25rem',
                            fontWeight: 600,
                        },
                        [`&.collapsed .BluiThreeLiner-subtitle`]: {
                            fontSize: 0,
                        },
                        [`&.collapsed .BluiThreeLiner-info`]: {
                            fontSize: 0,
                        },
                    }}
                    classes={{ collapsed: 'collapsed', expanded: 'expanded' }}
                >
                    <Toolbar>
                        <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
                            <Menu />
                        </IconButton>
                        <ThreeLiner
                            title="Dashboard"
                            subtitle="System Overview"
                            info="Last updated: 2 minutes ago"
                            animationDuration={300}
                        />
                    </Toolbar>
                </AppBar>
                <Box
                    ref={bodyRef}
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        p: 2,
                    }}
                >
                    <Typography paragraph>Scroll down to see the Three Liner collapse within the App Bar.</Typography>
                    {Array.from({ length: 20 }, (_, i) => (
                        <Typography key={i} paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    },
} satisfies Story;

export const WithLongText: Story = {
    render: () => (
        <Box sx={{ width: 300 }}>
            <ThreeLiner
                title="This is a very long title that might need to wrap or truncate"
                subtitle="This is also a longer subtitle with additional information"
                info="And the info line can also be quite lengthy with many details"
            />
        </Box>
    ),
} satisfies Story;
