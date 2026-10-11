import type { FC } from 'react'
import { useState } from 'react'
import { Typography, Spin, Table, Pagination, Button, message } from 'antd'
import { useRequest } from 'ahooks'
import { getQuestionStatListService } from '../../../services/stat'
import { useParams } from 'react-router-dom'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import { componentConfGroup } from '../../../components/QuestionComponents'

const { Title } = Typography

type PropsType = {
  selectedComponentId: string
  setSelectedComponentId: (id: string) => void
  setSelectedComponentType: (type: string) => void
}
const PageStat: FC<PropsType> = props => {
  const { id = '' } = useParams()
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { selectedComponentId, setSelectedComponentId, setSelectedComponentType } = props
  const data: string[][] = []
  const header = new Map()

  const { loading } = useRequest(
    async () => {
      const res = await getQuestionStatListService(id, { page, pageSize })
      return res
    },
    {
      refreshDeps: [page, pageSize],
      onSuccess(res) {
        const { total = 0, list = [] } = res
        console.log('list', list)
        setTotal(total)
        setList(list)
      },
    }
  )

  const needFilter = componentConfGroup[0].components.map(c => c.type)

  let { componentList } = useGetComponentInfo()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSource = list.map((item: any) => ({ ...item, key: item._id }))
  componentList = componentList.filter(c => !needFilter.includes(c.type))
  const columns = componentList.map(c => {
    const { fe_id, title, props = {}, type } = c
    const colTitle = props.title || title
    header.set(fe_id, colTitle)
    return {
      width: 160,
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedComponentId(fe_id)
            setSelectedComponentType(type)
          }}
        >
          <span style={{ color: fe_id === selectedComponentId ? '#1890ff' : 'unset' }}>{colTitle}</span>
        </div>
      ),
      dataIndex: fe_id,
    }
  })

  // 导出数据
  const exportData = async () => {
    if (header.size === 0) {
      message.error('当前没有可以导出的数据')
      return
    }
    const keyToIndex = new Map(Array.from(header).map((h, index) => [h[0], index]))
    console.log('keyToIndex', keyToIndex)
    list.forEach(item => {
      const array = new Array(header.size).fill('')
      Object.entries(item).forEach(([key, value]) => {
        const index = keyToIndex.get(key) ?? -1
        if (index < 0) return
        array[index] = value
      })
      data.push(array)
    })
    data.unshift(Array.from(header.values()))
    if (data.length < 2) {
      message.error('当前没有可以导出的数据')
      return
    }
    if (await window.desktop?.exportCSV(data)) {
      message.success('数据导出成功')
    } else {
      message.error('数据导出失败')
    }
  }

  const TableElem = (
    <>
      <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 'max-content' }}></Table>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        {total > 0 && (
          <Pagination
            total={total}
            pageSize={pageSize}
            current={page}
            onChange={page => setPage(page)}
            onShowSizeChange={(page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            }}
          />
        )}
      </div>
    </>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Title level={3} style={{ margin: '0px' }}>
          答卷数量：{!loading && total}
        </Title>
        {window.desktop && (
          <Button type="default" onClick={exportData}>
            导出数据
          </Button>
        )}
      </div>
      {loading && (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      )}
      {!loading && TableElem}
    </div>
  )
}
export default PageStat
