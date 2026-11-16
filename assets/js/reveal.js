/**
 * Scroll-triggered fade-up — replaces Framer `Reveal` / `whileInView`.
 */
export function initReveal() {
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

  els.forEach((el) => io.observe(el))
}
