import type { FC } from 'react'
import { useState } from 'react'
import styles from './common.module.scss'
import { Typography, Empty, Table, Tag, Button, Modal, Spin, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useTitle, useRequest } from 'ahooks'
import ListSearch from '../../components/ListSearch'
import useLoadQuestionListData from '../../hooks/useLoadQuestionListData'
import ListPage from '../../components/ListPage'
import { updateQuestionService, deleteQuestionService } from '../../services/question'

const { Title } = Typography
const { confirm } = Modal
const tableColumns = [
  { title: '标题', dataIndex: 'title', key: 'title' }, // key 是循环列的key 会默认取dataIndex的值(可以省略)
  {
    title: '状态',
    dataIndex: 'isPublished', // dataIndex 当前列对应的数据源字段
    render: (isPublished: boolean) => {
      return isPublished ? <Tag color="processing">已发布</Tag> : <Tag color="error">未发布</Tag>
    }, // render 就是根据数据源返回自定义的jsx
  },
  { title: '答卷数', dataIndex: 'answerCount' },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: (time: Date) => {
      if (!time) return '未设置时间'
      return new Date(time).toLocaleString()
    },
  },
]
const Trash: FC = () => {
  useTitle('问卷 - 回收站')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { data = {}, loading, refresh } = useLoadQuestionListData({ isDeleted: true })
  const { list = [], total } = data
  console.log(list, 'list')

  // 恢复
  const { run: recover } = useRequest(
    async () => {
      for await (const id of selectedIds) {
        await updateQuestionService(id, { isDeleted: false })
      }
    },
    {
      manual: true,
      debounceWait: 500, // 防抖 只使用最后一次
      onSuccess: () => {
        message.success('恢复成功')
        refresh()
        setSelectedIds([])
      },
    }
  )

  // 删除
  const { run: deleteQuestions } = useRequest(async () => await deleteQuestionService(selectedIds), {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      refresh()
      setSelectedIds([])
    },
  })
  const del = () => {
    confirm({
      title: '确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将删除该问卷，且无法恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteQuestions()
      },
    })
  }
  const TableElement = (
    <>
      <div className={styles.buttons}>
        <Button type="primary" disabled={selectedIds.length === 0} onClick={recover}>
          恢复
        </Button>
        <Button danger disabled={selectedIds.length === 0} onClick={del}>
          彻底删除
        </Button>
      </div>
      <Table
        dataSource={list}
        columns={tableColumns}
        pagination={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowKey={(q: any) => q._id}
        rowSelection={{
          type: 'checkbox',
          onChange: selectedRowKeys => {
            console.log('selectedRowKeys:', selectedRowKeys)
            setSelectedIds(selectedRowKeys as string[])
          },
        }}
      />
    </>
  )
  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={styles.right}>
          <ListSearch></ListSearch>
        </div>
      </div>
      <div className={styles.content}>
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin></Spin>
          </div>
        )}
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {/* Table会默认找源数据的key值作为key，当没有的时候就不会设置了，会报warning rowKey是一个函数 指定源数据的什么字段作为key值  */}
        {!loading && list.length > 0 && TableElement}
      </div>
      {list.length !== 0 && (
        <div className={styles.footer}>
          <ListPage total={total} />
        </div>
      )}
    </>
  )
}
export default Trash
