import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListItemTag } from '@brightlayer-ui/react-components';
import { action } from 'storybook/actions';
import * as Colors from '@brightlayer-ui/colors';

const meta = {
    component: ListItemTag,
    argTypes: {
        label: { control: 'text' },
        backgroundColor: { control: 'color' },
        fontColor: { control: 'color' },
        variant: {
            control: 'select',
            options: ['overline', 'caption', 'body2', 'body1'],
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ListItemTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBasicUsage: Story = {
    render: ({ label, variant }) => <ListItemTag label={label} variant={variant} />,
    args: {
        label: 'ACTIVE',
        variant: 'body1',
    },
} satisfies Story;

export const WithCustomBackgroundColor: Story = {
    render: ({ label, backgroundColor, variant }) => (
        <ListItemTag label={label} backgroundColor={backgroundColor} variant={variant} />
    ),
    args: {
        label: 'WARNING',
        backgroundColor: Colors.yellow[500],
        variant: 'body1',
    },
} satisfies Story;

export const WithCustomFontColor: Story = {
    render: ({ label, backgroundColor, fontColor, variant }) => (
        <ListItemTag label={label} backgroundColor={backgroundColor} fontColor={fontColor} variant={variant} />
    ),
    args: {
        label: 'ERROR',
        backgroundColor: Colors.red[500],
        fontColor: Colors.white[50],
        variant: 'body1',
    },
} satisfies Story;

export const WithCustomColors: Story = {
    render: ({ label, backgroundColor, fontColor, variant }) => (
        <ListItemTag label={label} backgroundColor={backgroundColor} fontColor={fontColor} variant={variant} />
    ),
    args: {
        label: 'SUCCESS',
        backgroundColor: Colors.green[500],
        fontColor: Colors.white[50],
        variant: 'body1',
    },
} satisfies Story;

export const WithClickHandler: Story = {
    render: ({ label, backgroundColor, fontColor, variant }) => (
        <ListItemTag
            label={label}
            backgroundColor={backgroundColor}
            fontColor={fontColor}
            variant={variant}
            onClick={action('Tag Clicked')}
        />
    ),
    args: {
        label: 'CLICKABLE',
        backgroundColor: Colors.blue[500],
        fontColor: Colors.white[50],
        variant: 'body1',
    },
} satisfies Story;

export const WithCustomVariant: Story = {
    render: ({ label, backgroundColor, fontColor, variant }) => (
        <ListItemTag label={label} backgroundColor={backgroundColor} fontColor={fontColor} variant={variant} />
    ),
    args: {
        label: 'CUSTOM',
        backgroundColor: Colors.purple[500],
        fontColor: Colors.white[50],
        variant: 'body2',
    },
} satisfies Story;

export const MultipleTags: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ListItemTag label="ACTIVE" backgroundColor={Colors.green[500]} />
            <ListItemTag label="PENDING" backgroundColor={Colors.yellow[500]} />
            <ListItemTag label="ERROR" backgroundColor={Colors.red[500]} />
            <ListItemTag label="INFO" backgroundColor={Colors.blue[500]} />
            <ListItemTag label="DISABLED" backgroundColor={Colors.gray[500]} />
        </div>
    ),
} satisfies Story;
