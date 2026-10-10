import type { FC } from 'react'
import { Button, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { MANAGE_LIST_PATH } from '../router'
import styles from './Home.module.scss'
import { useRequest } from 'ahooks'
import { getCountService } from '../services/stat'
import { getToken } from '../utils/user_token'

const { Title, Paragraph } = Typography
const Home: FC = () => {
  const navigate = useNavigate()
  const { data = {} } = useRequest(getCountService)
  return (
    <div className={styles.container}>
      <Title>问卷调查 | 在线投票</Title>
      <Paragraph>
        已累计创建问卷 {data.totalQuestions} 份，发布问卷 {data.totalPublished} 份，收到答卷 {data.totalAnswers} 份
      </Paragraph>
      <div>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            window.desktop?.notice('这是一个通知消息')
            if (!getToken()) {
              message.warning('跳转页面需要登录')
              setTimeout(() => {
                navigate('/login')
              }, 500)
              return
            }
            navigate(MANAGE_LIST_PATH)
          }}
        >
          开始使用
        </Button>
      </div>
    </div>
  )
}
export default Home
