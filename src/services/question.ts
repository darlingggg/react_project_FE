import axios from './axios'
import type { ResDataType } from './axios'

type SearchOptions = {
  keyword: string
  isStar: boolean
  isDeleted: boolean
  page: number
  pageSize: number
}

// 获取单个问卷信息
export const getQuestionService = async (id: string): Promise<ResDataType> => {
  const url = `/api/question/${id}`
  const data = await axios.get(url)
  return data
}

// 创建问卷
export const createQuestionService = async (): Promise<ResDataType> => {
  const url = '/api/question'
  const data = await axios.post(url)
  return data
}

// 获取问卷列表  Partial就是这个类型中的属性都是可选的
export const getQuestionListService = async (opt: Partial<SearchOptions>): Promise<ResDataType> => {
  const url = '/api/question'
  const data = await axios.get(url, { params: opt })
  return data
}

// 更新问卷
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateQuestionService = async (id: string, data: { [key: string]: any }): Promise<ResDataType> => {
  const url = `/api/question/${id}`
  const resData = await axios.patch(url, data)
  return resData
}

// 复制问卷
export const duplicateQuestionService = async (id: string): Promise<ResDataType> => {
  const url = `/api/question/duplicate/${id}`
  const resData = await axios.post(url)
  return resData
}

// 批量彻底删除
export const deleteQuestionService = async (ids: string[]): Promise<ResDataType> => {
  const url = '/api/question'
  const resData = await axios.delete(url, { data: { ids } })
  return resData
}
