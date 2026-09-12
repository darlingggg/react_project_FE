import type { FC } from 'react'
import { Typography, Empty, Spin } from 'antd'
import QuestionCard from '../../components/QuestionCard'
import styles from './common.module.scss'
import { useTitle } from 'ahooks'
import ListSearch from '../../components/ListSearch'
import useLoadQuestionListData from '../../hooks/useLoadQuestionListData'
import ListPage from '../../components/ListPage'

const { Title } = Typography

const Star: FC = () => {
  useTitle('问卷 - 星标')
  const { data = {}, loading } = useLoadQuestionListData({ isStar: true })
  const { list = [], total = 0 } = data

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>星标问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch></ListSearch>
        </div>
      </div>
      <div className={styles.content}>
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin></Spin>
          </div>
        )}
        {!loading && list.length === 0 && <Empty description="暂无星标问卷" />}
        {!loading &&
          list.length > 0 &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          list.map((item: any) => {
            const { _id } = item
            return <QuestionCard key={_id} {...item} /> // 将item中的数据传给子组件props
          })}
      </div>
      {list.length !== 0 && (
        <div className={styles.footer}>
          <ListPage total={total} />
        </div>
      )}
    </>
  )
}
export default Star
