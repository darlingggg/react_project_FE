import { type FC, useEffect, useRef, useCallback } from 'react'
import style from './StarBack.module.scss'

class Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number

  constructor() {
    this.x = Math.random() * window.innerWidth
    this.y = Math.random() * window.innerHeight
    this.size = Math.random() * 2
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
  }

  move() {
    this.x += this.speedX
    this.y += this.speedY
    if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1
    if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = 'black'
    ctx.fill()
  }
}

const StarBack: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  const rafId = useRef<number>(0)

  const particles = useRef<Particle[]>([])
  const connect = useCallback(() => {
    if (!ctx.current) return
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const dx = particles.current[i].x - particles.current[j].x
        const dy = particles.current[i].y - particles.current[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          ctx.current.beginPath()
          ctx.current.strokeStyle = `rgba(0,0,0,${1 - dist / 120})`
          ctx.current.lineWidth = 0.5
          ctx.current.moveTo(particles.current[i].x, particles.current[i].y)
          ctx.current.lineTo(particles.current[j].x, particles.current[j].y)
          ctx.current.stroke()
        }
      }
    }
  }, [])

  const animate = useCallback(() => {
    if (!ctx.current) return
    ctx.current.clearRect(0, 0, window.innerWidth, window.innerHeight)

    for (const p of particles.current) {
      p.move()
      p.draw(ctx.current)
    }
    connect()
    rafId.current = window.requestAnimationFrame(animate)
  }, [connect])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.current = canvas.getContext('2d')
    if (!ctx.current) return
  }, [])

  useEffect(() => {
    // 初始化
    for (let i = 0; i < 80; i++) {
      particles.current.push(new Particle())
    }
    animate()

    // 清理
    return () => {
      window.cancelAnimationFrame(rafId.current)
    }
  }, [animate])
  return <canvas ref={canvasRef} className={style.canvas}></canvas>
}

export default StarBack
