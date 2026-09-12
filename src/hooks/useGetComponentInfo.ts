import { useSelector } from 'react-redux'
import type { StateType } from '../store'
import type { ComponentsStateType } from '../store/componentsReducer'

const useGetComponentInfo = () => {
  const { componentList = [], selectedId = '', copiedComponent } = useSelector<StateType>(state => state.components.present) as ComponentsStateType
  const selectedComponent = componentList.find(c => c.fe_id === selectedId)
  return { componentList, selectedId, selectedComponent, copiedComponent }
}
export default useGetComponentInfo
