import type { FC } from 'react'
import { Typography } from 'antd'
import { QuestionTitleDefaultProps, type QuestionTitlePropsType } from './interface'

const { Title } = Typography
const QuestionTitle: FC<QuestionTitlePropsType> = props => {
  const { text = '', level = 1, isCenter = false, color = '#000000' } = { ...QuestionTitleDefaultProps, ...props }

  const genFontSize = (level: number) => {
    if (level === 1) return 24
    if (level === 2) return 20
    if (level === 3) return 16
    return 16
  }
  return (
    <Title level={level} style={{ textAlign: isCenter ? 'center' : 'start', marginBottom: '0', fontSize: genFontSize(level) + 'px', color: color }}>
      {text}
    </Title>
  )
}

export default QuestionTitle
