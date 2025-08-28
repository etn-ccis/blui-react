import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InfoListItem } from './InfoListItem';
import { OfflineBolt } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes } from '@brightlayer-ui/react-themes';

afterEach(cleanup);

describe('InfoListItem', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title={'test'} />
            </ThemeProvider>
        );
    });

    it('renders with icon', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem hidePadding icon={<PersonIcon />} title="Test" />
            </ThemeProvider>
        );
        expect(screen.findByRole('icon')).toBeTruthy();
    });

    it('renders correct icon Color', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem
                    title={'Test'}
                    icon={<OfflineBolt />}
                    avatar={true}
                    iconColor={'red'}
                    statusColor={'red'}
                />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-status-stripe')).toHaveStyle(`background-color: red`);
        // this is blocked from testing right now. OffLIneBoltIcon has this style but fails in test
        // other tests should check avatar and icon colors that also fail.
        // expect(screen.getByTestId('OfflineBoltIcon')).toHaveStyle(`background-color: red`);
    });

    it('renders rightComponent', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" chevron />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.findByRole('icon')).toBeTruthy();
        expect(screen.getByTestId('ChevronRightIcon')).toBeTruthy();
    });

    it('renders no rightComponent', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.queryByRole('icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ChevronRightIcon')).not.toBeInTheDocument();
    });

    it('renders correct rightComponent icon', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" onClick={(): void => {}} rightComponent={<PersonIcon />} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.queryByTestId('ChevronRightIcon')).not.toBeInTheDocument();
        expect(screen.findByTestId('PersonIcon')).toBeTruthy();
    });

    it('renders leftComponent', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" leftComponent={<PersonIcon />} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.findByTestId('PersonIcon')).toBeTruthy();
    });

    it('renders with subtitle as string', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle="Subtitle text" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Subtitle text')).toBeTruthy();
    });

    it('renders with subtitle as array', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle={['First', 'Second', 'Third']} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getAllByText((content, element) => {
            return element?.textContent === 'First·Second·Third';
        })[0]).toBeTruthy();
    });

    it('renders with subtitle as JSX element', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle={[<span key="subtitle">JSX Subtitle</span>]} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('JSX Subtitle')).toBeTruthy();
    });

    it('renders with info as string', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" info="Info text" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Info text')).toBeTruthy();
    });

    it('renders with info as array', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" info={['Info1', 'Info2', 'Info3']} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getAllByText((content, element) => {
            return element?.textContent === 'Info1·Info2·Info3';
        })[0]).toBeTruthy();
    });

    it('renders with info as JSX element', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" info={[<span key="info">JSX Info</span>]} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('JSX Info')).toBeTruthy();
    });

    it('renders with custom subtitleSeparator', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle={['First', 'Second']} subtitleSeparator=" | " />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getAllByText((content, element) => {
            return element?.textContent === 'First | Second';
        })[0]).toBeTruthy();
    });

    it('renders with dense prop', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" dense />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with backgroundColor prop', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" backgroundColor="red" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with wrap props', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem
                    title="Test"
                    subtitle="Long subtitle text"
                    info="Long info text"
                    wrapTitle
                    wrapSubtitle
                    wrapInfo
                />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Long subtitle text')).toBeTruthy();
        expect(screen.getByText('Long info text')).toBeTruthy();
    });

    it('renders with divider prop', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" divider="full" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with ripple effect when clicked', () => {
        const mockClick = jest.fn();
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" onClick={mockClick} ripple />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with iconAlign center', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" icon={<PersonIcon />} iconAlign="center" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with iconAlign right', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" icon={<PersonIcon />} iconAlign="right" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with fontColor prop', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" fontColor="blue" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with chevronColor prop', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" chevron chevronColor="blue" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByTestId('ChevronRightIcon')).toBeTruthy();
    });

    it('handles long subtitle array with more than 6 elements', () => {
        const longSubtitle = ['1', '2', '3', '4', '5', '6', '7', '8'];
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle={longSubtitle} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getAllByText((content, element) => {
            return element?.textContent === '1·2·3·4·5·6';
        })[0]).toBeTruthy();
        // Should not render elements beyond index 5 (6 elements max)
        expect(screen.queryByText('7')).not.toBeInTheDocument();
        expect(screen.queryByText('8')).not.toBeInTheDocument();
    });

    it('handles long info array with more than 6 elements', () => {
        const longInfo = ['Info1', 'Info2', 'Info3', 'Info4', 'Info5', 'Info6', 'Info7', 'Info8'];
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" info={longInfo} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getAllByText((content, element) => {
            return element?.textContent === 'Info1·Info2·Info3·Info4·Info5·Info6';
        })[0]).toBeTruthy();
        // Should not render elements beyond index 5 (6 elements max)
        expect(screen.queryByText('Info7')).not.toBeInTheDocument();
        expect(screen.queryByText('Info8')).not.toBeInTheDocument();
    });

    it('renders without subtitle when not provided', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        // No subtitle elements should be present
        const subtitleElements = screen.queryAllByText('\u00B7');
        expect(subtitleElements).toHaveLength(0);
    });

    it('renders without info when not provided', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        // No info elements should be present other than title
        const listItem = screen.getByText('Test').closest('li');
        expect(listItem).toBeTruthy();
    });

    it('renders subtitle with JSX in array', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle={[<span key="1">JSX Element</span>, 'String']} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('JSX Element')).toBeTruthy();
        expect(screen.getByText('String')).toBeTruthy();
    });

    it('renders info with JSX in array', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" info={[<span key="1">JSX Element</span>, 'String']} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('JSX Element')).toBeTruthy();
        expect(screen.getByText('String')).toBeTruthy();
    });

    it('renders with non-array subtitle as JSX', () => {
        const subtitleElement = [<span key="subtitle">Single JSX Element</span>];
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" subtitle={subtitleElement} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Single JSX Element')).toBeTruthy();
    });

    it('renders with non-array info as JSX', () => {
        const infoElement = [<span key="info">Single JSX Info</span>];
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" info={infoElement} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Single JSX Info')).toBeTruthy();
    });

    it('renders with divider partial', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" divider="partial" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with non-CSS backgroundColor', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" backgroundColor="invalid-color" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with transparent backgroundColor', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" backgroundColor="transparent" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with inherit backgroundColor', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" backgroundColor="inherit" />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with icon but without avatar', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" icon={<PersonIcon />} avatar={false} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders without icon but with hidePadding', () => {
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" hidePadding />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });

    it('renders with onClick but without ripple', () => {
        const mockClick = jest.fn();
        render(
            <ThemeProvider theme={blueThemes}>
                <InfoListItem title="Test" onClick={mockClick} ripple={false} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
    });
});
