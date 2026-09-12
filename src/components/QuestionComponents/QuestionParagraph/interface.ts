export type QuestionParagraphPropsType = {
  text?: string
  isCenter?: boolean
  onChange?: (newProps: QuestionParagraphPropsType) => void
  disabled?: boolean
}
export const QuestionParagraphDefaultProps: QuestionParagraphPropsType = {
  text: '段落内容',
  isCenter: false,
}
