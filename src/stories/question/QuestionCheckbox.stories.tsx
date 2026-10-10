import type { Meta, StoryObj } from '@storybook/react-vite'
import Component from '../../components/QuestionComponents/QuestionCheckBox/Component'

const meta = {
  title: 'Question/QuestionCheckBox',
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
    list: [
      { value: 'item1', text: 'first_1', checked: true },
      { value: 'item2', text: 'second_2', checked: false },
      { value: 'item3', text: 'third_3', checked: true },
    ],
  },
}
