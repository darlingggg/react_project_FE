import type { Meta, StoryObj } from '@storybook/react-vite'
import Component from '../../components/QuestionComponents/QuestionRadio/Component'

const meta = {
  title: 'Question/QuestionRadio',
  component: Component,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
export const setProps: Story = {
  args: {
    title: '单选组件',
    isVertical: true,
    options: [
      { value: 'item1', text: '选项1' },
      { value: 'item2', text: '选项2' },
      { value: 'item3', text: '选项3' },
    ],
    value: 'item2'
  },
}