import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChannelValue } from '@brightlayer-ui/react-components';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import Battery80 from '@mui/icons-material/Battery80';

const meta: Meta<typeof ChannelValue> = {
    title: 'Components/ChannelValue',
    component: ChannelValue,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: 'The value to display',
        },
        units: {
            control: 'text',
            description: 'The units to display after the value',
        },
        prefix: {
            control: 'boolean',
            description: 'Whether to show units before the value',
        },
        fontSize: {
            control: 'number',
            description: 'The font size for the value',
        },
        color: {
            control: 'color',
            description: 'The color of the text',
            table: { defaultValue: { summary: 'black' } },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ChannelValue>;

export const Basic: Story = {
    args: {
        value: '1',
        units: 'Hz',
        color: 'black',
    },
};

export const WithIcon: Story = {
    args: {
        value: '1',
        units: '%',
        color: 'black',
        icon: <TrendingUp />,
    },
};

export const WithPrefix: Story = {
    args: {
        value: '100\n',
        units: '$',
        prefix: true,
        color: 'black',
    },
};

export const WithCustomColor: Story = {
    args: {
        value: 85,
        units: '%',
        color: 'green',
        icon: <Battery80 style={{ color: 'green' }} />,
    },
};

export const WithCustomFontSize: Story = {
    args: {
        value: 456,
        units: 'kWh',
        fontSize: 24,
        color: 'black',
    },
};

export const NegativeValue: Story = {
    args: {
        value: -5.2,
        units: '°C',
        icon: <TrendingDown color="error" />,
        color: 'error',
    },
};

export const LongValue: Story = {
    args: {
        value: 1234567890,
        units: 'bytes',
        color: 'black',
    },
};

export const NoUnits: Story = {
    args: {
        value: 42,
        color: 'black',
    },
};

export const StringValue: Story = {
    args: {
        value: 'Online',
        color: 'black',
    },
};
