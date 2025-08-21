import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import * as colors from '@brightlayer-ui/colors';
import { KeyboardArrowRight } from '@mui/icons-material';
import { Spacer } from '@brightlayer-ui/react-components';
import Color from 'color';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Root = styled(Card)(({ theme }) => ({
    width: 400,
    height: 284,
}));

const Header = styled('div')({
    height: 100,
    backgroundColor: colors.black[100],
    display: 'flex',
    flexDirection: 'column',
});

const HeaderSkeletonContainer = styled('div')(({ theme }) => ({
    margin: theme.spacing(2),
}));

const SkeletonRoot = styled(Skeleton)({
    backgroundColor: colors.black[50],
});

const Row = styled('div')({
    display: 'flex',
    flexDirection: 'row',
});

const CenteredRow = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& :first-child': {
        marginRight: theme.spacing(3),
    },
}));

const CenteredColumn = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const LeftCardContent = styled('div')({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
});

const StyledCardActions = styled(CardActions)(({ theme }) => ({
    height: 52,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `0 ${theme.spacing(2)}`,
    color: Color(colors.black[300]).alpha(0.36).string(),
}));

export const ScorecardPlaceholder = (props: { animation: 'pulse' | 'wave' }): JSX.Element => {
    const { animation = 'pulse' } = props;

    return (
        <Root>
            <Header>
                <HeaderSkeletonContainer data-cy={'skeleton'}>
                    <SkeletonRoot animation={animation} width={180} height={24} style={{ marginBottom: 6 }} />
                    <SkeletonRoot animation={animation} width={112} height={16} style={{ marginBottom: 6 }} />
                    <SkeletonRoot animation={animation} width={62} height={16} />
                </HeaderSkeletonContainer>
            </Header>
            <CardContent style={{ marginTop: 3 }}>
                <Row>
                    <LeftCardContent>
                        <CenteredRow>
                            <SkeletonRoot animation={animation} variant="circular" width={24} height={24} />
                            <SkeletonRoot animation={animation} width={64} height={16} />
                        </CenteredRow>
                        <CenteredRow>
                            <SkeletonRoot animation={animation} variant="circular" width={24} height={24} />
                            <SkeletonRoot animation={animation} width={64} height={16} />
                        </CenteredRow>
                        <CenteredRow>
                            <SkeletonRoot animation={animation} variant="circular" width={24} height={24} />
                            <SkeletonRoot animation={animation} width={64} height={16} />
                        </CenteredRow>
                    </LeftCardContent>
                    <Row>
                        <CenteredColumn style={{ marginRight: 32 }}>
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
                    </Row>
                </Row>
            </CardContent>
            <Divider light />
            <StyledCardActions>
                <Typography variant={'subtitle1'}>View Location</Typography>
                <Spacer />
                <KeyboardArrowRight />
            </StyledCardActions>
        </Root>
    );
};
