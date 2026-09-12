import type { FC } from 'react'
import { type QuestionCheckboxPropsType, QuestionCheckboxDefaultProps } from './interface'
import { Typography, Space, Checkbox } from 'antd'

const { Paragraph } = Typography

const Component: FC<QuestionCheckboxPropsType> = props => {
  const { title = '', list = [], isVertical } = { ...QuestionCheckboxDefaultProps, ...props }
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Space direction={isVertical ? 'vertical' : 'horizontal'}>
        {list.map(item => {
          const { value, text, checked } = item
          return (
            <Checkbox value={value} checked={checked} key={value}>
              {text}
            </Checkbox>
          )
        })}
      </Space>
    </div>
  )
}
export default Component
