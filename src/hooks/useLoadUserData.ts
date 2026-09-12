import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import useGetUserInfo from './useGetUserInfo'
import { getUserInfoService } from '../services/user'
import { loginReducer } from '../store/userReducer'
function useLoadUserData() {
  // 加载完毕之后直接放在redux中 不用返回用户数据
  const [loading, setLoading] = useState(true)
  const { username } = useGetUserInfo()
  const dispatch = useDispatch()
  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess: result => {
      const { username, nickname } = result
      dispatch(loginReducer({ username, nickname }))
    },
    onFinally: () => {
      setLoading(false)
    },
  })

  useEffect(() => {
    if (username) {
      setLoading(false)
      return
    } else {
      run()
    }
  }, [username, run])

  return { loading }
}

export default useLoadUserData
