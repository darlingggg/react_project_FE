import type { FC } from 'react'
import { useEffect } from 'react'
import { Form, Input, Checkbox, Select, ColorPicker } from 'antd'
import type { QuestionTitlePropsType } from './interface'

const PropComponent: FC<QuestionTitlePropsType> = props => {
  const { text, isCenter, level, color, onChange, disabled } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ text, level, isCenter, color })
  }, [form, text, level, color, isCenter])

  const handleValueChange = () => {
    console.log(form.getFieldsValue())
    if (onChange) {
      onChange(form.getFieldsValue())
    }
    console.log(form.getFieldsValue())
  }
  return (
    <Form layout="vertical" initialValues={{ text, level, isCenter }} form={form} onValuesChange={handleValueChange} disabled={disabled}>
      <Form.Item label="标题内容" name="text" rules={[{ required: true, message: '请输入标题内容' }]}>
        <Input></Input>
      </Form.Item>
      <Form.Item label="标题级别" name="level">
        <Select
          options={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
          ]}
        ></Select>
      </Form.Item>
      <Form.Item label="标题居中" name="isCenter" valuePropName="checked">
        <Checkbox>居中显示</Checkbox>
      </Form.Item>
      <Form.Item label="标题颜色" name="color" getValueFromEvent={(colorObj, color) => colorObj?.toHexString() || color}>
        <ColorPicker format="hex" />
      </Form.Item>
    </Form>
  )
}
export default PropComponent
