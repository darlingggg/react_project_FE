import type { FC } from 'react'
import { Button, Tooltip } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  BlockOutlined,
  UpOutlined,
  DownOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import {
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copyComponent,
  pasteComponent,
  moveComponent,
} from '../../../store/componentsReducer'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'

const EditToolbar: FC = () => {
  const dispatch = useDispatch()
  const { selectedId, selectedComponent, copiedComponent, componentList } = useGetComponentInfo()
  const isLocked = selectedComponent?.isLocked
  const length = componentList.length
  const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId)
  const isFirst = selectedIndex === 0
  const isLast = selectedIndex === length - 1
  // 删除组件
  const handleDelete = () => {
    dispatch(removeSelectedComponent())
  }
  // 隐藏组件
  const handleHidden = () => {
    dispatch(changeComponentHidden({ fe_id: selectedId, isHidden: true }))
  }
  // 锁定组件
  const handleLock = () => {
    dispatch(toggleComponentLocked({ fe_id: selectedId }))
  }
  // 复制组件
  const copy = () => {
    dispatch(copyComponent())
  }
  // 粘贴组件
  const paste = () => {
    dispatch(pasteComponent())
  }
  // 上移/下移
  const move = (type: 'up' | 'down') => {
    dispatch(moveComponent({ oldIndex: selectedIndex, newIndex: type === 'up' ? selectedIndex - 1 : selectedIndex + 1 }))
  }
  // 撤销
  const undo = () => dispatch(UndoActionCreators.undo())
  // 重做
  const redo = () => dispatch(UndoActionCreators.redo())
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <Tooltip title="删除">
        <Button shape="circle" icon={<DeleteOutlined />} onClick={handleDelete}></Button>
      </Tooltip>
      <Tooltip title="隐藏">
        <Button shape="circle" icon={<EyeInvisibleOutlined />} onClick={handleHidden}></Button>
      </Tooltip>
      <Tooltip title="锁定">
        <Button shape="circle" icon={<LockOutlined />} onClick={handleLock} type={isLocked ? 'primary' : 'default'}></Button>
      </Tooltip>
      <Tooltip title="复制">
        <Button shape="circle" icon={<CopyOutlined />} onClick={copy}></Button>
      </Tooltip>
      <Tooltip title="粘贴">
        <Button shape="circle" icon={<BlockOutlined />} onClick={paste} disabled={!copiedComponent}></Button>
      </Tooltip>
      <Tooltip title="上移">
        <Button shape="circle" icon={<UpOutlined />} onClick={() => move('up')} disabled={isFirst}></Button>
      </Tooltip>
      <Tooltip title="下移">
        <Button shape="circle" icon={<DownOutlined />} onClick={() => move('down')} disabled={isLast}></Button>
      </Tooltip>
      <Tooltip title="撤销">
        <Button shape="circle" icon={<UndoOutlined />} onClick={undo}></Button>
      </Tooltip>
      <Tooltip title="重做">
        <Button shape="circle" icon={<RedoOutlined />} onClick={redo}></Button>
      </Tooltip>
    </div>
  )
}
export default EditToolbar
