import type { FC } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useTitle, useDebounceFn, useRequest } from 'ahooks'
import { Typography, Spin, Empty } from 'antd'
import { useSearchParams } from 'react-router-dom'
import styles from './common.module.scss'
import QuestionCard from '../../components/QuestionCard'
import ListSearch from '../../components/ListSearch'
import { getQuestionListService } from '../../services/question'
import { removeToken } from '../../utils/user_token'

const { Title } = Typography
const List: FC = () => {
  useTitle('问卷 - 我的')
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [started, setStarted] = useState(false)
  const haveMoreData = total > list.length
  const [SearchParams] = useSearchParams()
  const keyword = SearchParams.get('keyword') || ''
  const containerRef = useRef<HTMLDivElement>(null)

  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListService({ page, pageSize: 10, keyword: keyword })
      console.log(data)
      return data
    },
    {
      manual: true,
      onSuccess: result => {
        const { list: list2 = [], count: total = 0 } = result
        setList(pre => pre.concat(list2))
        setTotal(total)
        setPage(page + 1)
      },
      onError: err => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((err as any).status === 401) {
          removeToken()
          window.location.reload() // 重新加载页面
        }
      },
    }
  )
  // 触发加载更多
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      if (loading) return
      const element = containerRef.current
      if (!element) return
      const domRect = element.getBoundingClientRect()
      if (domRect.bottom <= document.body.clientHeight) {
        setStarted(true)
        load()
      }
    },
    { wait: 1000 }
  )

  // 当页面初始化时触发
  useEffect(() => {
    tryLoadMore()
  }, [tryLoadMore])
  // 当keyword变化时触发
  useEffect(() => {
    setList([])
    setPage(1)
    setStarted(false)
    setTotal(0)
    tryLoadMore()
  }, [keyword, tryLoadMore])
  // 页面滚动时尝试触发加载
  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener('scroll', tryLoadMore)
    }
    return () => {
      window.removeEventListener('scroll', tryLoadMore) // 解绑事件 重要！！！
    }
  }, [haveMoreData, tryLoadMore])

  const loadMoreContentElem = () => {
    if (!started || loading) return <Spin />
    if (total === 0) return <Empty description="暂无数据" />
    if (!haveMoreData) return <div>没有更多数据了</div>
    return <div>加载更多</div>
  }
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        {list.length > 0 &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          list.map((item: any) => {
            const { _id } = item
            return <QuestionCard key={_id} {...item} /> // 将item中的数据传给子组件props
          })}
      </div>
      <div className={styles.footer}>
        <div ref={containerRef}>{loadMoreContentElem()}</div>
      </div>
    </>
  )
}
export default List
