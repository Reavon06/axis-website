/** Mirrors Framer `useReducedMotion` — toggles .reduce-motion on <html>. */
export function initReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  const apply = () => {
    document.documentElement.classList.toggle('reduce-motion', mq.matches)
  }
  apply()
  mq.addEventListener('change', apply)
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
