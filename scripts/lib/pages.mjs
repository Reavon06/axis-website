import { readdirSync } from 'fs'
import { dirname, extname, join } from 'path'
import { fileURLToPath } from 'url'
import { asset, page, esc } from './html-utils.mjs'
import * as C from './content.mjs'

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')
const GALLERY_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.mp4', '.webm', '.mov'])
const GALLERY_VIDEO_EXT = new Set(['.mp4', '.webm', '.mov'])

/** Photos dropped in assets/images/gallery — newest build picks them up. */
export function listGalleryImages() {
  const dir = join(siteRoot, 'assets', 'images', 'gallery')
  let names = []
  try {
    names = readdirSync(dir)
  } catch {
    return []
  }
  return names
    .filter((name) => GALLERY_EXT.has(extname(name).toLowerCase()) && !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
}

const sectionTopBlendMap = {
  'white-to-mist': 'from-white via-surface-mist/92 to-surface-mist',
  'mist-to-white': 'from-surface-mist via-[#f7fafc] to-white',
  'white-to-warm': 'from-white via-[#faf8f6] to-[#f6f4f1]',
  'ambient-fade': 'from-[#e7f2fb] via-white/55 to-transparent',
  'light-to-mist': 'from-surface-light via-surface-mist/88 to-surface-mist',
  'white-to-surface': 'from-white via-surface-light/96 to-surface-light',
  'surface-to-mist': 'from-surface-light via-surface-mist/88 to-surface-mist',
}

function surfaceAmbientWash() {
  return `<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div class="absolute inset-0 bg-gradient-to-br from-[#f0f7fc] via-[#eef5fb] to-surface-light"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_100%,rgba(37,42,127,0.06),transparent_55%)]"></div>
      <div class="absolute inset-x-0 top-0 h-[min(130vh,56rem)] bg-[linear-gradient(90deg,rgba(46,174,227,0.10)_0%,rgba(46,174,227,0.028)_15%,transparent_30%,transparent_70%,rgba(46,174,227,0.028)_85%,rgba(46,174,227,0.10)_100%)]" style="mask-image:linear-gradient(to bottom,#000 0%,#000 5%,rgba(0,0,0,0.45) 32%,transparent 72%);-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 5%,rgba(0,0,0,0.45) 32%,transparent 72%)"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_92%_82%_at_0%_0%,rgba(46,174,227,0.15),transparent_58%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_92%_82%_at_100%_0%,rgba(46,174,227,0.15),transparent_58%)]"></div>
    </div>`
}

function ambientHeroBottomBleed() {
  return `<div class="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(5.5rem,18vw,11rem)] bg-gradient-to-b from-transparent via-white/75 to-white" aria-hidden="true"></div>`
}

function sectionTopBlend(variant) {
  const grad = sectionTopBlendMap[variant]
  if (!grad) return ''
  return `<div class="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[clamp(4rem,11vw,7rem)] bg-gradient-to-b ${grad}" aria-hidden="true"></div>`
}

const REVEAL_VARIANTS = {
  left: 'reveal--left',
  right: 'reveal--right',
  scale: 'reveal--scale',
  blur: 'reveal--blur',
  'glass-parallax': 'reveal--glass-parallax',
}

function reveal(html, { immediate = false, stagger = false, variant = '' } = {}) {
  const cls = [
    'reveal',
    REVEAL_VARIANTS[variant],
    stagger && 'reveal--stagger',
    immediate && 'reveal--immediate',
  ]
    .filter(Boolean)
    .join(' ')
  return `<div class="${cls}">${html}</div>`
}

function attrString(extra) {
  if (!extra) return ''
  return Object.entries(extra)
    .map(([k, v]) => ` ${k}="${esc(String(v))}"`)
    .join('')
}

function shimmerLink({ href, label, className = '', sweepDelay, extraAttrs }) {
  const delayAttr =
    sweepDelay === 0.35 ? ` data-sweep-delay="0.35"` : sweepDelay === 0.7 ? ` data-sweep-delay="0.7"` : ''
  const base =
    'group relative inline-flex min-h-[2.75rem] min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-center text-[12px] font-semibold tracking-wide text-white shadow-[0_0_28px_-10px_rgba(46,174,227,0.38)] ring-1 ring-white/25 transition-shadow duration-500 hover:shadow-[0_0_40px_-8px_rgba(40,168,112,0.32),0_0_26px_-6px_rgba(46,174,227,0.32)] sm:min-h-[2.875rem] sm:px-6 sm:text-[13px] shimmer-link'
  const cls = [base, className].filter(Boolean).join(' ')
  return `<a href="${esc(href)}" class="${cls}"${delayAttr}${attrString(extraAttrs)}><span aria-hidden="true" class="absolute inset-0 bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green"></span><span aria-hidden="true" class="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" style="background:linear-gradient(120deg,rgba(37,42,127,0.22) 0%,rgba(46,174,227,0.15) 45%,rgba(40,168,112,0.18) 100%)"></span><span class="relative z-10 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]">${esc(
    label,
  )}</span></a>`
}

function worksTag(inner) {
  return `<span class="rounded-full border border-slate-200/90 bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-600">${inner}</span>`
}

function chip(inner) {
  return `<span class="rounded-full border border-slate-200/90 bg-white/60 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-600">${inner}</span>`
}

function detailRow(label, inner) {
  return `<div><p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">${esc(label)}</p><div class="mt-1.5 text-[15px] font-medium leading-snug text-slate-900">${inner}</div></div>`
}

function lockIcon(className = '') {
  const c = ['h-5 w-5', className].filter(Boolean).join(' ')
  return `<svg class="${c}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="16" r="1.25" fill="currentColor"/></svg>`
}

const WHY_ICONS = [
  `<svg viewBox="0 0 32 32" fill="none" class="h-6 w-6" aria-hidden="true"><path d="M6 22v4M16 6v4M26 14v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="6" cy="16" r="3.5" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="10" r="3.5" stroke="currentColor" stroke-width="1.6"/><circle cx="26" cy="10" r="3.5" stroke="currentColor" stroke-width="1.6"/></svg>`,
  `<svg viewBox="0 0 32 32" fill="none" class="h-6 w-6" aria-hidden="true"><path d="M6 12 L16 8 L26 12 L16 16 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 18 L16 14 L26 18 L16 22 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/><path d="M6 24 L16 20 L26 24 L16 28 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.65"/></svg>`,
  `<svg viewBox="0 0 32 32" fill="none" class="h-6 w-6" aria-hidden="true"><circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M16 10v12M10 16h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg>`,
  `<svg viewBox="0 0 32 32" fill="none" class="h-6 w-6" aria-hidden="true"><path d="M18 6 L10 18h6l-2 8 10-14h-6l2-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  `<svg viewBox="0 0 32 32" fill="none" class="h-6 w-6" aria-hidden="true"><path d="M8 18l5 5L24 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 26h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/></svg>`,
]

function heroAmbient() {
  return `<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">${surfaceAmbientWash()}<div class="absolute inset-0 bg-grid-fine opacity-[0.22] bg-[length:48px_48px]" style="mask-image:radial-gradient(ellipse 100% 100% at 50% 40%,black 0%,transparent 88%)"></div><div class="absolute inset-0 bg-vignette opacity-70"></div><div class="hero-dust absolute inset-0" data-dust-container data-dust-count="22"></div></div>`
}

function contactStudioCard() {
  const files = C.contactPage.preferredFiles.items.map((item) => `<li>${chip(esc(item))}</li>`).join('')
  const cats = C.contactPage.projectCategories.items.map((item) => `<li>${chip(esc(item))}</li>`).join('')
  const avail = C.contactPage.availability.lines.map((line) => `<li>${esc(line)}</li>`).join('')
  return `<aside class="motion-card group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/65 p-8 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.14)] ring-1 ring-white/60 backdrop-blur-xl hover:shadow-[0_28px_70px_-24px_rgba(46,174,227,0.12),0_0_0_1px_rgba(46,174,227,0.08)] md:p-10">
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/90 via-surface-mist/30 to-white/50"></div>
      <div class="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(46,174,227,0.12),transparent_68%)] blur-2xl transition-opacity duration-700 group-hover:opacity-100"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(40,168,112,0.08),transparent_68%)] blur-2xl"></div>
      <div class="relative z-10">
        <h2 class="font-display text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">${esc(C.contactPage.cardTitle)}</h2>
        <div class="mt-8 space-y-7">
          ${detailRow('Location', esc(C.contactPage.addressLine))}
          ${detailRow(
            'Email',
            `<a href="${esc(C.mailto)}" class="text-axis-navy underline-offset-4 transition hover:underline">${esc(C.footer.email)}</a>`,
          )}
          ${detailRow(
            'Phone',
            `<a href="tel:${esc(C.footer.phoneTel)}" class="text-axis-navy underline-offset-4 transition hover:underline">${esc(C.contactPage.phoneDisplay)}</a>`,
          )}
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">${esc(C.contactPage.availability.title)}</p>
            <ul class="mt-1.5 space-y-0.5 text-[15px] font-medium text-slate-900">${avail}</ul>
          </div>
        </div>
        <div class="my-8 h-px w-full bg-gradient-to-r from-transparent via-axis-cyan/35 to-transparent shadow-[0_0_14px_rgba(46,174,227,0.18)]" role="presentation"></div>
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">${esc(C.contactPage.preferredFiles.title)}</p>
          <ul class="mt-3 flex flex-wrap gap-2">${files}</ul>
        </div>
        <div class="mt-8">
          <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">${esc(C.contactPage.projectCategories.title)}</p>
          <ul class="mt-3 flex flex-wrap gap-2">${cats}</ul>
        </div>
        <p class="mt-8 border-l-2 border-axis-cyan/35 bg-axis-cyan/[0.04] py-3 pl-4 pr-2 text-sm leading-relaxed text-slate-600">${esc(C.contactPage.professionalNote)}</p>
      </div>
    </aside>`
}

export function renderHomeBody(depth) {
  const exploreHref = page(depth, 'works')
  const contactHref = page(depth, 'contact')
  const titleHtml = C.hero.titleLines.map((line) => `<span class="block">${esc(line)}</span>`).join('')
  const metricsLis = C.metrics
    .map(
      (m, i) => `<li class="glass-metric-card" data-glass-depth="${(0.14 + i * 0.1).toFixed(2)}" style="--glass-i:${i}">
      <div class="glass-metric-card__inner group">
      <p class="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">${esc(m.value)}<span class="ml-0.5 text-lg font-medium text-slate-500 sm:text-xl">${esc(m.suffix)}</span></p>
      <p class="mt-2 text-[13px] font-medium text-slate-700">${esc(m.label)}</p>
      <p class="mt-2 text-xs leading-relaxed text-slate-500">${esc(m.note)}</p>
      </div>
    </li>`,
    )
    .join('')
  const capLis = C.capabilities
    .map(
      (row) => `<li class="motion-card group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-soft">
      <div class="p-3 pb-0 sm:p-4 sm:pb-0">
        <div class="relative h-40 overflow-hidden rounded-2xl img-zoom-wrap">
          <img src="${esc(asset(depth, row.image))}" alt="" class="h-full w-full object-cover" />
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/55 via-transparent to-transparent"></div>
        </div>
      </div>
      <div class="flex flex-1 flex-col p-6 pt-4 sm:pt-5">
        <h3 class="font-display text-lg font-semibold text-slate-950">${esc(row.title)}</h3>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">${esc(row.description)}</p>
        <div class="mt-5 h-px w-full bg-gradient-to-r from-axis-cyan/35 via-transparent to-axis-green/25 opacity-0 transition group-hover:opacity-100"></div>
      </div>
    </li>`,
    )
    .join('')
  const featuredArticles = C.showHomeWorksSection
    ? C.featuredWorks.map(
        (w) => `<article class="motion-card group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft">
      <div class="grid gap-0 lg:grid-cols-2">
        <div class="p-3 pb-0 sm:p-4 sm:pb-0 lg:flex lg:flex-col lg:justify-stretch lg:p-5 lg:pb-5 lg:pr-3">
          <div class="relative min-h-[220px] overflow-hidden rounded-2xl sm:min-h-[240px] lg:min-h-[340px] lg:flex-1 img-zoom-wrap">
            <div data-parallax-img-y data-parallax-range="18" class="absolute inset-0 will-change-transform">
              <img src="${esc(asset(depth, w.image))}" alt="" class="h-full w-full object-cover" />
            </div>
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/35 via-transparent to-transparent lg:bg-gradient-to-r"></div>
          </div>
        </div>
        <div class="flex flex-col justify-center p-8 lg:p-12">
          <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">${esc(w.meta)}</p>
          <h3 class="mt-3 font-display text-3xl font-semibold text-slate-950 lg:text-4xl">${esc(w.title)}</h3>
        </div>
      </div>
    </article>`,
      )
    : []
  const homeWorksSection = C.showHomeWorksSection
    ? `<section id="works" class="relative scroll-mt-28 bg-surface-mist py-[var(--section-y)]">
      <div data-parallax-bg data-parallax-range="28" class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(46,174,227,0.12),transparent_42%),radial-gradient(circle_at_90%_70%,rgba(37,42,127,0.08),transparent_45%)]"></div>${sectionTopBlend('light-to-mist')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-5 md:px-10">
        <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Works</p><h2 class="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-slate-950 md:text-[2.75rem]">Physical outcomes, documented.</h2>`)}
          ${reveal(`<a href="${esc(exploreHref)}" class="link-arrow text-sm font-semibold text-axis-navy underline-offset-4 hover:text-axis-cyan hover:underline">View all works</a>`, { variant: 'left' })}
        </div>
        <div class="mt-14 flex flex-col gap-10">${featuredArticles.map((html) => reveal(html)).join('')}</div>
      </div>
    </section>`
    : ''
  const stdLis = C.standards
    .map(
      (s) => `<li class="motion-card motion-card--soft rounded-3xl border border-slate-200/80 bg-surface-light/80 p-7 shadow-soft">
      <div class="h-px w-10 bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green"></div>
      <h3 class="mt-5 font-display text-xl font-semibold text-slate-950">${esc(s.title)}</h3>
      <p class="mt-3 text-sm leading-relaxed text-slate-600">${esc(s.body)}</p>
    </li>`,
    )
    .join('')

  return `<section data-parallax-hero id="hero" class="relative isolate min-h-[100svh] overflow-hidden bg-surface-light">${heroAmbient()}
    <div class="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 max-md:grid-rows-[auto_1fr_auto] max-md:gap-7 content-start gap-10 px-4 pb-[max(4.5rem,env(safe-area-inset-bottom))] pt-[max(6.25rem,env(safe-area-inset-top)+3.75rem)] [grid-template-areas:'copy'_'art'_'cta'] sm:px-5 sm:pb-14 sm:pt-[6.75rem] md:min-h-0 md:grid-rows-[auto_auto] md:grid-cols-[minmax(0,min(100%,28rem))_minmax(0,1fr)] md:items-start md:gap-x-12 md:gap-y-4 md:px-10 md:pb-12 md:pt-28 md:[grid-template-areas:'copy_art'_'cta_art'] lg:gap-x-16 lg:gap-y-5 lg:pb-14 lg:pt-32">
      <div data-parallax-text class="w-full max-w-xl [grid-area:copy] md:max-w-[min(100%,28rem)] md:self-start lg:max-w-lg">
        ${reveal(`<p class="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-axis-navy sm:mb-5 sm:text-[11px] sm:tracking-[0.32em]">${esc(C.hero.eyebrow)}</p>`)}
        ${reveal(`<h1 class="font-display text-[clamp(1.9rem,5.8vw+0.75rem,3.5rem)] font-semibold leading-[1.07] tracking-[-0.025em] text-slate-950">${titleHtml}</h1>`)}
        ${reveal(`<p class="mt-4 max-w-[52ch] text-base leading-relaxed text-slate-600 sm:mt-5 sm:max-w-[48ch] sm:text-lg sm:leading-[1.65] md:mt-5 md:text-xl md:leading-[1.6]">${esc(C.hero.sub)}</p>`)}
      </div>
      <div data-parallax-visual class="relative flex w-full max-md:min-h-0 max-md:self-stretch max-md:pb-0 max-md:pt-1 items-center justify-center pb-2 [grid-area:art] sm:pb-0 md:max-w-[min(54vw,580px)] md:min-h-0 md:-translate-y-2 md:place-self-start lg:-translate-y-4">
        <div data-parallax-mouse class="relative w-full max-md:max-w-[min(100%,640px)] md:max-w-none">
          <div id="hero-canvas" class="relative mx-auto h-[min(400px,52svh)] w-full min-h-[290px] max-w-full sm:h-[min(450px,56svh)] sm:min-h-[320px] md:h-[min(520px,58vh)] md:min-h-[300px] md:max-w-none lg:h-[min(580px,62vh)]"></div>
        </div>
      </div>
      <div data-parallax-text class="w-full max-w-xl max-md:pt-2 [grid-area:cta] md:max-w-[min(100%,28rem)] md:self-start lg:max-w-lg">
        ${reveal(
          `<div class="mt-3 flex w-full max-w-md flex-col gap-3 max-md:mt-0 sm:mt-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4 md:mt-4">
          <a href="${esc(exploreHref)}" class="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green px-7 py-3 text-sm font-semibold text-white shadow-glow-sm transition active:scale-[0.98] sm:w-auto sm:min-h-0 sm:px-8 sm:py-3 sm:hover:-translate-y-0.5 sm:hover:shadow-lift">Explore Works</a>
          <a href="${esc(contactHref)}" class="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-900 shadow-sm transition active:scale-[0.98] sm:w-auto sm:min-h-0 sm:px-8 sm:py-3 sm:hover:-translate-y-0.5 sm:hover:border-slate-400 sm:hover:bg-slate-50">Start a Project</a>
        </div>`,
          { immediate: true },
        )}
      </div>
    </div>${ambientHeroBottomBleed()}</section>
    <section id="capabilities" class="relative scroll-mt-28 bg-surface-light py-[var(--section-y)]">${sectionTopBlend('ambient-fade')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-5 md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Capabilities</p><h2 class="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-[2.75rem]">Controlled processes for physical parts.</h2>`)}
        ${reveal(`<ul class="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">${capLis}</ul>`, { stagger: true })}
      </div>
    </section>
    <section id="metrics" data-metrics-glass class="metrics-glass-stage relative overflow-hidden border-y border-slate-200/80 bg-surface-mist/30 py-14 sm:py-16">
      <div class="pointer-events-none absolute inset-0 flex justify-center" aria-hidden="true">
        <div class="relative h-full w-full max-w-6xl px-4 sm:px-5 md:px-10">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_50%,rgba(46,174,227,0.1),transparent_68%)]"></div>
        </div>
      </div>
      <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-5 md:px-10">
        <div class="metrics-glass-wrap reveal--glass-parallax">
          <ul class="metrics-glass-grid grid items-stretch gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">${metricsLis}</ul>
        </div>
        <p class="mt-8 text-center text-xs text-slate-500 sm:mt-10">Values reflect typical production envelopes — <a href="${esc(contactHref)}" class="font-medium text-axis-navy underline-offset-4 hover:underline">confirm on your geometry</a>.</p>
      </div>
    </section>
    ${homeWorksSection}
    <section id="standards" class="relative scroll-mt-28 bg-white py-[var(--section-y)]">${sectionTopBlend('mist-to-white')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-5 md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">Operating standard</p><h2 class="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-slate-950 md:text-[2.75rem]">Manufacturing discipline, visible in the deliverable.</h2>`)}
        ${reveal(`<ul class="mt-14 grid gap-7 md:grid-cols-3">${stdLis}</ul>`, { stagger: true })}
      </div>
    </section>
    <section id="inquiry" class="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-surface-mist via-white to-surface-light py-[var(--section-y)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,174,227,0.14),transparent_58%)]"></div>${sectionTopBlend('white-to-mist')}
      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-5 md:px-10">
        ${reveal(`<h2 class="font-display text-4xl font-semibold tracking-tight text-slate-950 md:text-[2.75rem]">${esc(C.inquiry.headline)}</h2><p class="mx-auto mt-5 max-w-2xl text-base text-slate-600 md:text-lg">${esc(C.inquiry.line)}</p>`, { variant: 'blur' })}
        ${reveal(
          `<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="${esc(C.mailto)}" class="inline-flex rounded-full bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green px-9 py-3 text-sm font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow">${esc(C.inquiry.primary.label)}</a>
          <a href="${esc(contactHref)}" class="inline-flex rounded-full border border-slate-300/90 bg-white/80 px-9 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-axis-cyan/45">Contact form</a>
        </div>`,
        )}
      </div>
    </section>`
}

export function renderWorksBody(depth) {
  const contactHref = page(depth, 'contact')
  const diatoneTags = C.worksDiatone.tags.map((t) => `<li>${worksTag(esc(t))}</li>`).join('')
  const incTags = C.worksIncubator.tags.map((t) => `<li>${chip(esc(t))}</li>`).join('')
  const awardItems = C.worksAwards.strips
    .map(
      (strip) => `<article class="group relative w-[min(22rem,calc(100vw-2rem))] max-w-[min(22rem,calc(100vw-2rem))] shrink-0 grow-0 snap-center scroll-ml-4 first:scroll-ml-0 md:w-auto md:max-w-none md:min-w-0 md:snap-none md:scroll-ml-0">
      <div class="relative flex max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-surface-mist/40 shadow-soft ring-1 ring-slate-200/40 transition duration-500 ease-out group-hover:-translate-y-1 group-hover:border-axis-cyan/25 group-hover:shadow-[0_28px_60px_-20px_rgba(46,174,227,0.14)]">
        <div class="relative p-3 pb-0 sm:p-3.5 sm:pb-0">
          <div class="relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-2xl bg-white p-2 max-md:max-h-[min(68svh,26.5rem)] md:max-h-none">
            <div class="relative h-full min-h-0 w-full rounded-[10px] sm:rounded-[11px]">
              <div class="pointer-events-none absolute inset-0 z-10 rounded-[10px] bg-gradient-to-t from-slate-900/10 via-transparent to-white/30 sm:rounded-[11px]"></div>
              <div class="pointer-events-none absolute inset-0 z-10 rounded-[10px] opacity-0 transition duration-500 group-hover:opacity-100 sm:rounded-[11px]"><div class="h-full w-full rounded-[10px] bg-[linear-gradient(135deg,rgba(46,174,227,0.08)_0%,transparent_50%)] sm:rounded-[11px]"></div></div>
              <img src="${esc(asset(depth, strip.image))}" alt="" class="relative z-0 h-full w-full max-w-full rounded-[10px] object-cover object-center transition duration-700 ease-out sm:rounded-[11px]" />
            </div>
          </div>
        </div>
        <div class="relative z-20 border-t border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur-md"><p class="text-[13px] font-medium tracking-wide text-slate-700">${esc(strip.caption)}</p></div>
      </div>
    </article>`,
    )
    .join('')
  const confCards = C.worksConfidential.cards
    .map(
      (card) => `<li>
      <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/5 transition duration-500 hover:border-axis-cyan/25 hover:shadow-[0_24px_60px_-16px_rgba(46,174,227,0.15)]">
        <div class="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <img src="${esc(asset(depth, card.image))}" alt="" class="h-full w-full scale-105 object-cover blur-xl brightness-75 saturate-50 transition duration-500 group-hover:blur-2xl" />
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20"></div>
          <div class="absolute inset-0 rounded-2xl backdrop-blur-[2px]"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 shadow-inner backdrop-blur-md">${lockIcon()}</div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">${esc(card.label)}</p>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">NDA protected</span>
          </div>
        </div>
      </div>
    </li>`,
    )
    .join('')
  const finalCta = `${reveal(`<h2 class="font-display text-[clamp(2rem,4vw+1rem,3rem)] font-semibold leading-tight tracking-tight text-slate-950">${esc(C.worksFinalCta.title)}</h2><p class="mx-auto mt-5 max-w-xl text-base text-slate-600 md:text-lg">${esc(C.worksFinalCta.sub)}</p>`)}
        ${reveal(
          `<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="${esc(contactHref)}" class="inline-flex rounded-full bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green px-9 py-3.5 text-sm font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow">Start a Project</a>
          <a href="${esc(contactHref)}" class="inline-flex rounded-full border border-slate-300/90 bg-white/85 px-9 py-3.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-axis-cyan/45 hover:shadow-md">Contact Us</a>
        </div>`,
        )}`

  return `<div class="min-h-screen overflow-x-clip bg-surface-light text-slate-900">
    <section class="relative isolate overflow-hidden bg-surface-light pb-12 pt-[max(6.5rem,env(safe-area-inset-top)+4rem)] sm:pb-16 sm:pt-32 md:pb-20 md:pt-40">${surfaceAmbientWash()}
      <div class="pointer-events-none absolute inset-0 grid-pulse bg-grid-fine bg-[length:48px_48px]" style="mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,black,transparent);opacity:0.15"></div>
      <div class="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-axis-navy">${esc(C.worksHero.eyebrow)}</p>`)}
        ${reveal(`<h1 class="mt-5 max-w-4xl font-display text-[clamp(2.1rem,5vw+1rem,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-slate-950">${esc(C.worksHero.title)}</h1>`)}
        ${reveal(`<p class="mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">${esc(C.worksHero.sub)}</p>`)}
        <div class="mt-10 h-px max-w-xs bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green sm:mt-12 md:mt-14"></div>
      </div>${ambientHeroBottomBleed()}
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-white pb-[clamp(3.5rem,10vw,7rem)] pt-[clamp(2.25rem,5vw,4.5rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_40%,rgba(40,168,112,0.08),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_60%,rgba(46,174,227,0.1),transparent_55%)]"></div>${sectionTopBlend('ambient-fade')}
      <div class="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center md:gap-16 md:px-10 lg:gap-20">
        <div class="group relative order-2 aspect-square w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100/90 shadow-soft transition duration-500 ease-out hover:shadow-[0_28px_60px_-20px_rgba(46,174,227,0.18)] md:order-1 md:aspect-auto md:min-h-[420px] md:bg-surface-mist/50 lg:min-h-[480px]">
          <div class="pointer-events-none absolute -inset-px rounded-[2rem] bg-gradient-to-br from-axis-cyan/15 via-transparent to-axis-green/10"></div>
          <div class="pointer-events-none absolute -inset-2 z-[1] rounded-[2rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(40,168,112,0.12),transparent_65%)] opacity-80 transition duration-500 group-hover:opacity-100"></div>
          <div data-parallax-y data-parallax-range="28" class="absolute inset-0 will-change-transform">
            <img src="${esc(asset(depth, 'works/diatone/samphero.png'))}" alt="" class="h-full w-full object-cover object-center transition duration-700 ease-out md:h-[115%] md:-translate-y-[5%] md:group-hover:scale-[1.03]" />
          </div>
        </div>
        <div class="order-1 space-y-8 md:order-2 md:py-6">
          ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-axis-green">Case study 01</p><h2 class="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">${esc(C.worksDiatone.title)}</h2><p class="mt-2 text-lg font-medium text-slate-600">${esc(C.worksDiatone.subtitle)}</p>`, { variant: 'right' })}
          ${reveal(`<p class="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">${esc(C.worksDiatone.description)}</p>`, { variant: 'right' })}
          ${reveal(`<ul class="flex flex-wrap gap-2">${diatoneTags}</ul>`, { stagger: true })}
        </div>
      </div>
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-surface-mist py-[clamp(4rem,12vw,8rem)]">
      <div class="pointer-events-none absolute inset-0 opacity-[0.12] bg-grid-fine bg-[length:40px_40px]" style="mask-image:linear-gradient(to bottom,black 0%,transparent 92%)"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,rgba(37,42,127,0.07),transparent_55%)]"></div>${sectionTopBlend('white-to-mist')}
      <div class="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center md:gap-16 md:px-10 lg:gap-20">
        <div class="space-y-8 md:py-6">
          ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-axis-navy">Case study 02</p><h2 class="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">${esc(C.worksIncubator.title)}</h2><p class="mt-3 text-base font-semibold text-axis-cyan md:text-lg">${esc(C.worksIncubator.subtitle)}</p>`, { variant: 'left' })}
          ${reveal(`<p class="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">${esc(C.worksIncubator.description)}</p>`, { variant: 'left' })}
          ${reveal(`<ul class="flex flex-wrap gap-2">${incTags}</ul>`, { stagger: true })}
        </div>
        <div class="group relative aspect-square w-full overflow-hidden rounded-[2rem] border border-slate-300/60 bg-slate-100/90 shadow-soft transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_55px_-18px_rgba(37,42,127,0.2)] md:aspect-auto md:min-h-[420px] md:bg-white/40 lg:min-h-[480px]">
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-tl from-axis-navy/10 via-transparent to-axis-cyan/10"></div>
          <div data-parallax-y data-parallax-range="24" class="absolute inset-0 will-change-transform">
            <img src="${esc(asset(depth, 'works/incubator/hero.png'))}" alt="" class="h-full w-full object-cover object-center transition duration-700 ease-out md:h-[115%] md:-translate-y-[5%] md:group-hover:scale-[1.03]" />
          </div>
        </div>
      </div>
    </section>
    <section class="relative scroll-mt-24 overflow-hidden border-t border-slate-200/60 bg-white py-[clamp(4rem,12vw,8rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_30%,rgba(212,165,116,0.06),transparent_55%),radial-gradient(ellipse_60%_50%_at_90%_70%,rgba(46,174,227,0.08),transparent_55%)]"></div>${sectionTopBlend('mist-to-white')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-axis-navy">Recognition</p><h2 class="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl lg:text-[2.65rem]">${esc(C.worksAwards.title)}</h2><p class="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">${esc(C.worksAwards.description)}</p>`)}
        ${reveal(
          `<div class="mt-14 -mx-4 flex min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] touch-manipulation md:mx-0 md:snap-none md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:overscroll-x-auto md:px-0 md:pb-0 md:pt-0 [&::-webkit-scrollbar]:hidden">${awardItems}</div>`,
          { stagger: true },
        )}
      </div>
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-[#f6f4f1] py-[clamp(4rem,12vw,8.5rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,rgba(37,42,127,0.06),transparent_55%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-slate-200/30"></div>${sectionTopBlend('white-to-warm')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        <div class="max-w-2xl">${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Fabrication</p><h2 class="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl lg:text-[2.65rem]">${esc(C.worksSculptures.title)}</h2><p class="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">${esc(C.worksSculptures.description)}</p>`)}</div>
        ${reveal(`<div class="relative mt-14 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-200/40 p-3 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.25)] sm:p-4">
          <div class="relative aspect-[16/10] min-h-[220px] w-full overflow-hidden rounded-2xl md:aspect-[21/9] md:min-h-[320px]">
            <img data-parallax-sculpture src="${esc(asset(depth, 'works/sculptures/hero.png'))}" alt="" class="absolute inset-0 h-full w-full object-cover will-change-transform" />
            <div class="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-tr from-slate-950/25 via-transparent to-transparent"></div>
            <div class="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-[radial-gradient(ellipse_55%_50%_at_20%_90%,rgba(0,0,0,0.35),transparent_60%)]"></div>
          </div>
        </div>`)}
      </div>
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-slate-950 py-[clamp(4rem,11vw,7.5rem)] text-slate-100">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(46,174,227,0.08),transparent_55%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_0%_100%,rgba(37,42,127,0.35),transparent_55%)]"></div>
      <div class="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        ${reveal(`<div class="flex flex-wrap items-center gap-3">${lockIcon('text-axis-cyan/90')}<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400">Protected work</p></div><h2 class="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">${esc(C.worksConfidential.title)}</h2><p class="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">${esc(C.worksConfidential.description)}</p>`)}
        ${reveal(`<ul class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${confCards}</ul>`, { stagger: true })}
      </div>
    </section>
    <section class="relative overflow-hidden border-t border-slate-200/50 bg-gradient-to-b from-surface-mist via-white to-surface-light py-[clamp(4.5rem,14vw,9rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-20%,rgba(46,174,227,0.16),transparent_55%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_100%_80%,rgba(37,42,127,0.08),transparent_50%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_60%,rgba(40,168,112,0.06),transparent_50%)]"></div>
      <div class="pointer-events-none absolute inset-0 overflow-hidden ambient-dust" data-dust-container data-dust-count="36" aria-hidden="true"></div>
      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-10">${finalCta}</div>
    </section>
  </div>`
}

export function renderAboutBody(depth) {
  const contactHref = page(depth, 'contact')
  const storyBlocks = C.aboutStory.paragraph1Parts
    .map(
      (s, i) => `<div class="relative pl-6">
      <span class="absolute left-0 top-1.5 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-axis-cyan via-axis-navy/40 to-axis-green/60"></span>
      <p class="text-lg leading-relaxed text-slate-700 md:text-xl">${esc(s)}</p>
    </div>`,
    )
    .join('')
  const milestones = C.aboutJourney.milestones
    .map(
      (m) => `<li class="group relative flex gap-6 md:gap-10">
      <div class="relative z-10 flex shrink-0 flex-col items-center pt-1">
        <span class="flex h-4 w-4 items-center justify-center rounded-full border border-axis-cyan/50 bg-white shadow-[0_0_16px_rgba(46,174,227,0.35)] ring-4 ring-axis-cyan/15 transition group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(46,174,227,0.55)] md:h-5 md:w-5"><span class="h-1.5 w-1.5 rounded-full bg-axis-navy"></span></span>
      </div>
      <div class="min-w-0 pb-1">
        <p class="font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">${esc(m.year)}</p>
        <p class="mt-2 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">${esc(m.text)}</p>
      </div>
    </li>`,
    )
    .join('')
  const whyLis = C.aboutWhy.points
    .map((label, i) => {
      const icon = WHY_ICONS[i] ?? WHY_ICONS[0]
      return `<li>
      <div class="motion-card flex h-full flex-col rounded-2xl border border-slate-200/70 bg-surface-mist/30 px-5 py-6 hover:border-axis-cyan/30 hover:bg-white hover:shadow-soft">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-axis-navy">${icon}</div>
        <p class="mt-4 text-sm font-medium leading-snug text-slate-800 md:text-[15px]">${esc(label)}</p>
      </div>
    </li>`
    })
    .join('')
  const finalBlock = `${reveal(`<h2 class="font-display text-[clamp(2rem,4vw+1rem,3rem)] font-semibold leading-tight tracking-tight text-slate-950">${esc(C.aboutFinalCta.title)}</h2><p class="mx-auto mt-5 max-w-xl text-base text-slate-600 md:text-lg">${esc(C.aboutFinalCta.sub)}</p>`)}
        ${reveal(
          `<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="${esc(contactHref)}" class="inline-flex rounded-full bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green px-9 py-3.5 text-sm font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow">Start a Project</a>
          <a href="${esc(contactHref)}" class="inline-flex rounded-full border border-slate-300/90 bg-white/85 px-9 py-3.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-axis-cyan/45 hover:shadow-md">Contact Us</a>
        </div>`,
        )}`

  return `<div class="min-h-screen bg-surface-light text-slate-900">
    <section class="relative isolate overflow-hidden bg-surface-light pb-16 pt-[max(6.5rem,env(safe-area-inset-top)+4rem)] sm:pb-24 sm:pt-32 md:min-h-[min(88vh,52rem)] md:pb-32 md:pt-40">${surfaceAmbientWash()}
      <div class="pointer-events-none absolute inset-0 grid-pulse bg-grid-fine bg-[length:44px_44px]" style="mask-image:radial-gradient(ellipse 75% 65% at 45% 35%,black,transparent 78%);opacity:0.12"></div>
      <div class="floating-orb absolute -right-[8%] top-[12%] h-[min(52vw,28rem)] w-[min(52vw,28rem)] rounded-full bg-axis-cyan/20 blur-[100px]" aria-hidden="true"></div>
      <div class="floating-orb floating-orb--delay absolute -left-[10%] bottom-[8%] h-[min(48vw,22rem)] w-[min(48vw,22rem)] rounded-full bg-axis-navy/15 blur-[90px]" aria-hidden="true"></div>
      <div class="floating-orb absolute left-[35%] top-[40%] h-40 w-40 rounded-full border border-axis-cyan/25 bg-white/20 blur-sm md:h-52 md:w-52" style="animation-delay:0.6s" aria-hidden="true"></div>
      <div class="pointer-events-none absolute right-[6%] top-[22%] hidden h-72 w-72 rounded-[2.5rem] border border-axis-cyan/20 bg-gradient-to-br from-white/50 to-transparent shadow-soft md:block" aria-hidden="true"></div>
      <div class="pointer-events-none absolute right-[10%] top-[38%] hidden h-36 w-36 rounded-2xl border border-axis-navy/15 bg-axis-navy/[0.04] backdrop-blur-sm md:block" aria-hidden="true"></div>
      <div class="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-16 md:px-10">
        <div>
          ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-axis-navy">${esc(C.aboutHero.eyebrow)}</p>`)}
          ${reveal(`<h1 class="mt-5 max-w-xl font-display text-[clamp(2.15rem,4.5vw+0.5rem,3.45rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-slate-950">${esc(C.aboutHero.title)}</h1>`)}
          ${reveal(`<p class="mt-8 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">${esc(C.aboutHero.sub)}</p>`)}
          <div class="mt-10 h-px max-w-[10rem] bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green sm:mt-12 md:mt-12"></div>
        </div>
        <div class="relative mx-auto hidden aspect-square w-full max-w-md md:block">
          <div class="absolute inset-[8%] rounded-full border border-slate-200/60 bg-gradient-to-br from-white/80 to-surface-mist/30 shadow-soft"></div>
          <div class="absolute inset-[18%] rounded-full border border-axis-cyan/25"></div>
          <div class="absolute inset-[28%] rounded-full bg-[conic-gradient(from_180deg,rgba(46,174,227,0.12),rgba(37,42,127,0.08),rgba(40,168,112,0.1),rgba(46,174,227,0.12))] blur-2xl"></div>
          <div class="absolute inset-0 flex items-center justify-center"><span class="font-display text-6xl font-semibold tracking-tight text-slate-900/10 md:text-7xl">A3</span></div>
        </div>
      </div>${ambientHeroBottomBleed()}
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-white pb-[clamp(3.5rem,10vw,7rem)] pt-[clamp(2.25rem,5vw,4.5rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_100%_20%,rgba(46,174,227,0.07),transparent_55%)]"></div>${sectionTopBlend('ambient-fade')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-axis-navy">${esc(C.aboutStory.eyebrow)}</p>`)}
        <div class="mt-10 grid gap-10 max-md:gap-8 md:mt-14 lg:grid-cols-2 lg:gap-16 lg:items-start">
          ${reveal(`<div class="relative order-2 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-surface-mist/40 shadow-soft md:order-1">
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-axis-navy/[0.06] to-transparent"></div>
            <div data-parallax-img-y data-parallax-range="20" class="will-change-transform">
              <img src="${esc(asset(depth, 'about/story-visual.png'))}" alt="" class="aspect-[4/5] w-full object-cover object-center" />
            </div>
          </div>`, { variant: 'scale' })}
          ${reveal(`<div class="order-1 flex flex-col gap-8 md:order-2 lg:pt-4">${storyBlocks}</div>`, { stagger: true })}
        </div>
        ${reveal(`<div class="relative mt-16 max-w-3xl rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-surface-mist/50 px-6 py-8 shadow-soft md:mt-20 md:px-10 md:py-10 lg:mx-auto lg:text-center"><div class="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(46,174,227,0.08),transparent_55%)]"></div><p class="relative text-lg leading-relaxed text-slate-600 md:text-xl">${esc(C.aboutStory.paragraph2)}</p></div>`)}
      </div>
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-surface-mist py-[clamp(4rem,12vw,8.5rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_30%,rgba(37,42,127,0.06),transparent_55%)]"></div>
      <div class="pointer-events-none absolute inset-0 opacity-[0.1] bg-grid-fine bg-[length:40px_40px]"></div>${sectionTopBlend('white-to-mist')}
      <div class="relative z-10 mx-auto max-w-3xl px-4 md:max-w-4xl md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-axis-navy">Timeline</p><h2 class="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">${esc(C.aboutJourney.title)}</h2>`)}
        <div class="relative mt-16 md:mt-20">
          <div class="absolute left-[7px] top-2 bottom-2 w-px overflow-hidden rounded-full bg-slate-300/90 md:left-[11px]" aria-hidden="true">
            <div data-journey-spine class="journey-spine-fill absolute left-0 top-0 h-full w-full origin-top bg-gradient-to-b from-axis-cyan via-axis-navy to-axis-green shadow-[0_0_20px_rgba(46,174,227,0.45)]"></div>
          </div>
          ${reveal(`<ol class="relative space-y-12 md:space-y-14">${milestones}</ol>`, { stagger: true })}
        </div>
      </div>
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-surface-mist py-[clamp(4rem,12vw,8rem)]">
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-surface-mist"></div>${sectionTopBlend('surface-to-mist')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        <div class="max-w-2xl">${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-axis-navy">Workspace</p><h2 class="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">${esc(C.aboutWorkspace.title)}</h2><p class="mt-4 text-base text-slate-600 md:text-lg">${esc(C.aboutWorkspace.sub)}</p>`)}</div>
        <div class="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
          <figure class="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-soft sm:p-4">
            <div class="relative overflow-hidden rounded-2xl">
              <div class="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-slate-900/25 to-transparent opacity-60 transition duration-500 group-hover:opacity-40"></div>
              <div data-parallax-workspace class="will-change-transform">
                <img src="${esc(asset(depth, 'about/workspace-a.png'))}" alt="" class="aspect-[16/11] w-full object-cover grayscale transition duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.02]" />
              </div>
            </div>
          </figure>
          <figure class="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-soft sm:p-4 md:mt-12">
            <div class="relative overflow-hidden rounded-2xl">
              <div class="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-slate-900/25 to-transparent opacity-60 transition duration-500 group-hover:opacity-40"></div>
              <div data-parallax-workspace data-parallax-sign="-" class="will-change-transform">
                <img src="${esc(asset(depth, 'about/workspace-b.png'))}" alt="" class="aspect-[16/11] w-full object-cover grayscale transition duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.02]" />
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
    <section class="relative scroll-mt-24 border-t border-slate-200/60 bg-white py-[clamp(4rem,11vw,7.5rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_80%_0%,rgba(37,42,127,0.05),transparent_55%)]"></div>${sectionTopBlend('mist-to-white')}
      <div class="relative z-10 mx-auto max-w-6xl px-4 md:px-10">
        ${reveal(`<h2 class="font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">${esc(C.aboutWhy.title)}</h2>`)}
        ${reveal(`<ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">${whyLis}</ul>`, { stagger: true })}
      </div>
    </section>
    <section class="relative overflow-hidden border-t border-slate-200/50 bg-gradient-to-b from-surface-mist via-white to-surface-light py-[clamp(4.5rem,14vw,9rem)]">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-20%,rgba(46,174,227,0.15),transparent_55%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_85%,rgba(37,42,127,0.07),transparent_50%)]"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_0%_50%,rgba(40,168,112,0.06),transparent_50%)]"></div>
      <div class="pointer-events-none absolute inset-0 overflow-hidden ambient-dust" data-dust-container data-dust-count="34" aria-hidden="true"></div>${sectionTopBlend('white-to-mist')}
      <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 md:px-10">${finalBlock}</div>
    </section>
  </div>`
}

export function renderContactBody(depth) {
  const homeHref = page(depth, 'home')
  const emailLabel = `Email us at ${C.footer.email}`
  return `<div class="relative min-h-screen overflow-hidden bg-surface-light pt-[max(5.5rem,env(safe-area-inset-top)+3.25rem)]">${surfaceAmbientWash()}
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_90%_60%,rgba(40,168,112,0.05),transparent_50%)]"></div>
    <div class="pointer-events-none absolute inset-0 opacity-[0.12] bg-grid-fine bg-[length:44px_44px]" style="mask-image:radial-gradient(ellipse 85% 75% at 50% 40%,black,transparent 92%)"></div>
    <section class="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-5 md:px-10 md:pb-32 md:pt-12">
      <div class="grid items-start gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-24">
        <div>
          ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-axis-navy">${esc(C.contactPage.label)}</p>`)}
          ${reveal(`<h1 class="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 md:text-5xl lg:text-[3.25rem]">${esc(C.contactPage.title)}</h1>`)}
          ${reveal(`<p class="mt-7 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">${esc(C.contactPage.sub)}</p>`)}
          <div class="mt-10 grid grid-cols-2 gap-3 sm:mt-12">
            ${reveal(
              shimmerLink({
                href: C.mailto,
                label: 'Email Us',
                className: 'w-full contact-intake-link',
                sweepDelay: 0,
                extraAttrs: { 'data-intake-email': '', 'aria-label': emailLabel },
              }),
            )}
            ${reveal(
              shimmerLink({
                href: '#',
                label: 'WhatsApp',
                className: 'w-full contact-intake-link',
                sweepDelay: 0.35,
                extraAttrs: {
                  'data-intake-whatsapp': '',
                  'data-whatsapp-link': '',
                  'aria-label': 'Chat on WhatsApp (opens in a new tab)',
                },
              }),
            )}
            <div class="reveal col-span-2">${shimmerLink({
              href: C.storeHref,
              label: 'Visit Axis-3D Store',
              className: 'w-full contact-intake-link',
              sweepDelay: 0.7,
              extraAttrs: {
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': 'Visit Axis-3D store (opens in a new tab)',
              },
            })}</div>
          </div>
          ${reveal(`<div class="mt-12"><a href="${esc(homeHref)}" class="text-sm font-semibold text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline">← Back to home</a></div>`)}
        </div>
        ${reveal(contactStudioCard(), { variant: 'scale' })}
      </div>
    </section>
  </div>`
}

export function renderGalleryBody(depth) {
  const files = listGalleryImages()
  const cards = files
    .map((name) => {
      const src = asset(depth, `gallery/${name}`)
      const label = name
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      const isVideo = GALLERY_VIDEO_EXT.has(extname(name).toLowerCase())
      const media = isVideo
        ? `<video muted playsinline preload="metadata" src="${esc(src)}#t=0.1"></video><span class="gallery-card__play" aria-hidden="true"></span>`
        : `<img src="${esc(src)}" alt="${esc(label)}" loading="lazy" decoding="async" />`
      return `<figure class="gallery-card">
      <button type="button" class="gallery-card__hit" data-gallery-item data-kind="${isVideo ? 'video' : 'image'}" data-full="${esc(src)}" aria-label="${isVideo ? 'Play' : 'View'} ${esc(label)}">
        ${media}
      </button>
    </figure>`
    })
    .join('')
  const board = files.length
    ? `<div class="gallery-masonry" data-gallery>${cards}</div>`
    : `<p class="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center text-sm leading-relaxed text-slate-500">No photos yet. Add images to the gallery folder and rebuild — they will fill this wall.</p>`
  const lightbox = `<div class="gallery-lightbox" data-gallery-lightbox hidden>
    <button type="button" class="gallery-lightbox__backdrop" data-gallery-close tabindex="-1" aria-label="Close gallery"></button>
    <button type="button" class="gallery-lightbox__close" data-gallery-close aria-label="Close">×</button>
    <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--prev" data-gallery-prev aria-label="Previous image">‹</button>
    <figure class="gallery-lightbox__frame"><img data-gallery-full alt="" /><video data-gallery-video muted controls playsinline hidden></video></figure>
    <button type="button" class="gallery-lightbox__nav gallery-lightbox__nav--next" data-gallery-next aria-label="Next image">›</button>
  </div>`

  return `<div class="min-h-screen bg-surface-light text-slate-900">
    <section class="relative bg-surface-light pb-[clamp(3.5rem,10vw,7rem)] pt-[max(6.5rem,env(safe-area-inset-top)+4rem)] sm:pt-32 md:pt-40">${surfaceAmbientWash()}
      <div class="pointer-events-none absolute inset-0 grid-pulse bg-grid-fine bg-[length:48px_48px]" style="mask-image:radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent 70%);opacity:0.15"></div>
      <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
        ${reveal(`<p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-axis-navy">${esc(C.galleryPage.eyebrow)}</p>`)}
        ${reveal(`<h1 class="mt-5 max-w-3xl font-display text-[clamp(2.1rem,5vw+1rem,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-slate-950">${esc(C.galleryPage.title)}</h1>`)}
        ${reveal(`<p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">${esc(C.galleryPage.sub)}</p>`)}
        <div class="mt-8 h-px max-w-xs bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green sm:mt-10"></div>
        <div class="mt-12 sm:mt-14">${reveal(board)}</div>
      </div>
    </section>
  </div>
  ${lightbox}`
}
