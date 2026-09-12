import axios from './axios'
import type { ResDataType } from './axios'

export const getQuestionStatListService = async (questionId: string, opt: { page: number; pageSize: number }): Promise<ResDataType> => {
  const url = `/api/stat/${questionId}`
  const data = await axios.get(url, { params: opt })
  return data
}

export const getComponentStatService = async (questionId: string, componentId: string): Promise<ResDataType> => {
  const url = `/api/stat/${questionId}/${componentId}`
  const data = await axios.get(url)
  return data
}

export const getCountService = async (): Promise<ResDataType> => {
  const url = `/api/stat`
  const data = await axios.get(url)
  return data
}
