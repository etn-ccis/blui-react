import React from 'react';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { InfoListItem } from '@brightlayer-ui/react-components';
import * as colors from '@brightlayer-ui/colors';
import { KeyboardArrowRight } from '@mui/icons-material';
import Color from 'color';

const SkeletonRoot = styled(Skeleton)({
    backgroundColor: colors.black[50],
});

const RightComponent = styled(KeyboardArrowRight)({
    color: Color(colors.black[300]).alpha(0.36).string(),
});

export const ListItemPlaceholder = (props: { animation?: 'pulse' | 'wave'; divider?: boolean }): JSX.Element => {
    const { animation = 'pulse', divider } = props;

    return (
        <InfoListItem
            divider={divider ? 'partial' : undefined}
            icon={<SkeletonRoot animation={animation} variant="circular" width={40} height={40} />}
            title={<SkeletonRoot animation={animation} width={96} height={20} />}
            subtitle={[<SkeletonRoot key="subtitle" animation={animation} width={236} height={14} />]}
            info={[<SkeletonRoot key="info" animation={animation} width={166} height={14} />]}
            rightComponent={<RightComponent />}
        />
    );
};

export const ListItemDensePlaceholder = (props: { animation?: 'pulse' | 'wave'; divider?: boolean }): JSX.Element => {
    const { animation = 'pulse', divider } = props;

    return (
        <InfoListItem
            iconAlign={'center'}
            divider={divider ? 'partial' : undefined}
            dense
            icon={<SkeletonRoot animation={animation} variant="circular" width={24} height={24} />}
            leftComponent={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <SkeletonRoot animation={animation} width={56} height={14} />
                    <SkeletonRoot key="subtitle" animation={animation} width={40} height={14} />
                </div>
            }
            title={<SkeletonRoot animation={animation} width={96} height={20} />}
            subtitle={[<SkeletonRoot key="subtitle" animation={animation} width={166} height={14} />]}
            rightComponent={<RightComponent />}
        />
    );
};
