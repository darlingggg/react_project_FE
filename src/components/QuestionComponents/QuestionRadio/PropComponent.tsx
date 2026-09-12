import type { FC } from 'react'
import { useEffect } from 'react'
// import { nanoid } from 'nanoid'
import { type QuestionRadioPropsType, type OptionType } from './interface'
import { Form, Input, Checkbox, Select, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const PropComponent: FC<QuestionRadioPropsType> = props => {
  const { title, options = [], value, onChange, disabled, isVertical } = props
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({ title, isVertical, value, options })
  }, [title, isVertical, value, options, form])

  const handleValueChange = () => {
    const newValues = form.getFieldsValue() as QuestionRadioPropsType
    if (newValues.options) {
      newValues.options = newValues.options.filter(item => item.text !== undefined)
    }
    const { options = [] } = newValues
    console.log(options)
    options.forEach((item: OptionType) => {
      if (!item.value) item.value = item.text
    })
    if (onChange) {
      onChange(newValues)
    }
  }

  return (
    <Form layout="vertical" initialValues={{ title, isVertical, value, options }} disabled={disabled} form={form} onValuesChange={handleValueChange}>
      <Form.Item label="标题" name="title" rules={[{ required: true, message: '标题项不能为空' }]}>
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                const { key, name } = field
                return (
                  <Space key={key} align="baseline">
                    <Form.Item
                      name={[name, 'text']}
                      rules={[
                        { required: true, message: '选项不能为空' },
                        {
                          validator: (_, text) => {
                            const { options = [] } = form.getFieldsValue()
                            let num = 0
                            options.forEach((item: OptionType) => {
                              if (item.text === text) num++
                            })
                            return num > 1 ? Promise.reject('选项不能重复') : Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <Input placeholder="请输入选项" />
                    </Form.Item>
                    {index > 1 && (
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
                <Button type="link" onClick={() => add({ text: '', value: '' })} icon={<PlusOutlined />} block>
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label="默认选中" name="value">
        <Select value={value} options={options.map(item => ({ value: item.value, label: item.text || '' }))}></Select>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  )
}

export default PropComponent
