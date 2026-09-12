import { configureStore } from '@reduxjs/toolkit'
import undoable, { excludeAction, type StateWithHistory } from 'redux-undo'
import userReducer from './userReducer'
import componentsReducer, { type ComponentsStateType } from './componentsReducer'
import type { UserStateType } from './userReducer'
import pageInfoReducer, { type PageInfoType } from './pageInfoReducer'

export type StateType = {
  user: UserStateType
  components: StateWithHistory<ComponentsStateType> // 增加undo之后类型变化
  pageInfo: PageInfoType
}

export default configureStore({
  reducer: {
    // 分模块
    user: userReducer,
    // 无 undo 功能
    // components: componentsReducer,
    // 有 undo 功能
    components: undoable(componentsReducer, {
      limit: 10, // 最多 undo 10 步
      filter: excludeAction([
        'components/resetComponents',
        'components/changeSelectedId',
        'components/selectPrevComponent',
        'components/selectNextComponent',
      ]),
    }),
    pageInfo: pageInfoReducer,
  },
})
