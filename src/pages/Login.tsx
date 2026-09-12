import type { FC } from 'react'
import { useEffect } from 'react'
import styles from './Login.module.scss'
import { Typography, Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { REGISTER_PATH } from '../router'
import { useRequest } from 'ahooks'
import { loginService } from '../services/user'
import { setToken } from '../utils/user_token'
import { useDispatch } from 'react-redux'
import { loginReducer } from '../store/userReducer'
import { getUserInfoService } from '../services/user'

const { Title } = Typography
const Login: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  useEffect(() => {
    const { username, password } = getUserInfo()
    form.setFieldsValue({ username, password })
  }, [form])

  const { run } = useRequest(
    async values => {
      const { username, password } = values
      const res = await loginService(username, password)
      return res
    },
    {
      manual: true,
      onSuccess: result => {
        const { token = '' } = result
        setToken(token)
        getUserInfoService().then(data => {
          dispatch(loginReducer({ username: data.username, nickname: data.nickname || '' }))
          if (form.getFieldValue('remember')) localStorage.setItem('nickname', data.nickname || '')
        })
        if (form.getFieldValue('remember')) {
          rememberUser(form.getFieldValue('username'), form.getFieldValue('password'))
        } else {
          forgetUser()
        }
        message.success('登录成功,即将跳转至管理页面...')
        setTimeout(() => {
          navigate('/manage/list')
        }, 1000)
      },
      onError: () => {
        forgetUser()
        message.error('用户名或密码错误')
      },
    }
  )

  const rememberUser = (username: string, password: string) => {
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }
  const forgetUser = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
  }
  const getUserInfo = () => {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    return { username, password }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    run(values)
  }
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title level={2} style={{ margin: '0px' }}>
          <UserOutlined />
        </Title>
        <Title level={2} style={{ margin: '0px' }}>
          用户登录
        </Title>
      </div>
      <div>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 30 }} onFinish={onFinish} initialValues={{ remember: true }} form={form}>
          {/* // rules={[
            //   { required: true, message: '请输入用户名' },
            //   { type: 'string', min: 3, max: 20, message: '用户名长度在 3 到 20 之间' },
            //   { pattern: /^\w+$/, message: '用户名只能为字母数字下划线' },
            // ]} // 这种写法可能同时出现两种错误避免这种情况可以使用自定义校验
          */}
          <Form.Item
            label="用户名"
            name="username"
            validateFirst={true}
            rules={[
              { required: true, message: '请输入用户名' },
              {
                validator: (_, values) => {
                  if (values.length < 3 || values.length > 20) {
                    return Promise.reject(new Error('用户名长度在 3 到 20 之间'))
                  }
                  if (!/^\w+$/.test(values)) {
                    return Promise.reject(new Error('用户名只能为字母数字下划线'))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input></Input>
          </Form.Item>
          {/* 这里Input不能通过value来控制值，只有单独使用的时候可以，当有Form的时候，一切控件由Form来控制 */}
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password></Input.Password>
          </Form.Item>
          {/* Form.Item 默认是绑定的子元素的value属性 而Checkbox没有value属性 因此使用valuePropName来指定什么属性作为这个Form.Item的值 */}
          <Form.Item wrapperCol={{ offset: 6, span: 30 }} name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 30 }} className={styles.login}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
            <Link to={REGISTER_PATH}>注册新用户</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Login
