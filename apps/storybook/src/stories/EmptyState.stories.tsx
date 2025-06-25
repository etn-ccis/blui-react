// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EmptyState } from '@brightlayer-ui/react-components';
import {NotListedLocation, Close} from '@mui/icons-material'

console.log('NotListedLocation', <NotListedLocation />)

const meta = {
  component: EmptyState,
  argTypes:{ title: {control: 'text'}, icon:{ control: 'select', options: ['Close', 'NotListedLocation'], mapping: {Close: <Close />, NotListedLocation: <NotListedLocation />}}},
    parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */

 const EmptyStateRenderer = (args) => {
  console.log('args:', args);
  return (
    <EmptyState  {...args}/>
  )
 }

 export const Basic = {
  render: EmptyStateRenderer,
  args: {
    title: 'Empty State',
    icon: 'Close'
  }
} satisfies Story;