import type { FC } from 'react'
import { Typography } from 'antd'
import { type QuestionInfoPropsType, QuestionInfoDefaultProps } from './interface'

const { Title, Paragraph } = Typography
const Component: FC<QuestionInfoPropsType> = props => {
  const { title = '', desc = '', colorTitle = '#000', colorDes = '#000' } = { ...QuestionInfoDefaultProps, ...props }
  const descList = desc.split('\n')
  return (
    <div style={{ textAlign: 'center' }}>
      <Title style={{ fontSize: '24px', color: colorTitle }}>{title}</Title>
      <Paragraph style={{ fontSize: '14px', color: colorDes }}>
        {descList.map((item, index) => (
          <span key={index}>
            {item} <br />
          </span>
        ))}
      </Paragraph>
    </div>
  )
}

export default Component
