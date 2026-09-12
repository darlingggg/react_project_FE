import type { FC } from 'react'
import { Tabs } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import ComponentLib from './ComponentLib'
import Layer from './Layer'

const LeftPanel: FC = () => {
  const tabsItems = [
    {
      key: 'componentLib',
      label: (
        <span>
          <AppstoreOutlined /> &nbsp; 组件库
        </span>
      ),
      children: <ComponentLib />,
    },
    {
      key: 'layers',
      label: (
        <span>
          <BarsOutlined /> &nbsp; 图层
        </span>
      ),
      children: <Layer />,
    },
  ]

  return <Tabs defaultActiveKey="componentLib" items={tabsItems} />
}

export default LeftPanel
