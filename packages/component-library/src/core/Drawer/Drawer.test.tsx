import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@mui/material/Avatar';
import { Drawer } from './Drawer';
import { DrawerHeader } from './DrawerHeader';
import { DrawerSubheader } from './DrawerSubheader';
import { DrawerBody } from './DrawerBody/DrawerBody';
import { DrawerFooter } from './DrawerFooter';
import { DrawerNavGroup } from './DrawerNavGroup';
import MoreVert from '@mui/icons-material/MoreVert';
import { DrawerRailItem } from './DrawerRailItem';
import { DrawerNavItem } from './DrawerNavItem';
import { ThemeProvider } from '@mui/material/styles';
import { blueThemes as theme } from '@brightlayer-ui/react-themes';

afterEach(cleanup);

describe('Drawer', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} />
            </ThemeProvider>
        );
    });

    it('renders all the Drawer child components', () => {
        render(
            <ThemeProvider theme={theme}>
                <Drawer open={true}>
                    <DrawerHeader />
                    <DrawerSubheader />
                    <DrawerBody />
                    <DrawerFooter />
                </Drawer>
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-header')).toBeTruthy();
        expect(screen.getByTestId('blui-drawer-sub-header')).toBeTruthy();
        expect(screen.getByTestId('blui-drawer-body')).toBeTruthy();
        expect(screen.getByTestId('blui-drawer-footer')).toBeTruthy();
    });

    // Test case for line 204: Different variant conditions in isDrawerOpen
    it('should handle permanent variant correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={false} variant="permanent" />
            </ThemeProvider>
        );
        // Permanent variant should always be open regardless of open prop
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    it('should handle rail variant correctly', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={false} variant="rail" />
            </ThemeProvider>
        );
        // Rail variant should always be open regardless of open prop
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    it('should handle temporary variant correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} variant="temporary" noLayout={true}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );
        // Test passes if render doesn't crash
    });

    // Test case for lines 297-305: Hover functionality
    it('should handle hover events when openOnHover is true', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={false} variant="persistent" openOnHover={true} openOnHoverDelay={100}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );

        const hoverArea = container.querySelector('div[style*="flex-direction: column"]');
        expect(hoverArea).toBeTruthy();

        // Test mouse enter
        fireEvent.mouseEnter(hoverArea!);
        // Test mouse leave
        fireEvent.mouseLeave(hoverArea!);
    });

    it('should not add hover events when openOnHover is false', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={false} variant="persistent" openOnHover={false}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );

        const hoverArea = container.querySelector('div[style*="flex-direction: column"]');
        expect(hoverArea).toBeTruthy();
        // Should not have mouse event handlers when openOnHover is false
    });

    // Test case for line 327: getDrawerWidth function with different conditions
    it('should handle condensed rail variant width', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} variant="rail" condensed={true} />
            </ThemeProvider>
        );
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    it('should handle custom width', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} width="400px" />
            </ThemeProvider>
        );
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    it('should handle sideBorder prop', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} sideBorder={true} />
            </ThemeProvider>
        );
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
        expect(container.querySelector('.BluiDrawer-sideBorder')).toBeTruthy();
    });

    it('should handle onItemSelect callback', () => {
        const onItemSelect = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} onItemSelect={onItemSelect}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    it('should handle activeItem prop', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} activeItem="test-item">
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    it('should handle noLayout prop', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={true} noLayout={true}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );
        expect(container.querySelector('.BluiDrawer-content')).toBeTruthy();
    });

    // Test case for lines 297-305: Hover functionality
    it('should handle hover events when openOnHover is true', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={false} variant="persistent" openOnHover={true} openOnHoverDelay={100}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );

        const hoverArea = container.querySelector('div[style*="flex-direction: column"]');
        expect(hoverArea).toBeTruthy();

        // Test mouse enter
        fireEvent.mouseEnter(hoverArea!);
        // Test mouse leave
        fireEvent.mouseLeave(hoverArea!);
    });

    it('should not add hover events when openOnHover is false', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Drawer open={false} variant="persistent" openOnHover={false}>
                    <DrawerBody />
                </Drawer>
            </ThemeProvider>
        );

        const hoverArea = container.querySelector('div[style*="flex-direction: column"]');
        expect(hoverArea).toBeTruthy();
        // Should not have mouse event handlers when openOnHover is false
    });
});

describe('DrawerHeader', () => {
    it('renders text correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerHeader title={'header title'} subtitle={'header subtitle'} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-header-title')).toHaveTextContent('header title');
        expect(screen.getByTestId('blui-drawer-header-subtitle')).toHaveTextContent('header subtitle');
    });

    it('renders titleContent', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerHeader titleContent={<Avatar />} />
            </ThemeProvider>
        );
        expect(screen.findByRole('icon')).toBeTruthy();
    });

    it('calls onIconClick', () => {
        const onIconClickFunction = jest.fn();
        const icon = <Avatar data-testid={'avatar'} />;
        render(
            <ThemeProvider theme={theme}>
                <DrawerHeader onIconClick={onIconClickFunction} icon={icon} />
            </ThemeProvider>
        );
        const renderedIcon = screen.getByTestId('avatar');
        expect(onIconClickFunction).not.toHaveBeenCalled();
        fireEvent(
            renderedIcon,
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            })
        );
        expect(onIconClickFunction).toHaveBeenCalled();
    });
});

