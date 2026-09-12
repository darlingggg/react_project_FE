import type { FC } from 'react'
import { QuestionInputDefaultProps, type QuestionInputPropsType } from './interface'
import { Typography, Input } from 'antd'

const { Paragraph } = Typography
const QuestionInput: FC<QuestionInputPropsType> = props => {
  const { title = '', placeholder = '' } = { ...QuestionInputDefaultProps, ...props }
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <div>
        <Input value={placeholder} />
      </div>
    </div>
  )
}

export default QuestionInput
