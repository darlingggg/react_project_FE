import useGetUserInfo from './useGetUserInfo'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { setIsLogoutReducer } from '../store/userReducer'

const useNavPage = (loading: boolean) => {
  const { username, isLogout } = useGetUserInfo()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (loading) return
    if (username && (pathname === '/login' || pathname === '/register')) {
      navigate('/manage/list')
      return
    }
    if (!username && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
      if (!isLogout) message.warning('跳转页面需要登录')
      dispatch(setIsLogoutReducer(false))
      setTimeout(() => {
        navigate('/login')
      }, 500)
      return
    }
  }, [loading, username, pathname, isLogout, navigate, dispatch])
}
export default useNavPage
