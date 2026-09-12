import type { FC } from 'react'
import { useState } from 'react'
import { Button, Divider, Tag, Popconfirm, Modal, message } from 'antd'
import { EditOutlined, LineChartOutlined, StarOutlined, CopyOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import styles from './QuestionCard.module.scss'
import { useNavigate, Link } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { updateQuestionService, duplicateQuestionService } from '../services/question'

type QuestionCardProps = {
  _id: string
  title: string
  isPublished: boolean
  isStar: boolean
  answerCount: number
  createAt: string
}
const { confirm } = Modal
const QuestionCard: FC<QuestionCardProps> = props => {
  const { _id, title, isPublished, answerCount, createAt, isStar } = props

  // 修改标星
  const [isStarState, setIsStarState] = useState(isStar)
  const { loading: changeStarLoading, run: changeStar } = useRequest(
    async () => {
      await updateQuestionService(_id, { isStar: !isStarState })
    },
    {
      manual: true,
      onSuccess: () => {
        setIsStarState(!isStarState)
        message.success(`成功${isStarState ? '取消' : ''}标星`)
      },
    }
  )

  const navigate = useNavigate()

  // 复制
  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      const data = await duplicateQuestionService(_id)
      return data
    },
    {
      manual: true,
      onSuccess: result => {
        message.success('复制成功')
        navigate(`/question/edit/${result.id || result._id}`)
      },
    }
  )

  // 删除
  const [isDeleted, setIsDeleted] = useState(false)
  const del = () => {
    confirm({
      title: '确定删除该问卷吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        deleteQuestion()
      },
    })
  }
  const { loading: deletedLoading, run: deleteQuestion } = useRequest(
    async () => {
      const res = await updateQuestionService(_id, { isDeleted: true })
      return res
    },
    {
      manual: true,
      onSuccess: () => {
        setIsDeleted(true)
        message.success('删除成功')
      },
    }
  )

  // 已经删除的卡片就不再渲染了
  if (isDeleted) return null
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.left}>
          <Link to={isPublished ? `/question/stat/${_id}` : `/question/edit/${_id}`}>
            {isStarState && <StarOutlined style={{ color: 'red' }} />}
            {title}
          </Link>
        </div>
        <div className={styles.right}>
          {isPublished ? <Tag color="processing">已发布</Tag> : <Tag color="error">未发布</Tag>}
          <span>答卷：{answerCount}</span>
          <span>{createAt}</span>
        </div>
      </div>
      <Divider style={{ margin: '12px 0' }} />
      <div className={styles['button-container']}>
        <div className={styles.left}>
          <Button
            icon={<EditOutlined />}
            type="text"
            size="small"
            onClick={() => {
              navigate(`/question/edit/${_id}`)
            }}
          >
            编辑问卷
          </Button>
          <Button
            icon={<LineChartOutlined />}
            type="text"
            size="small"
            onClick={() => {
              navigate(`/question/stat/${_id}`)
            }}
            disabled={!isPublished}
          >
            数据统计
          </Button>
        </div>
        <div className={styles.right}>
          <Button icon={<StarOutlined />} type="text" size="small" onClick={changeStar} disabled={changeStarLoading}>
            {isStarState ? '取消星标' : '标星'}
          </Button>
          <Button icon={<EditOutlined />} type="text" size="small">
            发布
          </Button>
          <Popconfirm title="确定要复制吗？" okText="确定" cancelText="取消" onConfirm={duplicate} disabled={duplicateLoading}>
            <Button icon={<CopyOutlined />} type="text" size="small">
              复制
            </Button>
          </Popconfirm>
          <Button icon={<DeleteOutlined />} type="text" size="small" onClick={del} disabled={deletedLoading}>
            删除
          </Button>
        </div>
      </div>
    </div>
  )
}
export default QuestionCard
