import { useEffect, useState, type FC } from 'react'
import { Tabs } from 'antd'
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import ComponentProp from './ComponentProp'
import PageSetting from './PageSetting'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'

const RightPanel: FC = () => {
  const [activeKey, setActiveKey] = useState('prop')
  const { selectedId } = useGetComponentInfo()
  useEffect(() => {
    if (selectedId) setActiveKey('prop')
    else setActiveKey('setting')
  }, [selectedId])
  const handleChange = (key: string) => {
    setActiveKey(key)
  }
  const tabsItems = [
    {
      key: 'prop',
      label: (
        <span>
          <FileTextOutlined /> &nbsp; 属性
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: 'setting',
      label: (
        <span>
          <SettingOutlined /> &nbsp; 设置
        </span>
      ),
      children: <PageSetting />,
    },
  ]
  return <Tabs activeKey={activeKey} items={tabsItems} onChange={key => handleChange(key)}></Tabs>
}
export default RightPanel
