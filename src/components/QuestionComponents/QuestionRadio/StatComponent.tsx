import { useMemo, type FC } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { STAT_COLORS } from '../../../constant'
import type { QuestionRadioStatPropType } from './interface'

const StatComponent: FC<QuestionRadioStatPropType> = props => {
  const { stat = [] } = props
  const sum = useMemo(() => {
    let s = 0
    stat.forEach(i => {
      s += i.count
    })
    return s
  }, [stat])
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={stat}
          dataKey="count"
          nameKey="name"
          label={i => {
            const payload = i.payload
            return `${payload.name}: ${((payload.count / sum) * 100).toFixed(1)} %}`
          }}
          cx="50%"
          cy="50%"
          outerRadius={50}
          fill="#8884d8"
        >
          {stat.map((_, index: number) => (
            <Cell key={`${index}`} fill={STAT_COLORS[index % STAT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default StatComponent
