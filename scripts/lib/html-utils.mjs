/** Escape HTML entities in text content. */
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Asset URL prefix: depth 0 = site root, 1 = one folder deep (works/, about/, contact/). */
export function base(depth) {
  return depth === 0 ? '' : '../'
}

export function asset(depth, path) {
  return `${base(depth)}assets/images/${path}`
}

export function css(depth, file) {
  return `${base(depth)}assets/css/${file}`
}

export function js(depth, file) {
  return `${base(depth)}assets/js/${file}`
}

export function page(depth, segment) {
  if (!segment || segment === 'home') return `${base(depth)}index.html`
  return `${base(depth)}${segment}/index.html`
}

export function favicon(depth) {
  return `${base(depth)}favicon.svg`
}
