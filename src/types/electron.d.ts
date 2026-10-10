export {}

declare global {
  interface Window {
    desktop?: {
      notice: (message: string) => void
      minimizeWindow: () => void
      toggleDevTools: () => void
    }
  }
}
