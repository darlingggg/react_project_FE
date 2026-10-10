import { useEffect, useRef } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './App.css'
function App() {
  const menuRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (!window.desktop) return
    const closeMenu = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) menuRef.current?.removeAttribute('open')
    }
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') menuRef.current?.removeAttribute('open')
    }
    window.addEventListener('pointerdown', closeMenu)
    window.addEventListener('keydown', closeMenuOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeMenu)
      window.removeEventListener('keydown', closeMenuOnEscape)
    }
  }, [])

  return (
    <>
      {window.desktop && (
        <div className="desktop-titlebar">
          <div className="desktop-titlebar-drag" aria-hidden="true" />
          <details className="desktop-menu" ref={menuRef}>
            <summary>窗口</summary>
            <div className="desktop-menu-list">
              <button
                type="button"
                onClick={() => {
                  menuRef.current?.removeAttribute('open')
                  window.desktop?.minimizeWindow()
                }}
              >
                最小化
              </button>
              <button
                type="button"
                onClick={() => {
                  menuRef.current?.removeAttribute('open')
                  window.desktop?.toggleDevTools()
                }}
              >
                开发者工具
              </button>
            </div>
          </details>
        </div>
      )}

      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
