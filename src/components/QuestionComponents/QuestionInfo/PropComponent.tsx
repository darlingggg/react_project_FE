import type { FC } from 'react'
import { useEffect } from 'react'
import { type QuestionInfoPropsType } from './interface'
import { Form, Input, ColorPicker } from 'antd'

const { TextArea } = Input
const PropComponent: FC<QuestionInfoPropsType> = props => {
  const { title, desc, onChange, disabled, colorTitle, colorDes } = props
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ title, desc, colorTitle, colorDes })
  }, [title, desc, colorTitle, colorDes, form])
  const handleValueChange = () => {
    console.log(form.getFieldsValue())
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }
  return (
    <Form layout="vertical" initialValues={{ title, desc, colorTitle, colorDes }} disabled={disabled} form={form} onValuesChange={handleValueChange}>
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
        <Input></Input>
      </Form.Item>
      <Form.Item label="描述" name="desc">
        <TextArea></TextArea>
      </Form.Item>
      <Form.Item label="标题颜色" name="colorTitle" getValueFromEvent={(colorObj, color) => colorObj?.toHexString() || color}>
        <ColorPicker format="hex" />
      </Form.Item>
      <Form.Item label="描述颜色" name="colorDes" getValueFromEvent={(colorObj, color) => colorObj?.toHexString() || color}>
        <ColorPicker format="hex" />
      </Form.Item>
    </Form>
  )
}
export default PropComponent
