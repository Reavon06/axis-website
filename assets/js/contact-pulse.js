/**
 * Desktop nav “Start a Project” on /contact — wiggle Email + WhatsApp intake buttons.
 */
const EVENT = 'axis-contact-intake-pulse'

export function initContactPulse() {
  const email = document.querySelector('[data-intake-email]')
  const whatsapp = document.querySelector('[data-intake-whatsapp]')
  if (!email && !whatsapp) return

  window.addEventListener(EVENT, () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    email?.classList.remove('intake-pulse-a')
    whatsapp?.classList.remove('intake-pulse-b')
    void email?.offsetWidth
    email?.classList.add('intake-pulse-a')
    whatsapp?.classList.add('intake-pulse-b')

    const cleanup = (el, cls) => {
      el?.addEventListener(
        'animationend',
        () => el.classList.remove(cls),
        { once: true },
      )
    }
    cleanup(email, 'intake-pulse-a')
    cleanup(whatsapp, 'intake-pulse-b')
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactPulse)
} else {
  initContactPulse()
}
