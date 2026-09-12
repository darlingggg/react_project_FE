import type { ComponentInfoType, ComponentsStateType } from './index'
export const getNextSelectedId = (fe_id: string, componentList: ComponentInfoType[]) => {
  const visibleComponentList = componentList.filter(item => !item.isHidden)
  const index = visibleComponentList.findIndex(item => item.fe_id === fe_id)
  if (index < 0) return ''
  if (visibleComponentList.length <= 1) return ''
  if (index + 1 === visibleComponentList.length) return visibleComponentList[index - 1].fe_id
  return visibleComponentList[index + 1].fe_id
}

export const insertNewComponent = (state: ComponentsStateType, newComponent: ComponentInfoType) => {
  if (state.selectedId) {
    const index = state.componentList.findIndex(item => item.fe_id === state.selectedId)
    state.componentList.splice(index + 1, 0, newComponent)
  } else {
    state.componentList.push(newComponent)
  }
  state.selectedId = newComponent.fe_id
}
