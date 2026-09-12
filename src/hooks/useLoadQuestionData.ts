import { useParams } from 'react-router-dom'
import { getQuestionService } from '../services/question'
import { useRequest } from 'ahooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resetComponents } from '../store/componentsReducer'
import { resetPageInfo } from '../store/pageInfoReducer'

function useLoadQuestionData() {
  // 获取路由上的id参数，如果不存在就置为空 就是配置路由时的 /:id 的具体值
  const { id = '' } = useParams()
  const dispatch = useDispatch()
  // const [loading, setLoading] = useState(true)
  // const [questionData, setQuestionData] = useState({})
  // // useEffect中的回调函数不能使用async 当有异步时候，需要使用promise.then() 或者 在回调中定义一个async函数并调用
  // useEffect(() => {
  //   // 方式1
  //   // getQuestionService(id).then(res => {
  //   //   setQuestionData(res)
  //   //   setLoading(false)
  //   // })
  //   // 方式2
  //   const fn = async () => {
  //     const res = await getQuestionService(id)
  //     setQuestionData(res)
  //     setLoading(false)
  //   }
  //   fn()
  // }, [id])
  // return { loading, questionData }

  //  使用第三方hook简化代码
  // async function loadData() {
  //   const res = await getQuestionService(id)
  //   return res
  // }
  // const { loading, data, error } = useRequest(loadData)
  // return { loading, data, error }

  // 重构后
  const { data, loading, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw new Error('id不能为空')
      const data = await getQuestionService(id)
      return data
    },
    { manual: true }
  )

  useEffect(() => {
    if (!data) return
    const { title = '', componentList = [], desc = '', js = '', css = '', isPublished = false } = data
    let selectedId = ''
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id
    }
    dispatch(resetComponents({ componentList, selectedId, copiedComponent: null }))
    dispatch(resetPageInfo({ title, desc, js, css, isPublished }))
  }, [data, dispatch])

  useEffect(() => {
    run(id)
  }, [id, run])

  return { loading, error, data }
}

export default useLoadQuestionData
