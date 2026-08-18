import React from 'react';
import { ExampleShowcase } from '../../../shared';
import { BatteryLarge } from '@brightlayer-ui/react-progress-icons';

export const BatteryLargeProgressIconExample = (): React.JSX.Element => (
    <ExampleShowcase sx={{ display: 'flex', justifyContent: 'center' }}>
        <BatteryLarge percent={56} size={50} color="goldenrod" showPercentLabel={true} labelPosition={'bottom'} />
    </ExampleShowcase>
);
