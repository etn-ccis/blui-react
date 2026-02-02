import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from '@brightlayer-ui/react-components';
import { GradeA, Temp, Fan } from '@brightlayer-ui/icons-mui';

const meta: Meta<typeof Hero> = {
    title: 'Components/Hero',
    component: Hero,
    tags: ['autodocs'],
    argTypes: {
        icon: {
            control: false,
        },
        label: {
            control: 'text',
        },
        value: {
            control: 'text',
        },
        units: {
            control: 'text',
        },
        iconSize: {
            control: 'number',
        },
        iconBackgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Basic: Story = {
    args: {
        icon: <Temp fontSize="inherit" />,
        label: 'Temperature',
        value: '98',
        units: '°F',
    },
};

export const WithGradeIcon: Story = {
    args: {
        icon: <GradeA fontSize="inherit" />,
        label: 'Grade',
        value: 'A',
    },
};

export const WithCustomIconSize: Story = {
    args: {
        icon: <Fan fontSize="inherit" />,
        label: 'Fan Speed',
        value: '2100',
        units: 'RPM',
        iconSize: 72,
    },
};

export const WithIconBackgroundColor: Story = {
    args: {
        icon: <Temp fontSize="inherit" />,
        label: 'Temperature',
        value: '72',
        units: '°F',
        iconBackgroundColor: '#e0f7fa',
    },
};

export const WithChannelValue: Story = {
    render: () => (
        <Hero
            icon={<Temp fontSize="inherit" />}
            label="Temperature"
            ChannelValueProps={{
                value: '98',
                units: '°F',
            }}
        />
    ),
};

export const WithoutValue: Story = {
    args: {
        icon: <Fan fontSize="inherit" />,
        label: 'Offline',
        value: '--',
    },
};

export const LongLabel: Story = {
    args: {
        icon: <Temp fontSize="inherit" />,
        label: 'Average Daily Temperature',
        value: '72',
        units: '°F',
    },
};

export const MultipleHeroes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px' }}>
            <Hero icon={<Temp fontSize="inherit" />} label="Temperature" value="98" units="°F" />
            <Hero icon={<Fan fontSize="inherit" />} label="Fan Speed" value="2100" units="RPM" />
            <Hero icon={<GradeA fontSize="inherit" />} label="Grade" value="A" />
        </div>
    ),
};
