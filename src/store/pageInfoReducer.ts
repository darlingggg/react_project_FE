import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type PageInfoType = {
  title: string
  desc?: string
  js?: string
  css?: string
  isPublished?: boolean
}

const init_state: PageInfoType = {
  title: '',
  desc: '',
  js: '',
  css: '',
}

const pageInfoSlice = createSlice({
  name: 'pageInfo',
  initialState: init_state,
  reducers: {
    resetPageInfo: (state: PageInfoType, action: PayloadAction<PageInfoType>) => {
      state.title = action.payload.title
      state.desc = action.payload.desc || ''
      state.js = action.payload.js || ''
      state.css = action.payload.css || ''
      state.isPublished = action.payload.isPublished || false
    },
    // 修改标题
    changePageTitle: (state: PageInfoType, action: PayloadAction<string>) => {
      state.title = action.payload
    },
  },
})
export const { resetPageInfo, changePageTitle } = pageInfoSlice.actions
export default pageInfoSlice.reducer
