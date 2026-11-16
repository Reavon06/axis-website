/**
 * Bootstraps site-wide behavior. Load on every page after DOM ready.
 */
import { initNav } from './nav.js'
import { initReveal } from './reveal.js'
import { initReducedMotion } from './motion-prefs.js'
import { applyWhatsAppLinks } from './whatsapp.js'

function boot() {
  initReducedMotion()
  initNav()
  initReveal()
  applyWhatsAppLinks()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
