import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import styles from './MainLayout.module.scss'
import Logo from '../components/Logo'
import UserInfo from '../components/UserInfo'
import useLoadUserData from '../hooks/useLoadUserData'
import useNavPage from '../hooks/useNavPage'

const { Header, Content, Footer } = Layout
const MainLayout: FC = () => {
  const { loading } = useLoadUserData()
  useNavPage(loading)
  const loadingElem = (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 64px - 71px - var(--desktop-titlebar-height))',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin />
    </div>
  )
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <UserInfo />
        </div>
      </Header>
      <Content className={styles.main}>{!loading ? <Outlet /> : loadingElem}</Content>
      <Footer className={styles.footer}>小猴问卷 &copy; 2025</Footer>
    </Layout>
  )
}
export default MainLayout
