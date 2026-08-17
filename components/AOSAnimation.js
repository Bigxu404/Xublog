import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 加载滚动动画
 * 改从外部CDN读取
 * https://michalsnik.github.io/aos/
 *
 * 注意：init 使用了 disableMutationObserver，客户端路由切换后
 * 必须 refresh，否则新挂载的 [data-aos] 会一直停在 opacity:0。
 */
export default function AOSAnimation() {
  const router = useRouter()

  useEffect(() => {
    let idleId
    let timeoutId
    let cancelled = false

    const prefersReducedMotion = () =>
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const refreshAOS = () => {
      if (cancelled || prefersReducedMotion()) return
      if (window.AOS) {
        window.AOS.refreshHard()
      }
    }

    const initAOS = () => {
      if (cancelled || prefersReducedMotion()) return

      Promise.all([
        loadExternalResource('/js/aos.js', 'js'),
        loadExternalResource('/css/aos.css', 'css')
      ]).then(() => {
        if (cancelled || !window.AOS) return
        window.AOS.init({
          disableMutationObserver: true,
          debounceDelay: 100,
          throttleDelay: 120,
          once: true
        })
        // 初始化时若已完成一次路由切换，补一次扫描
        refreshAOS()
      })
    }

    if (window.requestIdleCallback) {
      idleId = window.requestIdleCallback(initAOS, { timeout: 3000 })
    } else {
      timeoutId = window.setTimeout(initAOS, 2000)
    }

    router.events.on('routeChangeComplete', refreshAOS)
    return () => {
      cancelled = true
      router.events.off('routeChangeComplete', refreshAOS)
      if (idleId && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [router.events])

  return null
}
