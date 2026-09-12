import type { FC } from 'react'
import { useTitle } from 'ahooks'
// import { useParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { getQuestionService } from '../../../services/question'
import useLoadQuestionData from '../../../hooks/useLoadQuestionData'
import styles from './index.module.scss'
import EditCanvas from './EditCanvas'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import { useDispatch } from 'react-redux'
import { changeSelectedId } from '../../../store/componentsReducer'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import EditHeader from './EditHeader'

const Edit: FC = () => {
  // const { data } = useLoadQuestionData()
  // console.log('data', data) // 打印三次是 （组件挂在的时候 发送请求的时候 请求完毕之后(后两次都是因为改变了loading状态而useRequest返回的数据本质上是由useState封装的)）
  const { loading } = useLoadQuestionData()
  const { title } = useGetPageInfo()
  useTitle(`编辑问卷-${title}`)
  const dispatch = useDispatch()
  const clearSelectedId = () => {
    dispatch(changeSelectedId(''))
  }
  return (
    <div className={styles.container}>
      <div style={{ height: '40px', background: 'white' }}>
        <EditHeader />
      </div>
      <div className={styles['content-wrapper']}>
        <div className={styles.content}>
          <div className={styles.left}>
            <LeftPanel />
          </div>
          <div className={styles.main} onClick={clearSelectedId}>
            <div className={styles['canvas-wrapper']}>
              <EditCanvas loading={loading} />
            </div>
          </div>
          <div className={styles.right}>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Edit
