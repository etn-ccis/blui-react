import React from 'react';
import { ChannelValue, Hero } from '@brightlayer-ui/react-components';
import Schedule from '@mui/icons-material/Schedule';
import { ExampleShowcase } from '../../../shared';

export const HeroWithChannelValueExample = (): JSX.Element => (
    <ExampleShowcase>
        <Hero label="Duration" icon={<Schedule fontSize="inherit" />}>
            <ChannelValue fontSize={20} value={1} units="h" unitSpace="hide" />
            <ChannelValue fontSize={20} value={27} units="m" unitSpace="hide" />
        </Hero>
    </ExampleShowcase>
);
