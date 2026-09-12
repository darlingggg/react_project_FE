import { useEffect, type FC } from 'react'
import { Form, Input } from 'antd'
import type { QuestionInputPropsType } from './interface'

const PropComponent: FC<QuestionInputPropsType> = (props: QuestionInputPropsType) => {
  const { title, placeholder, onChange, disabled } = props
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ title, placeholder })
  }, [title, placeholder, form])

  const handleValueChange = () => {
    if (onChange) {
      onChange(form.getFieldsValue())
    }
  }

  return (
    <Form layout="vertical" initialValues={{ title, placeholder }} form={form} onValuesChange={handleValueChange} disabled={disabled}>
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '标题项不能为空' }]}>
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="输入框提示" name="placeholder">
        <Input placeholder="请输入提示" />
      </Form.Item>
    </Form>
  )
}
export default PropComponent
