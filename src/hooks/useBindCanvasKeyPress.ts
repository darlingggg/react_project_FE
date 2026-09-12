import { useKeyPress } from 'ahooks'
import { useDispatch } from 'react-redux'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { removeSelectedComponent, copyComponent, pasteComponent, selectPrevComponent, selectNextComponent } from '../store/componentsReducer'

const isActiveElementValid = () => {
  const activeElement = document.activeElement
  // 未增加dnd-kit之前
  // if (activeElement === document.body) return true

  // 增加了dnd-kit之后
  if (activeElement === document.body) return true
  if (activeElement?.matches('div[role="button"]')) return true
  return false
}
const useBindCanvasKeyPress = () => {
  const dispatch = useDispatch()
  // 删除
  useKeyPress(['backspace', 'delete'], () => {
    if (isActiveElementValid()) {
      dispatch(removeSelectedComponent())
    }
  })
  // 复制
  useKeyPress(['ctrl.c', 'meta.c'], () => {
    if (isActiveElementValid()) {
      dispatch(copyComponent())
    }
  })
  // 粘贴
  useKeyPress(['ctrl.v', 'meta.v'], () => {
    if (isActiveElementValid()) {
      dispatch(pasteComponent())
    }
  })
  // 选中上一个
  useKeyPress(['uparrow'], () => {
    if (!isActiveElementValid()) return
    dispatch(selectPrevComponent())
  })
  // 选中下一个
  useKeyPress(['downarrow'], () => {
    if (!isActiveElementValid()) return
    dispatch(selectNextComponent())
  })
  // 撤销
  useKeyPress(
    ['ctrl.z', 'meta.z'],
    () => {
      if (isActiveElementValid()) {
        dispatch(UndoActionCreators.undo())
      }
    },
    { exactMatch: true } // 严格匹配 不然重做无法触发
  )
  // 重做
  useKeyPress(['ctrl.shift.z', 'meta.shift.z'], () => {
    if (isActiveElementValid()) {
      dispatch(UndoActionCreators.redo())
    }
  })
}

export default useBindCanvasKeyPress
