import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Input } from 'antd'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { LIST_SEARCH_PARAM_KEY } from '../constant'

const { Search } = Input
const ListSearch: FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [value, setValue] = useState('')
  useEffect(() => {
    setValue(searchParams.get(LIST_SEARCH_PARAM_KEY) || '')
  }, [searchParams])
  const handleSearch = (value: string) => {
    console.log(pathname)
    if (value !== '') {
      navigate({
        pathname,
        search: `${LIST_SEARCH_PARAM_KEY}=${value}`,
      }) // 也可以替换成 navigate(`${pathname}?keyword=${value}`)
    } else {
      navigate(pathname)
    }
  }
  return (
    <>
      <Search
        placeholder="输入关键字"
        size="large"
        onSearch={handleSearch}
        style={{ width: '260px' }}
        value={value}
        onChange={e => setValue(e.target.value)}
        allowClear
      ></Search>
    </>
  )
}
export default ListSearch
