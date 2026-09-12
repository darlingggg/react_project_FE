import { message } from 'antd'
import axios from 'axios'
import { getToken } from '../utils/user_token'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: 'http://localhost:3300',
  // baseURL: 'http://101.201.170.43:3300',
  timeout: 5000,
})

// request 拦截器 : 添加 token
instance.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  Error => Promise.reject(Error)
)

//  response 拦截器 : 统一处理 errno 和 msg
instance.interceptors.response.use(
  res => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const resDate = (res.data || {}) as ResType
    const { errno, data, msg } = resDate
    if (errno !== 0) {
      if (msg) {
        message.error(msg)
      }
      throw new Error(msg)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any
  },
  error => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default instance
// export const baseURL = 'http://101.201.170.43:3300'
// export const baseURL = 'http://localhost:3300'
export const baseURL = import.meta.env.VITE_BASE_URL
export type ResType = { errno: number; data?: ResDataType; msg?: string }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResDataType = { [key: string]: any }
