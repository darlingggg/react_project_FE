import type { FC } from 'react'
// import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './ManageLayout.module.scss'
import { Button, Space, Divider, message } from 'antd'
import { PlusOutlined, BarsOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { createQuestionService } from '../services/question'
import { useRequest } from 'ahooks'
import StarBack from '../components/StarBack'

const ManageLayout: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // const [loading, setLoading] = useState(false)
  // const handleCreate = async () => {
  //   setLoading(true)
  //   const data = await createQuestionService()
  //   const { id } = data
  //   if (id) {
  //     navigate(`/question/edit/${id}`)
  //     message.success('创建成功')
  //   }
  //   setLoading(false)
  // }
  const { loading, run: handleCreate } = useRequest(createQuestionService, {
    manual: true,
    onSuccess: result => {
      navigate(`/question/edit/${result.id || result._id}`)
      message.success('创建成功')
    },
  })
  return (
    <>
      <StarBack />
      <div className={styles.container}>
        <div className={styles.left}>
          <Space direction="vertical">
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreate} disabled={loading}>
              创建问卷
            </Button>
            <Divider style={{ borderColor: 'transparent' }} />
            <Button
              type={pathname.startsWith('/manage/list') ? 'default' : 'text'}
              size="large"
              icon={<BarsOutlined />}
              onClick={() => {
                navigate('/manage/list')
              }}
            >
              我的问卷
            </Button>
            <Button
              type={pathname.startsWith('/manage/star') ? 'default' : 'text'}
              size="large"
              icon={<StarOutlined />}
              onClick={() => {
                navigate('/manage/star')
              }}
            >
              星标问卷
            </Button>
            <Button
              type={pathname.startsWith('/manage/trash') ? 'default' : 'text'}
              size="large"
              icon={<DeleteOutlined />}
              onClick={() => {
                navigate('/manage/trash')
              }}
            >
              回收站
            </Button>
          </Space>
        </div>
        <div className={styles.right}>
          <Outlet />
        </div>
      </div>
    </>
  )
}
export default ManageLayout
