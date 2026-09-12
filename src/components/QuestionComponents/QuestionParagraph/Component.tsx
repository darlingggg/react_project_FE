import type { FC } from 'react'
import { type QuestionParagraphPropsType, QuestionParagraphDefaultProps } from './interface'
import { Typography } from 'antd'

const { Paragraph } = Typography
const Component: FC<QuestionParagraphPropsType> = props => {
  const { text = '', isCenter = false } = { ...QuestionParagraphDefaultProps, ...props }
  // const t = text.replaceAll('\n', '<br/>') // 直接使用html文本可能会发生无法预期的内容 例如插入一个视频图片之类的
  const textList = text.split('\n')
  return (
    <Paragraph style={{ textAlign: isCenter ? 'center' : 'start', marginBottom: '0px' }}>
      {textList.map((item, index) => (
        <span key={index}>
          {item}
          <br />
        </span>
      ))}
    </Paragraph>
  )
}

export default Component
