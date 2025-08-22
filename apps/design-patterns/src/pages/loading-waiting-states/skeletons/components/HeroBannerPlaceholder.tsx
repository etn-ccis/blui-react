import React from 'react';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { HeroBanner } from '@brightlayer-ui/react-components';
import * as colors from '@brightlayer-ui/colors';

const StyledHeroBanner = styled(HeroBanner)({
    width: '100%',
    height: '100%',
});

const SkeletonRoot = styled(Skeleton)({
    backgroundColor: colors.black[50],
});

const CenteredRow = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '100%',
});

const CenteredColumn = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export const HeroBannerPlaceholder = (props: { animation: 'pulse' | 'wave' }): JSX.Element => {
    const { animation = 'pulse' } = props;

    return (
        <StyledHeroBanner>
            <CenteredRow>
                <CenteredColumn>
                    <SkeletonRoot
                        animation={animation}
                        variant="circular"
                        width={36}
                        height={36}
                        style={{ marginBottom: 16 }}
                    />
                    <SkeletonRoot animation={animation} width={62} height={20} style={{ marginBottom: 8 }} />
                    <SkeletonRoot animation={animation} width={82} height={16} />
                </CenteredColumn>
                <CenteredColumn>
                    <SkeletonRoot
                        animation={animation}
                        variant="circular"
                        width={36}
                        height={36}
                        style={{ marginBottom: 16 }}
                    />
                    <SkeletonRoot animation={animation} width={62} height={20} style={{ marginBottom: 8 }} />
                    <SkeletonRoot animation={animation} width={82} height={16} />
                </CenteredColumn>
                <CenteredColumn>
                    <SkeletonRoot
                        animation={animation}
                        variant="circular"
                        width={36}
                        height={36}
                        style={{ marginBottom: 16 }}
                    />
                    <SkeletonRoot animation={animation} width={62} height={20} style={{ marginBottom: 8 }} />
                    <SkeletonRoot animation={animation} width={82} height={16} />
                </CenteredColumn>
            </CenteredRow>
        </StyledHeroBanner>
    );
};
