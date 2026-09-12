import { type FC, useState } from 'react'
import { Spin, Result, Button } from 'antd'
import { useTitle } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import styles from './index.module.scss'
import StatHeader from './StatHeader'
import ComponentList from './ComponentList'
import PageStat from './PageStat'
import ChartStat from './ChartStat'

const Stat: FC = () => {
  const navigate = useNavigate()
  const { loading } = useLoadQuestionData()
  const { isPublished, title } = useGetPageInfo()
  useTitle(`问卷统计-${title}`)

  const [selectedComponentId, setSelectedComponentId] = useState('')
  const [selectedComponentType, setSelectedComponentType] = useState('')

  // Loading Elem
  const LoadingElem = (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size="large" />
    </div>
  )

  // Content Elem
  const genContentElem = () => {
    if (typeof isPublished === 'boolean' && !isPublished) {
      return (
        <div style={{ flex: 1 }}>
          <Result
            status="warning"
            title="该问卷尚未发布"
            extra={
              <Button type="primary" onClick={() => navigate(-1)}>
                返回
              </Button>
            }
          ></Result>
        </div>
      )
    }
    return (
      <>
        <div className={styles.left}>
          <ComponentList
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
            selectedComponentId={selectedComponentId}
          />
        </div>
        <div className={styles.main}>
          <PageStat
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
            selectedComponentId={selectedComponentId}
          />
        </div>
        <div className={styles.right}>
          <ChartStat selectedComponentId={selectedComponentId} selectedComponentType={selectedComponentType} />
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <StatHeader></StatHeader>
      <div className={styles['content-wrapper']}>
        {loading && LoadingElem}
        {!loading && <div className={styles.content}>{genContentElem()}</div>}
      </div>
    </div>
  )
}
export default Stat
