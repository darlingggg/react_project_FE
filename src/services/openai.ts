import axios from './axios'
import type { ResDataType } from './axios'

export const getAiService = async (question: string): Promise<ResDataType> => {
  const url = '/api/openai'
  const data = await axios.get(url, { params: { prompt: question } })
  return data
}
