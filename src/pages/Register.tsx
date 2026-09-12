import type { FC } from 'react'
import { Typography, Form, Input, Button, message } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import styles from './Register.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from '../router'
import { registerService } from '../services/user'
import { useRequest } from 'ahooks'

const { Title } = Typography
const Register: FC = () => {
  const navigate = useNavigate()
  const { run } = useRequest(
    async values => {
      const { username, password, nickname } = values
      const res = await registerService(username, password, nickname)
      return res
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('注册成功')
        navigate('/login')
      },
      onError: () => {
        message.error('注册用户失败')
      },
    }
  )
  const onFinish = (values: unknown) => {
    console.log('Success:', values)
    run(values)
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title level={2} style={{ margin: '0px' }}>
          <UserAddOutlined />
        </Title>
        <Title level={2} style={{ margin: '0px' }}>
          注册新用户
        </Title>
      </div>
      <div>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 20 }} onFinish={onFinish}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { type: 'string', min: 3, max: 20, message: '用户名长度在 3 到 20 之间' },
              { pattern: /^\w+$/, message: '用户名只能为字母数字下划线' },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password></Input.Password>
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirm"
            dependencies={['password']} // 依赖于password字段,password字段的值改变时，会重新触发validator
            rules={[
              { required: true, message: '请输入确认密码' },
              ({ getFieldValue }) => ({
                validator: (_, value) => {
                  if (value !== getFieldValue('password') && value !== '') {
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Password></Input.Password>
          </Form.Item>
          <Form.Item label="昵称" name="nickname">
            <Input></Input>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 20 }} className={styles.register}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
            <Link to={LOGIN_PATH}>已有账户，前往登录</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Register
