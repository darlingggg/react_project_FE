import type { ChangeEvent, FC } from 'react'
import { useState, useRef } from 'react'
import { Button, Input, message, Typography, Modal, Form, Radio, InputNumber } from 'antd'
import { useDispatch } from 'react-redux'
import { useRequest, useKeyPress, useDebounceEffect } from 'ahooks'
import { nanoid } from 'nanoid'
import styles from './EditHeader.module.scss'
import { LeftOutlined, EditOutlined, LoadingOutlined, RobotOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import EditToolbar from './EditToolBar'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import { changePageTitle, resetPageInfo } from '../../../store/pageInfoReducer'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import { updateQuestionService } from '../../../services/question'
import { convertAIString } from '../../../utils/ai_context'
import { type ComponentInfoType } from '../../../store/componentsReducer'
import { resetComponents } from '../../../store/componentsReducer'
import { baseURL } from '../../../services/axios'

const { Title } = Typography

interface AiContent {
  title: string
  desc: string
  componentList: Array<ComponentInfoType>
}

// 显示与修改标题
const TitleElem: FC = () => {
  const dispatch = useDispatch()
  const { title } = useGetPageInfo()
  const [editState, setEditState] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim()
    if (!newTitle) return
    dispatch(changePageTitle(newTitle))
  }
  if (editState) {
    return <Input value={title} autoFocus onBlur={() => setEditState(false)} onPressEnter={() => setEditState(false)} onChange={handleChange} />
  }
  return (
    <>
      <Title level={5} style={{ margin: '0' }}>
        {title}
      </Title>
      <Button icon={<EditOutlined />} type="text" shape="circle" onClick={() => setEditState(true)} />
    </>
  )
}

// 保存按钮
const SaveButton: FC = () => {
  const { id } = useParams() // 获取路由上的问卷id
  const { componentList } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()

  const { loading, run: save } = useRequest(
    async () => {
      return await updateQuestionService(id!, { componentList, ...pageInfo })
    },
    { manual: true }
  )

  // 快捷键
  useKeyPress(['ctrl.s', 'meta.s'], (event: KeyboardEvent) => {
    event.preventDefault() // 阻止默认的网页保存
    if (!loading) save()
  })

  // 自动保存 使用ahooks中的useDebounceEffect既有useEffect的功能还能防抖(多次点击只进行最后一次)
  useDebounceEffect(
    () => {
      if (!loading) save()
    },
    [componentList, pageInfo],
    { wait: 2000 }
  )

  return (
    <Button disabled={loading} icon={loading ? <LoadingOutlined /> : null} onClick={save}>
      保存
    </Button>
  )
}

// 发布按钮
const PublishButton: FC = () => {
  const nav = useNavigate()
  const { id } = useParams() // 获取路由上的问卷id
  const { componentList } = useGetComponentInfo()
  const pageInfo = useGetPageInfo()

  const { loading, run: pub } = useRequest(
    async () => {
      return await updateQuestionService(id!, { componentList, ...pageInfo, isPublished: true })
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('发布成功')
        nav(`/question/stat/${id}`)
      },
    }
  )

  return (
    <Button type="primary" loading={loading} onClick={pub}>
      发布
    </Button>
  )
}

// AI 按钮
// 替换现有的 AIButton 组件
const AIButton: FC = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const aiContentRef = useRef('')
  const firstGet = useRef(true)
  const handleAI = (params: { topic: string; language: string; count: number; requirements: string }) => {
    setLoading(true)
    aiContentRef.current = ''
    let hasLine = false
    let lastResult = {}
    // 使用 EventSource 处理 SSE
    const eventSource = new EventSource(`${baseURL}/api/openai?prompt=` + encodeURIComponent(JSON.stringify(params)))

    eventSource.onmessage = event => {
      let selectedId = ''
      const compareStr = hasLine ? '}"}' : '}}'
      aiContentRef.current += String(JSON.parse(event.data).data.content)
      console.log(aiContentRef.current)
      if (aiContentRef.current.includes('"componentList"') && firstGet.current) {
        firstGet.current = false
        const index = aiContentRef.current.indexOf('"componentList"')
        const { title, desc } = convertAIString(aiContentRef.current.slice(0, index - 1) + '}') as AiContent
        dispatch(resetPageInfo({ title, desc }))
        aiContentRef.current = '{' + aiContentRef.current.slice(index)
      }
      if (!firstGet.current) {
        if (aiContentRef.current.includes('\\')) hasLine = true
        if (aiContentRef.current.endsWith('"}"}]}') || aiContentRef.current.endsWith('"}}]}')) {
          const { componentList } = convertAIString(aiContentRef.current) as AiContent
          componentList.forEach((item, index) => {
            item.fe_id = nanoid()
            if (index === 0) selectedId = item.fe_id
          })
          dispatch(resetComponents({ selectedId, componentList, copiedComponent: null }))
        }
        const index = aiContentRef.current.lastIndexOf(compareStr)
        if (index !== -1) {
          const result = convertAIString(aiContentRef.current.slice(0, index) + compareStr + ']}') as AiContent
          if (result && JSON.stringify(result) !== JSON.stringify(lastResult)) {
            lastResult = JSON.parse(JSON.stringify(result))
            result.componentList.forEach((item, index) => {
              item.fe_id = nanoid()
              if (index === 0) selectedId = item.fe_id
            })
            dispatch(resetComponents({ selectedId, componentList: result.componentList, copiedComponent: null }))
          }
        }
      }
    }
    eventSource.onerror = () => {
      eventSource.close()
      setLoading(false)
    }
  }

  const onConfirm = async () => {
    try {
      await form.validateFields()
    } catch {
      return
    }
    const values = form.getFieldsValue()
    handleAI(values)
    message.success('开始生成...')
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        title="AI 生成配置清单"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="确认生成"
        cancelText="取消"
        onOk={onConfirm}
      >
        <Form initialValues={{ topic: '', language: '中文', count: 5, requirements: '' }} form={form} labelCol={{ span: 5 }} labelAlign="left">
          <Form.Item label="主题" name="topic" rules={[{ required: true, message: '主题不能为空' }]}>
            <Input placeholder="请输入主题" />
          </Form.Item>
          <Form.Item label="语言" name="language" rules={[{ required: true }]}>
            <Radio.Group
              options={[
                { value: '中文', label: '中文' },
                { value: 'English', label: 'English' },
              ]}
            ></Radio.Group>
          </Form.Item>
          <Form.Item label="题目数量" name="count" rules={[{ required: true, message: '题目数量不能为空' }]}>
            <InputNumber min={3} max={30} />
          </Form.Item>
          <Form.Item label="补充要求" name="requirements">
            <Input.TextArea placeholder="请输入要求" autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
      <Button icon={<RobotOutlined />} loading={loading} onClick={() => setIsModalVisible(true)}>
        AI 生成
      </Button>
    </>
  )
}
const EditHeader: FC = () => {
  const navigate = useNavigate()
  return (
    <div className={styles['header-wrapper']}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Button type="link" icon={<LeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <TitleElem></TitleElem>
        </div>
        <div className={styles.main}>
          <EditToolbar />
        </div>
        <div className={styles.right}>
          <SaveButton />
          <AIButton />
          <PublishButton />
        </div>
      </div>
    </div>
  )
}
export default EditHeader
