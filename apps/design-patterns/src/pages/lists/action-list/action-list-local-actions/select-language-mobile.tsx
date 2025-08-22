import React from 'react';
import { InfoListItem } from '@brightlayer-ui/react-components';
import { Done } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

export type LanguageSelectProps = {
    language: string;
    updateLanguage: (tempLanguage: string) => void;
    navigateBack?: () => void;
};

type LanguageData = {
    id: string;
    title: string;
};

const languageData: LanguageData[] = [
    {
        id: 'deutsch',
        title: 'Deutsch',
    },
    {
        id: 'english',
        title: 'English',
    },
    {
        id: 'espanol',
        title: 'Español',
    },
    {
        id: 'francais',
        title: 'Français',
    },
];

const Container = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export const LanguageSelectMobile = (props: LanguageSelectProps): JSX.Element => {
    const { language, updateLanguage, navigateBack = (): void => {} } = props;

    return (
        <Container>
            {languageData.map((data) => (
                <InfoListItem
                    key={data.id}
                    title={data.title}
                    data-testid="LanguageMobile"
                    icon={language === data.id ? <Done /> : undefined}
                    onClick={(): void => {
                        updateLanguage(data.id);
                        navigateBack();
                    }}
                    divider={'full'}
                />
            ))}
        </Container>
    );
};
