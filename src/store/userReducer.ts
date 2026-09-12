import { createSlice } from '@reduxjs/toolkit'

export type UserStateType = {
  username: string
  nickname: string
  isLogout: boolean
}

const init_state: UserStateType = {
  username: localStorage.getItem('username') || '',
  nickname: localStorage.getItem('nickname') || '',
  isLogout: false,
}
const userSlice = createSlice({
  name: 'user',
  initialState: init_state,
  reducers: {
    loginReducer: (state, action) => {
      state.username = action.payload.username
      state.nickname = action.payload.nickname
      state.isLogout = true
    },
    logoutReducer: state => {
      state.username = ''
      state.nickname = ''
    },
    setIsLogoutReducer: (state, action) => {
      state.isLogout = action.payload
    },
  },
})

export const { loginReducer, logoutReducer, setIsLogoutReducer } = userSlice.actions
export default userSlice.reducer
