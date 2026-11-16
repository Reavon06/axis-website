import { esc, asset, css, js, page, favicon } from './html-utils.mjs'
import { site, footer, navItems, mailto } from './content.mjs'

export function renderHead({ depth, title, extraScripts = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#F5F7FA" />
  <title>${esc(title)}</title>
  <link rel="icon" type="image/svg+xml" href="${favicon(depth)}" />
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin />
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${css(depth, 'main.css')}" />
  <link rel="stylesheet" href="${css(depth, 'animations.css')}" />
  ${extraScripts}
</head>`
}

export function renderNav({ depth, active }) {
  const desktopLink = (item) => {
    if (item.external) {
      return `<a href="${esc(item.href)}" target="_blank" rel="noopener noreferrer" class="nav-link" data-nav-link data-nav-external data-nav-id="store">${esc(item.label)}</a>`
    }
    const isActive = active === item.href
    const cls = isActive ? 'nav-link nav-link-active' : 'nav-link'
    const aria = isActive ? ' aria-current="page"' : ''
    return `<a href="${page(depth, item.href)}" class="${cls}" data-nav-link data-nav-id="${esc(item.href)}"${aria}>${esc(item.label)}</a>`
  }
  const mobileLink = (item) => {
    if (item.external) {
      return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="mobile-nav-liquid-tile block w-full rounded-full px-5 py-3.5 text-center text-[1.25rem] font-semibold leading-snug tracking-tight text-slate-950 sm:py-4 sm:text-[1.35rem] active:scale-[0.99]">${esc(item.label)}</a>`
    }
    const isActive = active === item.href
    const tile = isActive ? 'mobile-nav-liquid-tile-active' : 'mobile-nav-liquid-tile'
    const text = isActive ? 'text-axis-navy' : 'text-slate-950'
    return `<a href="${page(depth, item.href)}" class="${tile} block w-full rounded-full px-5 py-3.5 text-center text-[1.25rem] font-semibold leading-snug tracking-tight ${text} sm:py-4 sm:text-[1.35rem] active:scale-[0.99]">${esc(item.label)}</a>`
  }

  return `
  <header data-site-nav class="site-header fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-5 md:px-10">
    <nav data-nav-pill class="nav-pill mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5 md:gap-6 md:px-6">
      <a href="${page(depth, 'home')}" class="flex min-w-0 shrink-0 items-center py-1">
        <img src="${asset(depth, 'logo-placeholder.png')}" alt="" class="h-6 w-28 object-contain opacity-90 sm:w-32 md:h-7 md:w-40" width="160" height="28" />
        <span class="sr-only">${esc(site.name)}</span>
      </a>
      <ul data-nav-links class="scrollbar-none relative hidden min-w-0 flex-1 items-center justify-center gap-6 overflow-x-auto md:flex lg:gap-8">
        <span data-nav-indicator class="nav-link-indicator" aria-hidden="true"></span>
        ${navItems.map((item) => `<li class="relative z-[1] shrink-0">${desktopLink(item)}</li>`).join('')}
      </ul>
      <div class="flex shrink-0 items-center gap-2 sm:gap-3">
        <a href="${page(depth, 'contact')}" data-nav-cta-desktop class="hidden rounded-full bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green px-4 py-2 text-[12px] font-semibold text-white shadow-glow-sm transition hover:-translate-y-0.5 hover:shadow-lift md:inline-flex sm:px-5 sm:text-[13px]">Start a Project</a>
        <button type="button" data-nav-toggle class="flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-white/80 text-slate-900 shadow-sm backdrop-blur-md md:hidden" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
          <span class="hamburger relative flex h-5 w-6 flex-col justify-center" aria-hidden>
            <span class="hamburger-line block h-0.5 w-full rounded-full bg-slate-800" style="transform:translateY(-5px)"></span>
            <span class="hamburger-line absolute block h-0.5 w-full rounded-full bg-slate-800"></span>
            <span class="hamburger-line block h-0.5 w-full rounded-full bg-slate-800" style="transform:translateY(5px)"></span>
          </span>
        </button>
      </div>
    </nav>
  </header>`
}

