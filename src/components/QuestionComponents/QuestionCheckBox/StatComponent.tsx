import type { FC } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { QuestionCheckboxStatPropsType } from './interface'

const StatComponent: FC<QuestionCheckboxStatPropsType> = props => {
  const { stat = [] } = props
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={stat} width={400} height={300} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default StatComponent
