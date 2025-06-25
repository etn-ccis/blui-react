import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { EmptyState } from '@brightlayer-ui/react-components';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/EmptyState',
  component: EmptyState,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    title: { control: 'text' },
    icon: { control: 'select', options: ['Button', 'Calendar', 'Camera', 'Chat', 'CheckCircle', 'Clock', 'CloseCircle', 'Cloud', 'Code', 'Cog', 'Compass', 'Copy', 'CreditCard', 'Database', 'Delete', 'Download', 'Edit', 'Email', 'ErrorCircle', 'FileText', 'FilterList', 'Flag', 'FolderOpen', 'Heart', 'HelpCircle', 'Image', 'InfoCircle', 'KeypadEnter'] },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Empty State',
    icon: 'Button',
  },
};
