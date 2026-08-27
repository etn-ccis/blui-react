import * as Colors from '@brightlayer-ui/colors';

type StatusColorFamily = 'red' | 'green' | 'orange' | 'yellow';

// dark theme uses the 300 shade of each status color; light theme keeps the existing 500 shade
export const getStatusColor = (isDarkMode: boolean, family: StatusColorFamily): string =>
    isDarkMode ? Colors[family][300] : Colors[family][500];

// foreground for text/icons placed on a status-colored background; dark theme uses Black 900, light theme keeps White 50
export const getStatusForeground = (isDarkMode: boolean): string => (isDarkMode ? Colors.black[900] : Colors.white[50]);