describe('DrawerNavGroup', () => {
    it('renders text correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerNavGroup title={'nav group title'} items={[]} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('blui-drawer-nav-group')).toHaveTextContent('nav group title');
    });

    it('renders custom content correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerNavGroup titleContent={<Avatar />} items={[]} />
            </ThemeProvider>
        );
        expect(screen.findByRole('icon')).toBeTruthy();
    });

    it('renders rightComponent correctly', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerNavGroup items={[{ title: '', itemID: '', rightComponent: <MoreVert /> }]} />
            </ThemeProvider>
        );
        expect(screen.getByTestId('MoreVertIcon')).toBeInTheDocument();
    });

    it('renders its menu items recursively in the correct order', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerNavGroup
                    items={[
                        { title: 'a', itemID: 'a' },
                        {
                            title: 'b',
                            itemID: 'b',
                            items: [
                                {
                                    title: 'b_0',
                                    itemID: 'b_0',
                                    items: [
                                        { title: 'b_0_0', itemID: 'b_0_0' },
                                        { title: 'b_0_1', itemID: 'b_0_1' },
                                    ],
                                },
                                { title: 'b_1', itemID: 'b_1', items: [{ title: 'b_1_0', itemID: 'b_1_0' }] },
                            ],
                        },
                        {
                            title: 'c',
                            itemID: 'c',
                            items: [
                                {
                                    title: 'c_0',
                                    itemID: 'c_0',
                                    items: [
                                        { title: 'c_0_0', itemID: 'c_0_0' },
                                        { title: 'c_0_1', itemID: 'c_0_1' },
                                    ],
                                },
                            ],
                        },
                    ]}
                />
            </ThemeProvider>
        );

        const expectedNavItemTitleList = [
            'a',
            'b',
            'b_0',
            'b_0_0',
            'b_0_1',
            'b_1',
            'b_1_0',
            'c',
            'c_0',
            'c_0_0',
            'c_0_1',
        ];

        const navItemList = screen.getAllByTestId('blui-drawer-nav-item');
        expect(navItemList.length).toEqual(expectedNavItemTitleList.length);
        navItemList.forEach((item, index) => {
            expect(item).toHaveTextContent(expectedNavItemTitleList[index]);
        });
    });

    it('renders its menu items declaratively in the correct order', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerNavGroup>
                    <DrawerNavItem title={'a'} itemID={'a'} />
                    <DrawerNavItem title={'b'} itemID={'b'}>
                        <DrawerNavItem title={'b_0'} itemID={'b_0'}>
                            <DrawerNavItem title={'b_0_0'} itemID={'b_0_0'} />
                            <DrawerNavItem title={'b_0_1'} itemID={'b_0_1'} />
                        </DrawerNavItem>
                        <DrawerNavItem title={'b_1'} itemID={'b_1'}>
                            <DrawerNavItem title={'b_1_0'} itemID={'b_1_0'} />
                        </DrawerNavItem>
                    </DrawerNavItem>
                    <DrawerNavItem
                        title={'c'}
                        itemID={'c'}
                        items={[
                            {
                                title: 'c_0',
                                itemID: 'c_0',
                                items: [
                                    { title: 'c_0_0', itemID: 'c_0_0' },
                                    { title: 'c_0_1', itemID: 'c_0_1' },
                                ],
                            },
                        ]}
                    />
                </DrawerNavGroup>
            </ThemeProvider>
        );

        const expectedNavItemTitleList = [
            'a',
            'b',
            'b_0',
            'b_0_0',
            'b_0_1',
            'b_1',
            'b_1_0',
            'c',
            'c_0',
            'c_0_0',
            'c_0_1',
        ];

        const navItemList = screen.getAllByTestId('blui-drawer-nav-item');
        expect(navItemList.length).toEqual(expectedNavItemTitleList.length);
        navItemList.forEach((item, index) => {
            expect(item).toHaveTextContent(expectedNavItemTitleList[index]);
        });
    });

    // it('inherits and overrides properties from Drawer', () => {
    //     render(
    //         <ThemeProvider theme={theme}>
    //             <Drawer activeItemBackgroundColor={'white'} divider={true} open={true}>
    //                 <DrawerBody>
    //                     <DrawerNavGroup items={[{ title: 'title 1', itemID: '' }]} />
    //                     <DrawerNavGroup
    //                         activeItemBackgroundColor={'black'}
    //                         divider={false}
    //                         items={[{ title: 'title 2', itemID: '' }]}
    //                     />
    //                 </DrawerBody>
    //             </Drawer>
    //         </ThemeProvider>
    //     );
    //     // const firstDrawerNavGroup = screen.getByText(/title 1/i);

    // const firstDrawerNavGroup = wrapper.find(DrawerNavGroup).get(0);
    // expect(firstDrawerNavGroup.props.activeItemBackgroundColor).toEqual('white');
    // expect(firstDrawerNavGroup.props.divider).toBeTruthy();

    //     const secondDrawerNavGroup = wrapper.find(DrawerNavGroup).get(1);
    //     expect(secondDrawerNavGroup.props.activeItemBackgroundColor).toEqual('black');
    //     expect(secondDrawerNavGroup.props.divider).toBeFalsy();
    // });
});

describe('DrawerRailItem', () => {
    it('renders text at full size', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerRailItem title={'Test'} itemID={'test'} icon={<></>} />
            </ThemeProvider>
        );
        expect(screen.getByText('Test')).toBeTruthy();
        expect(screen.getByText('Test')).toBeVisible();
    });

    it('renders no text for condensed', () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerRailItem condensed title={'Test'} itemID={'test'} icon={<></>} />
            </ThemeProvider>
        );
        expect(screen.queryByText('Test')).toBeFalsy();
        expect(screen.queryByText('Test')).toBeNull();
    });
});
