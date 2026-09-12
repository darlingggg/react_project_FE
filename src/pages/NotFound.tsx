import type { FC } from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { MANAGE_LIST_PATH } from '../router'

const NotFound: FC = () => {
  const navigate = useNavigate()
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate(MANAGE_LIST_PATH)
          }}
        >
          返回首页
        </Button>
      }
    ></Result>
  )
}
export default NotFound
