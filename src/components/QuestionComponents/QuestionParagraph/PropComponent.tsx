import type { FC } from 'react'
import { useEffect } from 'react'
import { type QuestionParagraphPropsType } from './interface'
import { Form, Input, Checkbox } from 'antd'

const { TextArea } = Input

const PropComponent: FC<QuestionParagraphPropsType> = props => {
  const { text, isCenter, onChange, disabled } = props
  const [form] = Form.useForm()
  const handleValueChange = () => {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }
  useEffect(() => {
    form.setFieldsValue({ text, isCenter })
  }, [text, isCenter, form])
  return (
    <Form layout="vertical" initialValues={{ text, isCenter }} onValuesChange={handleValueChange} disabled={disabled} form={form}>
      <Form.Item label="段落内容" name="text" rules={[{ required: true, message: '段落内容不能为空' }]}>
        <TextArea></TextArea>
      </Form.Item>
      <Form.Item label="居中显示" name="isCenter" valuePropName="checked">
        <Checkbox></Checkbox>
      </Form.Item>
    </Form>
  )
}
export default PropComponent
