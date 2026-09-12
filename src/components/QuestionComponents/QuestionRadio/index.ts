import Component from './Component'
import { QuestionRadioDefaultProps } from './interface'
import PropComponent from './PropComponent'
import StatComponent from './StatComponent'

export * from './interface'

export default {
  title: '单选',
  type: 'questionRadio',
  Component, // 画布显示的组件
  PropComponent, // 属性组件
  StatComponent, // 数据统计组件
  defaultProps: QuestionRadioDefaultProps,
}
