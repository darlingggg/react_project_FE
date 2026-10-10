import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import useLoadUserData from '../hooks/useLoadUserData'
import { Spin } from 'antd'
import useNavPage from '../hooks/useNavPage'

const QuestionLayout: FC = () => {
  const { loading } = useLoadUserData()
  useNavPage(loading)
  return (
    <div style={{ height: 'calc(100dvh - var(--desktop-titlebar-height))' }}>
      <div style={{ height: '100%' }}>{!loading ? <Outlet /> : <Spin />}</div>
    </div>
  )
}
export default QuestionLayout
