import { useEffect, useState, type FC } from 'react'
import { Typography } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import styles from './Logo.module.scss'
import { Link } from 'react-router-dom'
import useGetUserInfo from '../hooks/useGetUserInfo'

const { Title } = Typography

const Logo: FC = () => {
  const { username } = useGetUserInfo()
  const [pathname, setPathname] = useState('/')
  useEffect(() => {
    setPathname(username ? '/manage/list' : '/')
  }, [username])
  return (
    <div className={styles.container}>
      <Link to={pathname} className={styles.link}>
        <Title style={{ margin: '0' }}>
          <FormOutlined />
        </Title>
        <Title style={{ margin: '0' }}>小猴问卷</Title>
      </Link>
    </div>
  )
}
export default Logo
