import type { FC } from 'react'
import { Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { LOGIN_PATH } from '../router'
// import { getUserInfoService } from '../services/user'
// import { useRequest } from 'ahooks'
import { UserOutlined } from '@ant-design/icons'
import { removeToken } from '../utils/user_token'
// import { useEffect, useState } from 'react'
import useGetUserInfo from '../hooks/useGetUserInfo'
import { useDispatch } from 'react-redux'
import { logoutReducer } from '../store/userReducer'

const UserInfo: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { pathname } = useLocation()
  const { username, nickname } = useGetUserInfo()
  // const [userName, setUserName] = useState(userinfo.username)
  // const [nickname, setNickname] = useState(userinfo.nickname)
  // const { run } = useRequest(async () => await getUserInfoService(), {
  //   manual: true,
  //   onSuccess: data => {
  //     console.log(data)
  //     const { username, nickname } = data || {}
  //     setUserName(username)
  //     setNickname(nickname)
  //   },
  // })
  // useEffect(() => {
  //   run()
  // }, [run, pathname])

  const logout = () => {
    removeToken()
    navigate('/')
    message.success('退出成功')
    dispatch(logoutReducer())
  }

  const UserInfo = (
    <>
      <span style={{ color: 'white' }}>
        <UserOutlined />
        {nickname || username}
      </span>
      <Button type="link" onClick={logout}>
        退出
      </Button>
    </>
  )
  const Login = <Link to={LOGIN_PATH}>登录</Link>

  return <div>{username ? UserInfo : Login}</div>
}
export default UserInfo
