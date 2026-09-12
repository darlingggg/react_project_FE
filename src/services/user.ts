import axios from './axios'
import type { ResDataType } from './axios'

// 获取用户信息
export const getUserInfoService = async (): Promise<ResDataType> => {
  const url = '/api/user/info'
  const data = await axios.get(url)
  return data
}

// 注册用户
export const registerService = async (username: string, password: string, nickname?: string): Promise<ResDataType> => {
  const url = '/api/user/register'
  const data = await axios.post(url, { username, password, nickname: nickname || username })
  return data
}

// 登录
export const loginService = async (username: string, password: string): Promise<ResDataType> => {
  const url = '/api/user/login'
  const data = await axios.post(url, { username, password })
  return data
}
