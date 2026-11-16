/**
 * AXIS-3D static site — single script, no ES modules (works from file:// and double-click).
 */
(function () {
  'use strict'

  const CONTACT_INTAKE_PULSE_EVENT = 'axis-contact-intake-pulse'
  const WA_MESSAGE =
    'Hello Axis-3D Lab, I would like to discuss a fabrication / 3D printing project.'
  const PHONE_DIGITS = '916383860114'
  const WHATSAPP_CONSUMER_PACKAGE = 'com.whatsapp'

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function initReducedMotion() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => document.documentElement.classList.toggle('reduce-motion', mq.matches)
    apply()
    mq.addEventListener('change', apply)
  }

  function contactWhatsAppHref() {
    const text = encodeURIComponent(WA_MESSAGE)
    const waWeb = `https://wa.me/${PHONE_DIGITS}?text=${text}`
    if (/Android/i.test(navigator.userAgent)) {
      const fallback = encodeURIComponent(waWeb)
      return `intent://send?phone=${PHONE_DIGITS}&text=${text}#Intent;scheme=whatsapp;package=${WHATSAPP_CONSUMER_PACKAGE};S.browser_fallback_url=${fallback};end`
    }
    return waWeb
  }

  function applyWhatsAppLinks() {
    const href = contactWhatsAppHref()
    const isAndroid = /Android/i.test(navigator.userAgent)
    document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
      el.setAttribute('href', href)
      if (isAndroid) el.removeAttribute('target')
      else {
        el.setAttribute('target', '_blank')
        el.setAttribute('rel', 'noopener noreferrer')
      }
    })
  }

  function initNav() {
    const header = document.querySelector('[data-site-nav]')
    if (!header) return

    const pill = header.querySelector('[data-nav-pill]')
    const toggles = document.querySelectorAll('[data-nav-toggle]')
    const panel = document.getElementById('mobile-nav')
    const backdrop = document.querySelector('[data-nav-backdrop]')
    const hamburger = header.querySelector('.hamburger')
    const ctaDesktop = header.querySelector('[data-nav-cta-desktop]')

    let open = false

    const closeMenu = () => {
      if (!open) return
      open = false
      toggles.forEach((t) => t.setAttribute('aria-expanded', 'false'))
      panel?.classList.remove('is-open')
      backdrop?.classList.remove('is-open')
      hamburger?.classList.remove('is-open')
      document.body.style.overflow = ''
    }

    const openMenu = () => {
      open = true
      toggles.forEach((t) => t.setAttribute('aria-expanded', 'true'))
      panel?.classList.add('is-open')
      backdrop?.classList.add('is-open')
      hamburger?.classList.add('is-open')
      document.body.style.overflow = 'hidden'
    }

    toggles.forEach((toggle) => {
      toggle.addEventListener('click', () => (open ? closeMenu() : openMenu()))
    })
    backdrop?.addEventListener('click', closeMenu)
    panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu))

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu()
    })
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
      if (e.matches) closeMenu()
    })

    if (header) {
      header.style.opacity = '1'
      header.style.transform = 'translateZ(0)'
      header.style.visibility = 'visible'
    }
    if (pill) {
      pill.style.opacity = '1'
      pill.style.transform = 'none'
      pill.style.visibility = 'visible'
    }

    ctaDesktop?.addEventListener('click', (e) => {
      if (!window.matchMedia('(min-width: 768px)').matches) return
      const path = (window.location.pathname || '').replace(/\\/g, '/').replace(/\/$/, '') || '/'
      const onContact = /contact(\/index\.html)?$/i.test(path) || path.endsWith('/contact')
      if (onContact) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent(CONTACT_INTAKE_PULSE_EVENT))
      }
    })

    initNavIndicator(header)
  }

  let resetNavIndicatorState = null

  function resolveNavHref(href) {
    try {
      return new URL(href, window.location.href)
    } catch {
      return null
    }
  }

  function isSameNavPage(href) {
    const target = resolveNavHref(href)
    if (!target) return false
    const here = new URL(window.location.href)
    return target.href.split('#')[0] === here.href.split('#')[0]
  }

  function initNavIndicator(header) {
    const list = header.querySelector('[data-nav-links]')
    const indicator = header.querySelector('[data-nav-indicator]')
    if (!list || !indicator) return

    const mdUp = () => window.matchMedia('(min-width: 768px)').matches
    const links = () => [...list.querySelectorAll('[data-nav-link]')]

    const activeLink = () =>
      list.querySelector('[data-nav-link][aria-current="page"]') ||
      links().find((el) => {
        const href = el.getAttribute('href')
        return href && !el.hasAttribute('data-nav-external') && isSameNavPage(href)
      }) ||
      links()[0]

    const liquidEase =
      'left 0.38s cubic-bezier(0.22, 1.18, 0.36, 1), top 0.38s cubic-bezier(0.22, 1.18, 0.36, 1), width 0.38s cubic-bezier(0.22, 1.18, 0.36, 1), height 0.38s cubic-bezier(0.22, 1.18, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease'
    const hoverEase =
      'left 0.32s cubic-bezier(0.22, 1.12, 0.36, 1), top 0.32s cubic-bezier(0.22, 1.12, 0.36, 1), width 0.32s cubic-bezier(0.22, 1.12, 0.36, 1), height 0.32s cubic-bezier(0.22, 1.12, 0.36, 1)'

    let isNavigating = false

    function placeOn(link, { animate = false, gliding = false } = {}) {
      if (!link || !mdUp()) {
        indicator.classList.remove('is-ready', 'is-gliding')
        return
      }

      const listRect = list.getBoundingClientRect()
      const linkRect = link.getBoundingClientRect()
      const useMotion = animate && !prefersReducedMotion()

      indicator.classList.toggle('is-gliding', gliding)
      indicator.style.transition = useMotion ? (gliding ? liquidEase : hoverEase) : 'none'
      indicator.style.left = `${linkRect.left - listRect.left}px`
      indicator.style.top = `${linkRect.top - listRect.top}px`
      indicator.style.width = `${linkRect.width}px`
      indicator.style.height = `${linkRect.height}px`
      indicator.classList.add('is-ready')

      if (!useMotion) {
        void indicator.offsetWidth
        indicator.style.transition = prefersReducedMotion() ? 'none' : liquidEase
      }
    }

    function setLabelActive(link) {
      links().forEach((el) => {
        const on = el === link
        el.classList.toggle('nav-link-active', on)
        if (el.hasAttribute('data-nav-external')) return
        if (on) el.setAttribute('aria-current', 'page')
        else el.removeAttribute('aria-current')
      })
    }

    function restoreLabels() {
      const current = activeLink()
      links().forEach((el) => {
        const on = el === current
        el.classList.toggle('nav-link-active', on)
        if (on) el.setAttribute('aria-current', 'page')
        else el.removeAttribute('aria-current')
      })
    }

    function syncToActive(instant) {
      const current = activeLink()
      placeOn(current, { animate: !instant, gliding: false })
    }

    syncToActive(true)

    links().forEach((link) => {
      link.addEventListener('click', (e) => {
        if (!mdUp()) return
        const href = link.getAttribute('href')
        const external = link.hasAttribute('data-nav-external')

        if (external) {
          placeOn(link, { animate: !prefersReducedMotion(), gliding: true })
          window.setTimeout(() => {
            restoreLabels()
            syncToActive(false)
          }, 420)
          return
        }

        if (!href || isSameNavPage(href)) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
          return
        }

        e.preventDefault()
        if (isNavigating) return
        isNavigating = true

        setLabelActive(link)
        placeOn(link, { animate: !prefersReducedMotion(), gliding: true })
        window.location.assign(href)

        window.setTimeout(() => {
          isNavigating = false
        }, 2000)
      })

      link.addEventListener('mouseenter', () => {
        if (!mdUp() || isNavigating) return
        placeOn(link, { animate: true, gliding: false })
      })
    })

    list.addEventListener('mouseleave', () => {
      if (!mdUp() || isNavigating) return
      restoreLabels()
      syncToActive(false)
    })

    const mq = window.matchMedia('(min-width: 768px)')
    mq.addEventListener('change', () => {
      isNavigating = false
      restoreLabels()
      syncToActive(true)
    })

    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => syncToActive(true), 120)
    })

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => syncToActive(true))
    }

    resetNavIndicatorState = () => {
      isNavigating = false
      restoreLabels()
      syncToActive(true)
    }
  }

  function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal--stagger')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '-80px 0px', threshold: 0.01 },
    )
    els.forEach((el) => {
      if (el.classList.contains('reveal--glass-parallax') || el.classList.contains('metrics-glass-wrap')) return
      io.observe(el)
    })
    document.querySelectorAll('.reveal--immediate').forEach((el) => el.classList.add('is-visible'))
  }

  function initMetricsGlassReveal() {
    const section = document.querySelector('[data-metrics-glass]')
    const wrap = section?.querySelector('.metrics-glass-wrap')
    if (!section || !wrap) return

    if (prefersReducedMotion()) {
      wrap.classList.add('is-visible')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wrap.classList.add('is-visible')
            io.unobserve(section)
          }
        })
      },
      { rootMargin: '-48px 0px', threshold: 0.12 },
    )

    io.observe(section)
  }

  function initDust() {
    if (prefersReducedMotion()) return
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

  function lerp(a, b, t) {
    return a + (b - a) * t
  }

  function progressInView(el, offsetStart, offsetEnd) {
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const start = vh * (offsetStart ?? 0)
    const end = vh * (offsetEnd ?? 0)
    const total = rect.height + vh
    const p = (vh - rect.top - start) / (total - start - end)
    return Math.max(0, Math.min(1, p))
  }

  function initParallax() {
    if (prefersReducedMotion()) return

    const hero = document.querySelector('[data-parallax-hero]')
    const heroTextBlocks = hero ? [...hero.querySelectorAll('[data-parallax-text]')] : []
    const heroVisual = hero?.querySelector('[data-parallax-visual]')
    const spine = document.querySelector('[data-journey-spine]')
    const sculptImg = document.querySelector('[data-parallax-sculpture]')
    const parallaxY = [...document.querySelectorAll('[data-parallax-y]')]
    const parallaxImgY = [...document.querySelectorAll('[data-parallax-img-y]')]
    const parallaxWorkspace = [...document.querySelectorAll('[data-parallax-workspace]')]
    const mdMq = window.matchMedia('(min-width: 768px)')
    const mdUp = () => mdMq.matches

    function updateParallax() {
      if (hero && heroVisual && mdUp()) {
        const p = progressInView(hero, 0, 0)
        heroTextBlocks.forEach((block) => {
          block.style.transform = `translate3d(0, ${lerp(0, 40, p)}px, 0)`
        })
        heroVisual.style.transform = `translate3d(0, ${lerp(0, -24, p)}px, 0)`
      } else if (hero) {
        heroTextBlocks.forEach((block) => {
          block.style.transform = ''
        })
        if (heroVisual) heroVisual.style.transform = ''
      }

      parallaxY.forEach((el) => {
        if (!mdUp()) {
          el.style.transform = ''
          return
        }
        const p = progressInView(el.closest('section') || el, 0.1, 0.1)
        const range = Number(el.dataset.parallaxRange || 28)
        el.style.transform = `translate3d(0, ${lerp(-range / 2, range / 2, p)}px, 0)`
      })

      parallaxImgY.forEach((el) => {
        if (!mdUp()) {
          el.style.transform = ''
          return
        }
        const p = progressInView(el.closest('section') || el, 0, 0)
        const range = Number(el.dataset.parallaxRange || 22)
        el.style.transform = `translate3d(0, ${lerp(-range / 2, range / 2, p)}px, 0)`
      })

      parallaxWorkspace.forEach((el) => {
        if (!mdUp()) {
          el.style.transform = ''
          return
        }
        const p = progressInView(el.closest('section') || el, 0, 0)
        const sign = el.dataset.parallaxSign === '-' ? -1 : 1
        el.style.transform = `translate3d(0, ${lerp(sign * 32, -sign * 32, p)}px, 0)`
      })

      if (sculptImg) {
        if (!mdUp()) {
          sculptImg.style.transform = ''
        } else {
          const p = progressInView(sculptImg.closest('section') || sculptImg, 0, 0)
          const y = lerp(-4, 4, p)
          sculptImg.style.transform = `translate3d(0, ${y}%, 0) scale(1.08)`
        }
      }

      if (spine) {
        const section = spine.closest('section')
        const p = progressInView(section || spine, 0.25, 0.65)
        spine.style.transform = `scaleY(${lerp(0.12, 1, p)})`
      }
    }

    let scrollRaf = 0
    function scheduleParallax() {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        updateParallax()
      })
    }

    window.addEventListener('scroll', scheduleParallax, { passive: true })
    window.addEventListener('resize', scheduleParallax, { passive: true })
    scheduleParallax()
  }

  function initContactPulse() {
    const email = document.querySelector('[data-intake-email]')
    const whatsapp = document.querySelector('[data-intake-whatsapp]')
    if (!email && !whatsapp) return

    window.addEventListener(CONTACT_INTAKE_PULSE_EVENT, () => {
      if (prefersReducedMotion()) return
      if (!window.matchMedia('(min-width: 768px)').matches) return
      email?.classList.remove('intake-pulse-a')
      whatsapp?.classList.remove('intake-pulse-b')
      void email?.offsetWidth
      email?.classList.add('intake-pulse-a')
      whatsapp?.classList.add('intake-pulse-b')
      email?.addEventListener('animationend', () => email.classList.remove('intake-pulse-a'), { once: true })
      whatsapp?.addEventListener('animationend', () => whatsapp.classList.remove('intake-pulse-b'), { once: true })
    })
  }

  function refreshHero3D() {
    const container = document.getElementById('hero-canvas')
    if (!container) return
    container.replaceChildren()
    initHero3D()
  }

  function initHero3D() {
    const container = document.getElementById('hero-canvas')
    if (!container || prefersReducedMotion() || typeof window.THREE === 'undefined') return
    if (container.querySelector('canvas')) return

    const THREE = window.THREE
    const w = container.clientWidth
    const h = container.clientHeight
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(33, w / h, 0.1, 100)
    camera.position.set(0, 0.12, 5.35)

    scene.add(new THREE.AmbientLight(0xffffff, 0.34))
    const dir1 = new THREE.DirectionalLight(0xffffff, 1.15)
    dir1.position.set(6, 7, 5)
    scene.add(dir1)
    const dir2 = new THREE.DirectionalLight(0xdbe4f0, 0.38)
    dir2.position.set(-5, -2, -4)
    scene.add(dir2)

    ;[
      [0xf2f7c8, [3.8, 2.2, 2.8], 0.7, 16],
      [0x2eaee3, [2.5, -1.5, 3], 0.45, 14],
      [0x28a870, [-3, 1, 2], 0.28, 12],
    ].forEach(([color, pos, intensity, distance]) => {
      const p = new THREE.PointLight(color, intensity, distance, 2)
      p.position.set(...pos)
      scene.add(p)
    })

    const root = new THREE.Group()
    const knotGroup = new THREE.Group()
    const wireGroup = new THREE.Group()

    wireGroup.add(
      new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.18, 1),
        new THREE.MeshBasicMaterial({
          color: 0xc8ead8,
          wireframe: true,
          transparent: true,
          opacity: 0.72,
          depthWrite: false,
        }),
      ),
    )

    knotGroup.add(
      new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.52, 0.15, 160, 24, 2, 3),
        new THREE.MeshPhysicalMaterial({
          color: 0x4e5fd4,
          metalness: 0.88,
          roughness: 0.14,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          envMapIntensity: 1.35,
        }),
      ),
    )

    root.add(wireGroup)
    root.add(knotGroup)
    scene.add(root)

    const clock = new THREE.Clock()
    let animating = true
    let rafId = 0
    const heroSection = document.querySelector('[data-parallax-hero]')
    const heroDust = heroSection?.querySelector('[data-dust-container]')

    function animate() {
      if (!animating) return
      const t = clock.getElapsedTime()
      const delta = clock.getDelta()

      root.rotation.x = t * 0.21 + Math.sin(t * 0.17) * 0.08
      root.rotation.y = t * 0.33
      root.rotation.z = t * 0.13 + Math.cos(t * 0.19) * 0.07
      root.position.y = Math.sin(t * 0.55) * 0.055

      knotGroup.rotation.x += delta * 0.12
      knotGroup.rotation.y += delta * 0.2
      knotGroup.rotation.z += delta * 0.07

      wireGroup.rotation.x = t * -0.09
      wireGroup.rotation.y = t * -0.16
      wireGroup.rotation.z = t * 0.05

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    function setHeroMotionActive(active) {
      animating = active
      heroDust?.classList.toggle('hero-dust--paused', !active)
      if (active) {
        if (!rafId) animate()
      } else if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    if (heroSection) {
      const visibilityIo = new IntersectionObserver(
        (entries) => setHeroMotionActive(entries[0]?.isIntersecting ?? false),
        { rootMargin: '120px 0px', threshold: 0 },
      )
      visibilityIo.observe(heroSection)
    }

    window.addEventListener('resize', () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    })

    animate()
  }

  function initPageLifecycle() {
    window.addEventListener('pageshow', (e) => {
      document.body.style.overflow = ''
      resetNavIndicatorState?.()

      if (e.persisted) {
        document.querySelectorAll('.reveal:not(.is-visible):not(.metrics-glass-wrap)').forEach((el) => {
          el.classList.add('is-visible')
        })
        if (document.getElementById('hero-canvas') && window.THREE) {
          refreshHero3D()
        }
        window.dispatchEvent(new Event('scroll'))
      }
    })

    window.addEventListener('pagehide', () => {
      resetNavIndicatorState?.()
    })

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resetNavIndicatorState?.()
      }
    })
  }

  function initGallery() {
    const root = document.querySelector('[data-gallery]')
    const box = document.querySelector('[data-gallery-lightbox]')
    if (!root || !box) return

    const items = [...root.querySelectorAll('[data-gallery-item]')]
    const full = box.querySelector('[data-gallery-full]')
    const video = box.querySelector('[data-gallery-video]')
    if (!items.length || !full) return

    let index = 0
    let lastFocus = null

    const silence = () => {
      if (!video || video.muted) return
      video.muted = true
    }

    const stopVideo = () => {
      if (!video) return
      video.pause()
      video.removeAttribute('src')
      video.load()
      video.hidden = true
    }

    if (video) {
      video.muted = true
      video.addEventListener('volumechange', silence)
      video.addEventListener('loadeddata', () => {
        if (!video.hidden) video.play().catch(() => {})
      })
    }

    const show = (i) => {
      index = (i + items.length) % items.length
      const btn = items[index]
      const src = btn.getAttribute('data-full') || ''
      const label = (btn.getAttribute('aria-label') || 'Gallery item').replace(/^(View|Play)\s+/i, '')
      if (btn.getAttribute('data-kind') === 'video' && video) {
        full.hidden = true
        full.removeAttribute('src')
        video.hidden = false
        video.muted = true
        if (video.getAttribute('src') !== src) video.src = src
        video.play().catch(() => {})
      } else {
        stopVideo()
        full.hidden = false
        full.src = src
        full.alt = label
      }
      box.hidden = false
      document.body.style.overflow = 'hidden'
    }

    const close = () => {
      if (box.hidden) return
      box.hidden = true
      full.removeAttribute('src')
      stopVideo()
      document.body.style.overflow = ''
      lastFocus?.focus()
    }

    items.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        lastFocus = btn
        show(i)
      })
    })

    box.querySelectorAll('[data-gallery-close]').forEach((el) => {
      el.addEventListener('click', close)
    })
    box.querySelector('[data-gallery-prev]')?.addEventListener('click', () => show(index - 1))
    box.querySelector('[data-gallery-next]')?.addEventListener('click', () => show(index + 1))

    window.addEventListener('keydown', (e) => {
      if (box.hidden) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      } else if (e.key === 'ArrowLeft') {
        show(index - 1)
      } else if (e.key === 'ArrowRight') {
        show(index + 1)
      }
    })
  }

  function boot() {
    initReducedMotion()
    initNav()
    initPageLifecycle()
    initReveal()
    applyWhatsAppLinks()
    initDust()
    initParallax()
    initMetricsGlassReveal()
    initContactPulse()
    initGallery()
    if (document.getElementById('hero-canvas') && window.THREE) initHero3D()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
