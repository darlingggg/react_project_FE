import type { FC } from 'react'
import { useDispatch } from 'react-redux'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import { getComponentConfByType, type ComponentPropsType } from '../../../components/QuestionComponents'
import { changeComponentProps } from '../../../store/componentsReducer'

const NoProp: FC = () => {
  return <div style={{ textAlign: 'center' }}>没有选中的组件</div>
}

const ComponentProp: FC = () => {
  const dispatch = useDispatch()
  const { selectedComponent } = useGetComponentInfo()
  if (!selectedComponent) return <NoProp />

  const { type, props, isLocked } = selectedComponent
  const ComponentConf = getComponentConfByType(type)
  if (!ComponentConf) return <NoProp />

  const changeProps = (newProps: ComponentPropsType) => {
    const { fe_id } = selectedComponent
    dispatch(changeComponentProps({ fe_id, newProps }))
  }

  const { PropComponent } = ComponentConf
  return <PropComponent {...props} onChange={changeProps} disabled={isLocked} />
}
export default ComponentProp
