import { useSelector } from 'react-redux'
import type { StateType } from '../store'
import type { UserStateType } from '../store/userReducer'

function useGetUserInfo() {
  const userInfo = useSelector<StateType>(state => state.user)
  // const { username, nickname } = useSelector<StateType>(state => state.user)
  const { username, nickname, isLogout } = userInfo as UserStateType
  return { username, nickname, isLogout }
}

export default useGetUserInfo
