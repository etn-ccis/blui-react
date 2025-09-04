import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps, Typography, styled } from '@mui/material';
import * as colors from '@brightlayer-ui/colors';

const UserMenuChip = styled(MuiChip, {
    shouldForwardProp: (prop) => prop !== 'highlight',
})<{ highlight: boolean }>(({ theme, highlight }) => ({
    height: theme.spacing(4),
    cursor: 'pointer',

    '& .MuiChip-icon': {
        height: theme.spacing(3),
        width: theme.spacing(3),
        marginLeft: 0,
        marginRight: 0,
    },

    '& .MuiChip-label': {
        padding: theme.spacing(1),
    },

    '&.MuiChip-outlined': {
        backgroundColor: highlight ? colors.white[500] : colors.white[50],
    },
}));

const ChipLabelContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(-1),
}));

const ChipLabelText = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

type ChipProps = MuiChipProps & {
    label: string;
    rightIcon: React.ReactElement;
    highlight: boolean;
    icon: React.ReactElement;
};

export const Chip = (props: ChipProps): JSX.Element => {
    const { label, rightIcon, highlight, icon, ...chipProps } = props;

    return (
        <UserMenuChip
            {...chipProps}
            highlight={highlight}
            icon={icon}
            clickable={true}
            variant="outlined"
            label={
                <ChipLabelContainer>
                    <ChipLabelText variant={'body2'}>{label}</ChipLabelText>
                    {rightIcon}
                </ChipLabelContainer>
            }
        />
    );
};
