/**
 * Floating navbar — scroll glass state, mobile drawer, Escape, resize, contact pulse CTA.
 */
const CONTACT_INTAKE_PULSE_EVENT = 'axis-contact-intake-pulse'

export function initNav() {
  const header = document.querySelector('[data-site-nav]')
  if (!header) return

  const pill = header.querySelector('[data-nav-pill]')
  const toggle = header.querySelector('[data-nav-toggle]')
  const panel = document.getElementById('mobile-nav')
  const backdrop = document.querySelector('[data-nav-backdrop]')
  const hamburger = header.querySelector('.hamburger')
  const ctaDesktop = header.querySelector('[data-nav-cta-desktop]')

  let open = false

  const setScrolled = () => {
    if (!pill) return
    const scrolled = window.scrollY > 12
    pill.classList.toggle('glass', scrolled)
    pill.classList.toggle('shadow-lift', scrolled)
    pill.classList.toggle('shadow-glow-sm', scrolled)
    pill.classList.toggle('border-transparent', scrolled)
    pill.classList.toggle('bg-white/[0.58]', scrolled)
    pill.classList.toggle('bg-white/45', !scrolled)
    pill.classList.toggle('shadow-sm', !scrolled)
  }

  const closeMenu = () => {
    if (!open) return
    open = false
    toggle?.setAttribute('aria-expanded', 'false')
    panel?.classList.remove('is-open')
    backdrop?.classList.remove('is-open')
    hamburger?.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  const openMenu = () => {
    open = true
    toggle?.setAttribute('aria-expanded', 'true')
    panel?.classList.add('is-open')
    backdrop?.classList.add('is-open')
    hamburger?.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  toggle?.addEventListener('click', () => (open ? closeMenu() : openMenu()))
  backdrop?.addEventListener('click', closeMenu)
  panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu))

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })

  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) closeMenu()
  })

  window.addEventListener('scroll', setScrolled, { passive: true })
  setScrolled()

  ctaDesktop?.addEventListener('click', (e) => {
    if (!window.matchMedia('(min-width: 768px)').matches) return
    const path = window.location.pathname.replace(/\/$/, '') || '/'
    if (path === '/contact' || path.endsWith('/contact')) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent(CONTACT_INTAKE_PULSE_EVENT))
    }
  })
}
