import { useRequest } from 'ahooks'
import { getQuestionListService } from '../services/question'
import { useSearchParams } from 'react-router-dom'

type OptionType = {
  isStar: boolean
  isDeleted: boolean
}
const useLoadQuestionListData = (opt: Partial<OptionType>) => {
  const { isStar, isDeleted } = opt
  const [searchParams] = useSearchParams()
  const { data, loading, error, refresh } = useRequest(
    async () => {
      const keyword = searchParams.get('keyword') || ''
      const page = Number(searchParams.get('page') || 1)
      const pageSize = Number(searchParams.get('pageSize') || 10)
      const data = await getQuestionListService({ keyword, isStar, isDeleted, page, pageSize })
      return data
    },
    {
      refreshDeps: [searchParams], // 刷新依赖项
    }
  )
  return { data, loading, error, refresh }
}
export default useLoadQuestionListData
