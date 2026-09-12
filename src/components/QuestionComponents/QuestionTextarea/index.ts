import Component from './Component'
import { QuestionTextareaDefaultProps } from './interface'
import PropComponent from './PropComponent'

export * from './interface'
export default {
  title: '多行输入',
  type: 'questionTextarea',
  Component, // 画布显示组件
  PropComponent, // 属性组件
  defaultProps: QuestionTextareaDefaultProps,
}
