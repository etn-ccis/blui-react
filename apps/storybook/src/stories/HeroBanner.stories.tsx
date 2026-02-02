import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroBanner, Hero } from '@brightlayer-ui/react-components';
import { GradeA, Temp, Moisture } from '@brightlayer-ui/icons-mui';

const meta: Meta<typeof HeroBanner> = {
    title: 'Components/HeroBanner',
    component: HeroBanner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroBanner>;

export const Default: Story = {
    render: () => (
        <HeroBanner>
            <Hero icon={<Temp fontSize="inherit" />} label="Temperature" value={98} units="°F" />
        </HeroBanner>
    ),
};

export const MultipleHeroes: Story = {
    render: () => (
        <HeroBanner>
            <Hero icon={<Temp fontSize="inherit" />} label="Temperature" value={98} units="°F" />
            <Hero icon={<Moisture fontSize="inherit" />} label="Humidity" value={54} units="%" />
            <Hero icon={<GradeA fontSize="inherit" />} label="Grade" value="A" />
        </HeroBanner>
    ),
};

export const WithDivider: Story = {
    render: () => (
        <HeroBanner divider>
            <Hero icon={<Temp fontSize="inherit" />} label="Temperature" value={98} units="°F" />
            <Hero icon={<Moisture fontSize="inherit" />} label="Humidity" value={54} units="%" />
        </HeroBanner>
    ),
};

export const LimitedHeroes: Story = {
    render: () => (
        <HeroBanner limit={2}>
            <Hero icon={<Temp fontSize="inherit" />} label="Temperature" value={98} units="°F" />
            <Hero icon={<Moisture fontSize="inherit" />} label="Humidity" value={54} units="%" />
            <Hero icon={<GradeA fontSize="inherit" />} label="Grade" value="A" />
        </HeroBanner>
    ),
};

export const FourHeroes: Story = {
    render: () => (
        <HeroBanner>
            <Hero icon={<Temp fontSize="inherit" />} label="Temperature" value={98} units="°F" />
            <Hero icon={<Moisture fontSize="inherit" />} label="Humidity" value={54} units="%" />
            <Hero icon={<GradeA fontSize="inherit" />} label="Grade" value="A" />
            <Hero icon={<Temp fontSize="inherit" />} label="Output" value={82} units="kW" />
        </HeroBanner>
    ),
};
