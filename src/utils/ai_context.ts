export const convertAIString = (str: string) => {
  let result
  try {
    result = JSON.parse(str) // 解析外层
    if (!result.componentList) return result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.componentList = result.componentList.map((item: any) => {
      if (typeof item.props === 'string') {
        try {
          item.props = JSON.parse(item.props) // 把 props 字符串再解析为对象
        } catch {
          // 若 props 不是合法 JSON 字符串，则保持原样
        }
      }
      return item
    })
  } catch {
    // 忽略错误
  }
  return result
}
