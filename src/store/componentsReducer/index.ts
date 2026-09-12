import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ComponentPropsType } from '../../components/QuestionComponents'
import { getNextSelectedId, insertNewComponent } from './utils'
import cloneDeep from 'lodash.cloneDeep'
import { nanoid } from 'nanoid'
import { arrayMove } from '@dnd-kit/sortable'

export type ComponentInfoType = {
  fe_id: string
  type: string
  title: string
  isHidden?: boolean
  isLocked?: boolean
  props: ComponentPropsType
}

export type ComponentsStateType = {
  selectedId: string
  componentList: ComponentInfoType[]
  copiedComponent: null | ComponentInfoType
}

const init_state: ComponentsStateType = {
  selectedId: '',
  componentList: [],
  copiedComponent: null,
}

export const componentsSlice = createSlice({
  name: 'components',
  initialState: init_state,
  reducers: {
    // 重置所有组件
    resetComponents: (state: ComponentsStateType, action: PayloadAction<ComponentsStateType>) => {
      // 在 createSlice 的 reducer 中，参数 state 是 Immer 的 draft。写 state = action.payload 只是把局部变量重绑定，
      // 不会修改外部的 state。要替换整个 state，必须返回新的 state 对象
      state.componentList = action.payload.componentList
      state.selectedId = action.payload.selectedId
      // return action.payload
    },
    // 修改 selectedId
    changeSelectedId: (state: ComponentsStateType, action: PayloadAction<string>) => {
      state.selectedId = action.payload
    },
    // 添加新组件
    addComponent: (state: ComponentsStateType, action: PayloadAction<ComponentInfoType>) => {
      const newComponent = action.payload
      insertNewComponent(state, newComponent)
    },
    // 修改组件属性
    changeComponentProps: (state: ComponentsStateType, action: PayloadAction<{ fe_id: string; newProps: ComponentPropsType }>) => {
      const { fe_id, newProps } = action.payload
      const curComp = state.componentList.find(item => item.fe_id === fe_id)
      if (curComp) {
        curComp.props = { ...curComp.props, ...newProps }
      }
    },
    // 删除组件
    removeSelectedComponent: (state: ComponentsStateType) => {
      const removeId = state.selectedId
      const index = state.componentList.findIndex(item => item.fe_id === removeId)
      const nextId = getNextSelectedId(removeId, state.componentList)
      if (index !== -1) {
        state.componentList.splice(index, 1)
        state.selectedId = nextId
      }
    },
    // 隐藏与显示组件
    changeComponentHidden: (state: ComponentsStateType, action: PayloadAction<{ fe_id: string; isHidden: boolean }>) => {
      const fe_id = action.payload.fe_id
      const isHidden = action.payload.isHidden
      const curComp = state.componentList.find(item => item.fe_id === fe_id)
      let nextId = ''
      if (isHidden) nextId = getNextSelectedId(fe_id, state.componentList)
      else nextId = fe_id
      if (curComp) {
        curComp.isHidden = !curComp.isHidden
        state.selectedId = nextId
      }
    },
    // 锁定/解锁 组件
    toggleComponentLocked: (state: ComponentsStateType, action: PayloadAction<{ fe_id: string }>) => {
      const fe_id = action.payload.fe_id
      const curComp = state.componentList.find(item => item.fe_id === fe_id)
      if (curComp) {
        curComp.isLocked = !curComp.isLocked
      }
    },
    // 复制组件
    copyComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList = [] } = state
      const selectedComponent = componentList.find(item => item.fe_id === selectedId)
      if (!selectedComponent) return
      state.copiedComponent = cloneDeep(selectedComponent)
    },
    // 粘贴组件
    pasteComponent: (state: ComponentsStateType) => {
      const { copiedComponent } = state
      if (!copiedComponent) return
      const newComponent = cloneDeep(copiedComponent)
      newComponent.fe_id = nanoid()
      insertNewComponent(state, newComponent)
    },
    // 选中上一个
    selectPrevComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList = [] } = state
      const index = componentList.findIndex(item => item.fe_id === selectedId)
      if (index < 0 || componentList.length <= 1) return
      if (index === 0) {
        state.selectedId = componentList[componentList.length - 1].fe_id
        return
      }
      const prevId = componentList[index - 1].fe_id
      state.selectedId = prevId
    },
    // 选中下一个
    selectNextComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList = [] } = state
      const index = componentList.findIndex(item => item.fe_id === selectedId)
      if (index < 0 || componentList.length <= 1) return
      if (index === componentList.length - 1) {
        state.selectedId = componentList[0].fe_id
        return
      }
      state.selectedId = componentList[index + 1].fe_id
    },
    // 修改组件标题
    changeComponentTitle: (state: ComponentsStateType, action: PayloadAction<{ fe_id: string; title: string }>) => {
      const { fe_id, title } = action.payload
      const curComp = state.componentList.find(item => item.fe_id === fe_id)
      if (curComp) {
        curComp.title = title
      }
    },
    // 移动组件
    moveComponent: (state: ComponentsStateType, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload
      state.componentList = arrayMove(state.componentList, oldIndex, newIndex)
    },
  },
})

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copyComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
  changeComponentTitle,
  moveComponent,
} = componentsSlice.actions
export default componentsSlice.reducer
