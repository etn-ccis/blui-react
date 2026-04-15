import React from 'react';
import * as Colors from '@brightlayer-ui/colors';
import { Hero, HeroBanner, ScoreCard } from '@brightlayer-ui/react-components';
import { GradeA, Temp, Moisture as Humidity } from '@brightlayer-ui/icons-mui';
import Button from '@mui/material/Button';
import { Theme, useTheme, styled } from '@mui/material';

const StyledScoreCard = styled(ScoreCard)(({ theme }: { theme: Theme }) => ({
    width: 350,
    height: 250,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    '& .ScoreCard-header': {
        display: 'flex',
        height: 48,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .ScoreCard-headerTitle': {
        fontSize: '0.875rem',
    },
    '& .ScoreCard-headerContent': {
        padding: '0 16px',
        alignItems: 'center',
    },
    '& .ScoreCard-bodyWrapper': {
        flex: 0,
    },
    '& .ScoreCard-badgeWrapper': {
        flex: 1,
    },
}));

export const LocalActionsScoreCard = (): JSX.Element => {
    const theme = useTheme();

    return (
        <StyledScoreCard
            headerTitle={'Overview'}
            headerColor={Colors.white[50]}
            headerFontColor={Colors.blue[500]}
            badge={
                <HeroBanner style={{ minWidth: 210 }}>
                    <Hero
                        icon={<Humidity fontSize={'inherit'} htmlColor={Colors.blue[200]} />}
                        label={'Humidity'}
                        iconSize={48}
                        ChannelValueProps={{ value: 54, units: '%', fontSize: 'normal' }}
                    />
                    <Hero
                        icon={<Temp fontSize={'inherit'} htmlColor={Colors.red[500]} />}
                        label={'Temperature'}
                        iconSize={48}
                        ChannelValueProps={{ value: 97, units: '°F', fontSize: 'normal' }}
                    />
                    <Hero
                        icon={<GradeA fontSize={'inherit'} htmlColor={Colors.green[500]} />}
                        label={'Overall'}
                        iconSize={48}
                        ChannelValueProps={{ value: 96, units: '/100', fontSize: 'normal' }}
                    />
                </HeroBanner>
            }
            actionRow={
                <Button
                    onClick={(): void => {}}
                    variant={'contained'}
                    color={'primary'}
                    disableElevation={true}
                    style={{ margin: theme.spacing(2), width: 'calc(100% - 32px)' }}
                >
                    Run Diagnostics
                </Button>
            }
        />
    );
};
