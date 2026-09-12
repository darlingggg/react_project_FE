import type { FC } from 'react'
import { type QuestionRadioPropsType, QuestionRadioDefaultProps } from './interface'
import { Radio, Typography, Space } from 'antd'

const { Paragraph } = Typography
const Component: FC<QuestionRadioPropsType> = props => {
  const { title, isVertical, options = [], value } = { ...QuestionRadioDefaultProps, ...props }
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Radio.Group value={value}>
        <Space direction={isVertical ? 'vertical' : 'horizontal'}>
          {options.map(item => (
            <Radio key={item.value} value={item.value}>
              {item.text}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  )
}

export default Component
