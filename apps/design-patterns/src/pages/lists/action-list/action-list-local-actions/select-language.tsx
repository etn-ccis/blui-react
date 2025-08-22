import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import React from 'react';
import { LanguageSelectProps } from './select-language-mobile';

const StyledFormControl = styled(FormControl)({
    width: 200,
});

export const LanguageSelect = (props: LanguageSelectProps): JSX.Element => {
    const { language, updateLanguage } = props;

    const handleChange = (event: SelectChangeEvent): void => {
        updateLanguage(event.target.value);
    };

    return (
        <StyledFormControl variant={'outlined'} size={'small'}>
            <Select value={language} onChange={handleChange} data-testid="LanguageDesktop">
                <MenuItem value="deutsch">Deutsch</MenuItem>
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="espanol">Español</MenuItem>
                <MenuItem value="francais">Français</MenuItem>
            </Select>
        </StyledFormControl>
    );
};
