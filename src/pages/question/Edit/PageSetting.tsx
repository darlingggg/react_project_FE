import type { FC } from 'react'
import { useEffect } from 'react'
import { Form, Input } from 'antd'
import { useDispatch } from 'react-redux'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import { resetPageInfo } from '../../../store/pageInfoReducer'

const { TextArea } = Input

const PageSetting: FC = () => {
  const pageInfo = useGetPageInfo()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(pageInfo)
  }, [pageInfo, form])

  const handleValueChange = () => {
    // console.log('form.getFieldsValue()', form.getFieldsValue())
    dispatch(resetPageInfo(form.getFieldsValue()))
  }
  return (
    <>
      <Form initialValues={pageInfo} layout="vertical" onValuesChange={handleValueChange} form={form}>
        <Form.Item label="问卷标题" name="title" rules={[{ required: true, message: '请输入问卷标题' }]}>
          <Input placeholder="请输入页面标题" />
        </Form.Item>
        <Form.Item label="问卷描述" name="desc">
          <TextArea placeholder="请输入页面描述" />
        </Form.Item>
        <Form.Item label="样式代码" name="css">
          <TextArea placeholder="请输入样式代码" />
        </Form.Item>
        <Form.Item label="脚本代码" name="js">
          <TextArea placeholder="请输入脚本代码" />
        </Form.Item>
      </Form>
    </>
  )
}
export default PageSetting
