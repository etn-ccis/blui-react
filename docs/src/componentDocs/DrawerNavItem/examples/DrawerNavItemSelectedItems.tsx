import React from 'react';
import Box from '@mui/material/Box';
import { CodeBlock, CodeBlockActionButtonRow } from '../../../shared';
import { DrawerNavItemSelectedItemsExample } from './DrawerNavItemSelectedItemsExample';

const codeSnippet = `<Drawer open={true} activeItem={selected}>
    <DrawerBody>
        <DrawerNavGroup hidePadding={true}>
            <DrawerNavItem
                activeItemBackgroundShape="square"
                title="Item 1"
                subtitle="with square highlight"
                itemID="Item 1"
                onClick={(): void => {
                    setSelected('Item 1');
                }}
            />
            <DrawerNavItem
                activeItemBackgroundShape="round"
                title="Item 2"
                subtitle="with round highlight"
                itemID="Item 2"
                onClick={(): void => {
                    setSelected('Item 2');
                }}
            />
            <DrawerNavItem
                title="Item 3"
                subtitle="with default highlight"
                itemID="Item 3"
                onClick={(): void => {
                    setSelected('Item 3');
                }}
            />
        </DrawerNavGroup>
    </DrawerBody>
</Drawer>
`;
export const DrawerNavItemSelectedItems = (): JSX.Element => (
    <Box>
        <DrawerNavItemSelectedItemsExample />
        <CodeBlock code={codeSnippet} language="jsx" dataLine="4-29" />
        <CodeBlockActionButtonRow
            copyText={codeSnippet}
            url="componentDocs/DrawerNavItem/examples/DrawerNavItemSelectedItemsExample.tsx"
        />
    </Box>
);
