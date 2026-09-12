export type QuestionInfoPropsType = {
  title?: string
  desc?: string
  colorTitle?: string
  colorDes?: string
  onChange?: (newProps: QuestionInfoPropsType) => void
  disabled?: boolean
}
export const QuestionInfoDefaultProps: QuestionInfoPropsType = {
  title: '问卷标题',
  desc: '问卷描述',
  colorTitle: '#000000',
  colorDes: '#000000',
}
