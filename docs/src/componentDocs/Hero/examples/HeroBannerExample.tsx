import React from 'react';
import { Hero, HeroBanner } from '@brightlayer-ui/react-components';
import GradeA from '@brightlayer-ui/icons-mui/GradeA';
import { ExampleShowcase } from '../../../shared';

export const HeroBannerExample = (): JSX.Element => (
    <ExampleShowcase>
        <HeroBanner>
            <Hero
                icon={<GradeA fontSize="inherit" />}
                label="Efficiency"
                ChannelValueProps={{ value: '98', units: '%' }}
            />
        </HeroBanner>
    </ExampleShowcase>
);
