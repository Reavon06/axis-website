/**
 * Injects ambient dust particles into [data-dust-container] elements.
 */
export function initDust() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('[data-dust-container]').forEach((container) => {
    const count = Number(container.dataset.dustCount || 40)
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      span.style.left = `${Math.random() * 100}%`
      span.style.top = `${Math.random() * 100}%`
      const s = 0.3 + Math.random() * 1.5
      span.style.width = `${s}px`
      span.style.height = `${s}px`
      span.style.setProperty('--dust-dur', `${14 + Math.random() * 22}s`)
      span.style.setProperty('--dust-delay', `${Math.random() * 4}s`)
      container.appendChild(span)
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDust)
} else {
  initDust()
}
