import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ManageLayout from '../layouts/ManageLayout'
import QuestionLayout from '../layouts/QuestionLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import List from '../pages/manage/List'
import Trash from '../pages/manage/Trash'
import Star from '../pages/manage/Star'
// import Edit from '../pages/question/Edit'
// import Stat from '../pages/question/Statistic'

const Edit = lazy(() => import('../pages/question/Edit'))
const Stat = lazy(() => import('../pages/question/Statistic'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login', // 注意这里的路径是相对于父路由的路径 加不加 / 都是可以的(因为父路由是 / 如果不是的化要不不加/ 要不加完整路径)
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: 'manage',
        element: <ManageLayout />,
        children: [
          {
            path: 'list', // 这里只能为 list 不能 /list 因为父路由已经是 /manage 了 如果要加 / 就要写成 /manage/list
            element: <List />,
          },
          {
            path: 'trash',
            element: <Trash />,
          },
          {
            path: 'star',
            element: <Star />,
          },
        ],
      },
    ],
  },
  {
    path: '/question',
    element: <QuestionLayout />,
    children: [
      {
        path: 'edit/:id',
        element: <Edit />,
      },
      {
        path: 'stat/:id',
        element: <Stat />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router

// 常用路由
export const LOGIN_PATH = '/login'
export const REGISTER_PATH = '/register'
export const MANAGE_LIST_PATH = '/manage/list'
