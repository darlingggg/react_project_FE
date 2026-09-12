import type { FC } from 'react'
import { QuestionTextareaDefaultProps, type QuestionTextareaPropsType } from './interface'
import { Typography, Input } from 'antd'

const { Paragraph } = Typography
const { TextArea } = Input
const QuestionTextarea: FC<QuestionTextareaPropsType> = props => {
  const { title = '', placeholder = '' } = { ...QuestionTextareaDefaultProps, ...props }
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <div>
        <TextArea value={placeholder} />
      </div>
    </div>
  )
}

export default QuestionTextarea
