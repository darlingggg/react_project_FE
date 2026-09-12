import type { FC } from 'react'
import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import { Typography } from 'antd'
import { componentConfGroup, type ComponentConfType } from '../../../components/QuestionComponents'
import styles from './ComponentLib.module.scss'
import { useDispatch } from 'react-redux'
import { addComponent } from '../../../store/componentsReducer'

const { Title } = Typography
const GenComponent = (com: ComponentConfType) => {
  const dispatch = useDispatch()
  const { Component, title, type, defaultProps } = com

  const handleClick = useCallback(() => {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        type,
        title,
        props: defaultProps,
      })
    )
  }, [dispatch, type, title, defaultProps])
  // function handleClick() {
  //   dispatch(
  //     addComponent({
  //       fe_id: nanoid(),
  //       type,
  //       title,
  //       props: defaultProps,
  //     })
  //   )
  // }
  return (
    <div className={styles.wrapper} key={type} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  )
}
const ComponentLib: FC = () => {
  return (
    <>
      {componentConfGroup.map((group, index) => {
        return (
          <div key={index}>
            <Title level={3} style={{ fontSize: '18px', marginTop: index > 0 ? '20px' : '0' }}>
              {group.groupName}
            </Title>
            <div>
              {group.components.map(component => {
                return GenComponent(component)
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}
export default ComponentLib
