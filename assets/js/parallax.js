/**

 * Scroll-linked transforms — hero parallax, case-study images, sculptures, workspace, journey spine.

 */

import { prefersReducedMotion } from './motion-prefs.js'



function lerp(a, b, t) {

  return a + (b - a) * t

}



function progressInView(el, offsetStart = 0, offsetEnd = 1) {

  const rect = el.getBoundingClientRect()

  const vh = window.innerHeight

  const start = vh * offsetStart

  const end = vh * offsetEnd

  const total = rect.height + vh

  const p = (vh - rect.top - start) / (total - start - end)

  return Math.max(0, Math.min(1, p))

}



export function initParallax() {

  if (prefersReducedMotion()) return



  const hero = document.querySelector('[data-parallax-hero]')

  const heroTextBlocks = hero ? [...hero.querySelectorAll('[data-parallax-text]')] : []

  const heroVisual = hero?.querySelector('[data-parallax-visual]')

  const parallaxY = [...document.querySelectorAll('[data-parallax-y]')]

  const parallaxImgY = [...document.querySelectorAll('[data-parallax-img-y]')]

  const parallaxWorkspace = [...document.querySelectorAll('[data-parallax-workspace]')]

  const spine = document.querySelector('[data-journey-spine]')

  const sculptImg = document.querySelector('[data-parallax-sculpture]')

  const mdUp = () => window.matchMedia('(min-width: 768px)').matches



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



if (document.readyState === 'loading') {

  document.addEventListener('DOMContentLoaded', initParallax)

} else {

  initParallax()

}


