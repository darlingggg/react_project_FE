import type { FC } from 'react'
import { useRef, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Button, Input, Tooltip, type InputRef, message, Popover } from 'antd'
import { LeftOutlined, CopyOutlined, QrcodeOutlined } from '@ant-design/icons'
import { QRCodeCanvas } from 'qrcode.react'
import styles from './StatHeader.module.scss'
import useGetPageInfo from '../../../hooks/useGetPageInfo'

const { Title } = Typography

const StatHeader: FC = () => {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const { title, isPublished } = useGetPageInfo()
  const urlInputRef = useRef<InputRef>(null)

  const copy = () => {
    const elem = urlInputRef.current
    if (!elem) return
    elem.select()
    document.execCommand('copy')
    message.success('复制成功')
  }
  // const genLinkAndQRCodeElem = () => {
  //   if (!isPublished) return null

  //   const url = `http://localhost:3000/question/${id}`

  //   const QRCodeElem = (
  //     <div style={{ textAlign: 'center' }}>
  //       <QRCodeCanvas value={url} size={150} />
  //     </div>
  //   )

  //   return (
  //     <>
  //       <Input value={url} style={{ width: '300px' }} ref={urlInputRef}></Input>
  //       <Tooltip title="复制链接">
  //         <Button icon={<CopyOutlined />} onClick={copy}></Button>
  //       </Tooltip>
  //       <Popover content={QRCodeElem}>
  //         <Button icon={<QrcodeOutlined />}></Button>
  //       </Popover>
  //     </>
  //   )
  // }

  // 使用useMemo 缓存，避免每次都生成二维码  useMemo的依赖项需要是不经常更新的 如果经常更新的话缓存也就不断失效 又需要重新生成
  const linkAndQRCodeElem = useMemo(() => {
    if (!isPublished) return null
    const url = `http://${window.location.hostname}:3500/question/${id}`
    const QRCodeElem = (
      <div style={{ textAlign: 'center' }}>
        <QRCodeCanvas value={url} size={150} />
      </div>
    )
    return (
      <>
        <Input value={url} style={{ width: '300px' }} ref={urlInputRef}></Input>
        <Tooltip title="复制链接">
          <Button icon={<CopyOutlined />} onClick={copy}></Button>
        </Tooltip>
        <Popover content={QRCodeElem}>
          <Button icon={<QrcodeOutlined />}></Button>
        </Popover>
      </>
    )
  }, [id, isPublished])

  return (
    <div className={styles['header-wrapper']}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Button type="link" icon={<LeftOutlined />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <Title>{title}</Title>
        </div>
        <div className={styles.main}>{linkAndQRCodeElem}</div>
        <div className={styles.right}>
          <Button type="primary" onClick={() => navigate(`/question/edit/${id}`)}>
            编辑问卷
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StatHeader