/** Mobile drawer lives outside the fixed header so panel transforms do not break iOS fixed positioning. */
export function renderMobileNav({ depth, active }) {
  const mobileLink = (item) => {
    if (item.external) {
      return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="mobile-nav-liquid-tile block w-full rounded-full px-5 py-3.5 text-center text-[1.25rem] font-semibold leading-snug tracking-tight text-slate-950 sm:py-4 sm:text-[1.35rem] active:scale-[0.99]">${esc(item.label)}</a>`
    }
    const isActive = active === item.href
    const tile = isActive ? 'mobile-nav-liquid-tile-active' : 'mobile-nav-liquid-tile'
    const text = isActive ? 'text-axis-navy' : 'text-slate-950'
    return `<a href="${page(depth, item.href)}" class="${tile} block w-full rounded-full px-5 py-3.5 text-center text-[1.25rem] font-semibold leading-snug tracking-tight ${text} sm:py-4 sm:text-[1.35rem] active:scale-[0.99]">${esc(item.label)}</a>`
  }

  return `
  <button type="button" data-nav-backdrop class="mobile-nav-backdrop fixed inset-0 z-[100] bg-slate-950/45 md:hidden" aria-label="Close menu"></button>
  <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site navigation" class="mobile-nav-liquid-shell mobile-nav-panel fixed inset-x-0 bottom-0 top-0 z-[101] flex max-h-[100dvh] flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden transform-gpu will-change-transform">
    <div class="flex items-center justify-between border-b border-white/35 py-4">
      <span class="text-base font-semibold tracking-wide text-slate-900/90">Menu</span>
      <button type="button" data-nav-toggle class="mobile-nav-liquid-tile flex h-12 min-w-[3rem] items-center justify-center rounded-full text-3xl leading-none text-slate-800 active:scale-95" aria-label="Close menu">×</button>
    </div>
    <nav class="flex flex-1 flex-col justify-center gap-3 overflow-y-auto py-8">
      ${navItems.map((item) => mobileLink(item)).join('')}
    </nav>
    <div class="border-t border-white/35 pt-5">
      <a href="${page(depth, 'contact')}" class="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-axis-navy via-axis-cyan to-axis-green py-4 text-base font-semibold text-white shadow-[0_4px_24px_-6px_rgba(37,42,127,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-white/25 sm:text-lg">Start a Project</a>
    </div>
  </div>`
}

export function renderFooter({ depth }) {
  const footLink = (item) => {
    if (item.external) {
      return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="text-slate-600 transition hover:text-slate-950">${esc(item.label)}</a>`
    }
    return `<a href="${page(depth, item.href)}" class="text-slate-600 transition hover:text-slate-950">${esc(item.label)}</a>`
  }
  return `
  <footer id="footer" class="border-t border-slate-200/90 bg-white py-10 text-slate-600 sm:py-14">
    <div class="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 sm:gap-10 sm:px-5 md:flex-row md:items-start md:px-10">
      <div class="text-center md:text-left">
        <p class="font-display text-lg font-semibold text-slate-950">${esc(site.name)}</p>
        <p class="mt-2 text-sm">${esc(footer.address)}</p>
        <a href="${mailto}" class="mt-2 inline-block text-sm font-medium text-axis-navy hover:underline">${esc(footer.email)}</a>
        <a href="tel:${footer.phoneTel}" class="mt-1 block text-sm font-medium text-axis-navy hover:underline">${esc(footer.phone)}</a>
      </div>
      <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm md:justify-end">
        ${navItems.map(footLink).join('')}
      </nav>
      <p class="text-center text-xs text-slate-500 md:max-w-xs md:text-right">© ${footer.year} ${esc(site.legalName)}. All rights reserved.</p>
    </div>
  </footer>`
}

export function renderWaFloat() {
  return `
  <a data-whatsapp-link href="#" class="wa-float group fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_-4px_rgba(37,211,102,0.55)] ring-2 ring-white/90 transition hover:bg-[#20bd5a] hover:shadow-[0_6px_28px_-4px_rgba(37,211,102,0.6)] active:scale-[0.97] sm:h-[3.75rem] sm:w-[3.75rem]" style="bottom:max(1.1rem,env(safe-area-inset-bottom));right:max(1.1rem,env(safe-area-inset-right))" aria-label="Chat on WhatsApp">
    <span class="wa-float-ring pointer-events-none absolute inset-0 rounded-full" style="box-shadow:inset 0 0 0 1px rgba(255,255,255,0.35)" aria-hidden></span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9" aria-hidden><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>`
}

/** Plain scripts only — works when opening HTML directly (file://), no npm or server. */
export function renderScripts({ depth, includeThree = false }) {
  const prefix = depth === 0 ? '' : '../'
  const three = includeThree
    ? `<script src="${prefix}assets/js/vendor/three.min.js"></script>\n  `
    : ''
  return `  ${three}<script src="${prefix}assets/js/site.js"></script>`
}

export function layoutPage({ depth, active, title, body, extraScripts = '', includeThree = false }) {
  return `${renderHead({ depth, title, extraScripts })}
<body class="min-h-screen">
${renderNav({ depth, active })}
${renderMobileNav({ depth, active })}
<main>
${body}
</main>
${renderFooter({ depth })}
${renderWaFloat()}
${renderScripts({ depth, includeThree })}
</body>
</html>`
}
