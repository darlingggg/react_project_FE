import type { FC } from 'react'
import QuestionInputConf, { type QuestionInputPropsType } from './QuestionInput'
import QuestionTitleConf, { type QuestionTitlePropsType } from './QuestionTitle'
import QuestionParagraphConf, { type QuestionParagraphPropsType } from './QuestionParagraph'
import QuestionInfoConf, { type QuestionInfoPropsType } from './QuestionInfo'
import QuestionTextareaConf, { type QuestionTextareaPropsType } from './QuestionTextarea'
import QuestionRadioConf, { type QuestionRadioPropsType, type QuestionRadioStatPropType } from './QuestionRadio'
import QuestionCheckboxConf, { type QuestionCheckboxPropsType, type QuestionCheckboxStatPropsType } from './QuestionCheckBox'

// 各个组件的 prop type
export type ComponentPropsType = QuestionInputPropsType &
  QuestionTitlePropsType &
  QuestionParagraphPropsType &
  QuestionInfoPropsType &
  QuestionTextareaPropsType &
  QuestionRadioPropsType &
  QuestionCheckboxPropsType

// 各个组件的统计属性类型
type ComponentStatType = QuestionRadioStatPropType & QuestionCheckboxStatPropsType

// 组件的配置
export type ComponentConfType = {
  title: string
  type: string
  Component: FC<ComponentPropsType>
  PropComponent: FC<ComponentPropsType>
  defaultProps: ComponentPropsType
  StatComponent?: FC<ComponentStatType>
}

// 全部组件的配置列表
const componentConfList: ComponentConfType[] = [
  QuestionInputConf,
  QuestionTitleConf,
  QuestionParagraphConf,
  QuestionInfoConf,
  QuestionTextareaConf,
  QuestionRadioConf,
  QuestionCheckboxConf,
]

// 组件分组
export const componentConfGroup = [
  {
    groupName: '文本显示',
    components: [QuestionTitleConf, QuestionParagraphConf, QuestionInfoConf],
  },
  {
    groupName: '用户输入',
    components: [QuestionInputConf, QuestionTextareaConf],
  },
  {
    groupName: '用户选择',
    components: [QuestionRadioConf, QuestionCheckboxConf],
  },
]

export const getComponentConfByType = (type: string) => {
  return componentConfList.find(conf => conf.type === type)
}
