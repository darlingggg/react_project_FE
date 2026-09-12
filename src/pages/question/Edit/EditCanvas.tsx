import type { FC, MouseEvent } from 'react'
import styles from './EditCanvas.module.scss'
import { Spin } from 'antd'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
// import QuestionTitle from '../../../components/QuestionComponents/QuestionTitle/Component'
// import QuestionInput from '../../../components/QuestionComponents/QuestionInput/Component'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import { getComponentConfByType } from '../../../components/QuestionComponents'
import type { ComponentInfoType } from '../../../store/componentsReducer'
import { changeSelectedId, moveComponent } from '../../../store/componentsReducer'
import useBindCanvasKeyPress from '../../../hooks/useBindCanvasKeyPress'
import SortableContainer from '../../../components/DragSortable/SortableContainer'
import SortableItem from '../../../components/DragSortable/SortableItem'

type PropsType = {
  loading: boolean
}
function genComponent(componentInfo: ComponentInfoType) {
  const { type, props } = componentInfo
  const componentConf = getComponentConfByType(type)
  if (!componentConf) return null
  const { Component } = componentConf
  return <Component {...props} />
}

const EditCanvas: FC<PropsType> = ({ loading }) => {
  const { componentList, selectedId } = useGetComponentInfo()
  const dispatch = useDispatch()

  const handleClick = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    dispatch(changeSelectedId(id))
  }

  // 绑定快捷键
  useBindCanvasKeyPress()

  if (loading) {
    return (
      <div className={styles.spin}>
        <Spin size="large" />
      </div>
    )
  }

  const componentListWithId = componentList.map(component => {
    return { ...component, id: component.fe_id }
  })

  const handleDragEnd = (oldIndex: number, newIndex: number) => {
    dispatch(moveComponent({ oldIndex, newIndex }))
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      <div className={styles.canvas}>
        {componentList
          .filter(c => !c.isHidden)
          .map(item => {
            const { fe_id } = item
            return (
              <SortableItem key={fe_id} id={fe_id}>
                <div
                  className={classNames(styles['component-wrapper'], {
                    [styles.selected]: fe_id === selectedId,
                    [styles.locked]: item.isLocked,
                  })}
                  onClick={e => {
                    handleClick(e, fe_id)
                  }}
                >
                  <div className={styles.component}>{genComponent(item)}</div>
                </div>
              </SortableItem>
            )
          })}
        {/* <div className={styles['component-wrapper']}>
        <div className={styles.component}>
          <QuestionTitle></QuestionTitle>
        </div>
      </div>
      <div className={styles['component-wrapper']}>
        <div className={styles.component}>
          <QuestionInput></QuestionInput>
        </div>
      </div> */}
      </div>
    </SortableContainer>
  )
}

export default EditCanvas
