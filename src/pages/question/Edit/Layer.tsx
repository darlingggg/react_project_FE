import type { ChangeEvent, FC } from 'react'
import { useState } from 'react'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import styles from './Layer.module.scss'
import { Button, message, Tooltip, Input } from 'antd'
import { LockOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { changeSelectedId, changeComponentHidden, toggleComponentLocked, changeComponentTitle, moveComponent } from '../../../store/componentsReducer'
import SortableContainer from '../../../components/DragSortable/SortableContainer'
import SortableItem from '../../../components/DragSortable/SortableItem'

const Layer: FC = () => {
  const { componentList, selectedId } = useGetComponentInfo()
  const dispatch = useDispatch()

  const [changingTitleId, setChangingTitleId] = useState('')
  const handleTitleClick = (fe_id: string, isHidden: boolean) => {
    if (isHidden) {
      message.warning('无法选中隐藏的组件')
      return
    }
    if (fe_id !== selectedId) {
      dispatch(changeSelectedId(fe_id))
      setChangingTitleId('')
      return
    }
    setChangingTitleId(fe_id)
  }
  const handleHiddenClick = (fe_id: string, isHidden: boolean) => {
    console.log('isHidden', isHidden)
    dispatch(changeComponentHidden({ fe_id, isHidden }))
  }
  const handleLockedClick = (fe_id: string) => {
    dispatch(toggleComponentLocked({ fe_id }))
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim()
    if (!newTitle) return
    if (!selectedId) return
    dispatch(changeComponentTitle({ fe_id: selectedId, title: newTitle }))
  }

  // SortableContainer组件中的item属性需要每个item都有id
  const componentListWithId = componentList.map(component => {
    return { ...component, id: component.fe_id }
  })

  // 拖拽排序结束
  const handleDragEnd = (oldIndex: number, newIndex: number) => {
    dispatch(moveComponent({ oldIndex, newIndex }))
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      {componentList.map(component => {
        const { isHidden = false, isLocked = false, fe_id = '', title = '' } = component
        return (
          <SortableItem key={fe_id} id={fe_id}>
            <div className={styles.item}>
              <div
                style={{ color: fe_id === selectedId ? '#0786f7' : 'unset', cursor: 'pointer' }}
                onClick={() => {
                  handleTitleClick(fe_id, isHidden)
                }}
              >
                {fe_id === changingTitleId ? (
                  <Input
                    value={title}
                    onBlur={() => setChangingTitleId('')}
                    onPressEnter={() => setChangingTitleId('')}
                    onChange={changeTitle}
                    autoFocus
                  />
                ) : (
                  title
                )}
              </div>
              <div className={styles.buttons}>
                <Tooltip title="隐藏">
                  <Button
                    icon={<EyeInvisibleOutlined />}
                    type={isHidden ? 'primary' : 'text'}
                    shape="circle"
                    style={{ color: selectedId === fe_id ? 'black' : isHidden ? 'white' : 'gray' }}
                    onClick={() => handleHiddenClick(fe_id, !isHidden)}
                  ></Button>
                </Tooltip>
                <Tooltip title="锁定">
                  <Button
                    icon={<LockOutlined />}
                    type={isLocked ? 'primary' : 'text'}
                    shape="circle"
                    style={{ color: selectedId === fe_id ? 'black' : isLocked ? 'white' : 'gray' }}
                    onClick={() => handleLockedClick(fe_id)}
                  ></Button>
                </Tooltip>
              </div>
            </div>
          </SortableItem>
        )
      })}
    </SortableContainer>
  )
}

export default Layer
