import type { FC } from 'react'
import { useState } from 'react'
import { Typography, Spin, Table, Pagination } from 'antd'
import { useRequest } from 'ahooks'
import { getQuestionStatListService } from '../../../services/stat'
import { useParams } from 'react-router-dom'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'

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

  const { componentList } = useGetComponentInfo()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSource = list.map((item: any) => ({ ...item, key: item._id }))
  const columns = componentList.map(c => {
    const { fe_id, title, props = {}, type } = c
    const colTitle = props.title || title
    return {
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

  const TableElem = (
    <>
      <Table columns={columns} dataSource={dataSource} pagination={false}></Table>
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
      <Title level={3}>答卷数量：{!loading && total}</Title>
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
