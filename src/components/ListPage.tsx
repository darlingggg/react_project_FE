import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Pagination } from 'antd'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'

type PropsType = {
  total: number
}
const ListPage: FC<PropsType> = props => {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    const page = Number(searchParams.get('page') || 1)
    setCurrent(page)
    const pageSize = Number(searchParams.get('pageSize') || 10)
    setPageSize(pageSize)
  }, [searchParams])
  const { total } = props
  const handlePageChange = (page: number, pageSize: number) => {
    searchParams.set('page', page.toString())
    searchParams.set('pageSize', pageSize.toString())
    navigate({
      pathname,
      search: searchParams.toString(),
    })
  }
  return (
    <Pagination
      total={total}
      current={current}
      pageSize={pageSize}
      onChange={(page, pageSize) => {
        handlePageChange(page, pageSize)
      }}
    ></Pagination>
  )
}

export default ListPage
