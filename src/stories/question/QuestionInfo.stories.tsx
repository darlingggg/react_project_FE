import type { Meta, StoryObj } from '@storybook/react-vite'
import Component from '../../components/QuestionComponents/QuestionInfo/Component'

const meta = {
  title: 'Question/QuestionInfo',
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
    title: 'Hello',
    desc: 'World!',
  },
}
export const DescBreakLine: Story = {
  args: {
    title: 'Hello',
    desc: 'World!\nHow are you?',
  },
}
