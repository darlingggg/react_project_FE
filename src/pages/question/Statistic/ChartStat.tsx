import { useEffect, useState, type FC } from 'react'
import { Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { getComponentStatService } from '../../../services/stat'
import { getComponentConfByType } from '../../../components/QuestionComponents'

const { Title } = Typography
type PropsType = {
  selectedComponentId: string
  selectedComponentType: string
}
const PageStat: FC<PropsType> = props => {
  const { selectedComponentId, selectedComponentType } = props
  const { id = '' } = useParams()
  const [stat, setStat] = useState([])
  const { run } = useRequest(async (questionId, componentId) => await getComponentStatService(questionId, componentId), {
    manual: true,
    onSuccess(res) {
      setStat(res.stat)
    },
  })

  useEffect(() => {
    run(id, selectedComponentId)
  }, [selectedComponentId, id, run])

  const genStatElem = () => {
    if (!selectedComponentId) return <div>未选中组件</div>
    console.log(stat)
    const { StatComponent } = getComponentConfByType(selectedComponentType) || {}
    if (!StatComponent) return <div>该组件无统计图表</div>
    return <StatComponent stat={stat} />
  }

  return (
    <>
      <Title level={3}>图表统计</Title>
      <div>{genStatElem()}</div>
    </>
  )
}

export default PageStat
