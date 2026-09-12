import type { FC } from 'react'
import { useEffect } from 'react'
import { QuestionCheckboxDefaultProps, type QuestionCheckboxPropsType, type OptionType } from './interface'
import { Form, Checkbox, Space, Input, Button } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const PropComponent: FC<QuestionCheckboxPropsType> = props => {
  const { title, list, isVertical, onChange, disabled } = { ...QuestionCheckboxDefaultProps, ...props }
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title, list, isVertical })
  }, [title, isVertical, list, form])
  const handleValueChange = () => {
    if (!onChange) return
    const newValues = form.getFieldsValue() as QuestionCheckboxPropsType
    console.log(newValues)
    if (newValues.list) {
      newValues.list = newValues.list.filter(item => item.text !== undefined)
    }
    const { list = [] } = newValues
    list.forEach((item: OptionType) => {
      if (!item.value) item.value = item.text
    })
    onChange(newValues)
  }
  return (
    <Form layout="vertical" form={form} initialValues={{ title, list, isVertical }} onValuesChange={handleValueChange} disabled={disabled}>
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '标题项不能为空' }]}>
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                const { key, name } = field

                return (
                  <Space key={key} align="baseline">
                    <Form.Item name={[name, 'checked']} valuePropName="checked">
                      <Checkbox></Checkbox>
                    </Form.Item>
                    <Form.Item
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: '选项不能为空' },
                        {
                          validator: (_, text) => {
                            const { list = [] } = form.getFieldsValue()
                            let num = 0
                            list.forEach((item: OptionType) => {
                              if (item.text === text) num++
                            })
                            return num > 1 ? Promise.reject('选项不能重复') : Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <Input placeholder="请输入选项" />
                    </Form.Item>
                    {index > 0 && (
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name)
                        }}
                      />
                    )}
                  </Space>
                )
              })}
              <Form.Item>
                <Button type="link" onClick={() => add({ text: '', value: '', checked: false })} icon={<PlusOutlined />} block>
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  )
}
export default PropComponent
