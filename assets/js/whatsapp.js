/**
 * Consumer WhatsApp links — Android intent targets com.whatsapp (not Business).
 */
const WA_MESSAGE =
  'Hello Axis-3D Lab, I would like to discuss a fabrication / 3D printing project.'
const PHONE_DIGITS = '916383860114'
const CONSUMER_PACKAGE = 'com.whatsapp'

export function contactWhatsAppHref() {
  const text = encodeURIComponent(WA_MESSAGE)
  const waWeb = `https://wa.me/${PHONE_DIGITS}?text=${text}`

  if (/Android/i.test(navigator.userAgent)) {
    const fallback = encodeURIComponent(waWeb)
    return `intent://send?phone=${PHONE_DIGITS}&text=${text}#Intent;scheme=whatsapp;package=${CONSUMER_PACKAGE};S.browser_fallback_url=${fallback};end`
  }
  return waWeb
}

export function applyWhatsAppLinks() {
  const href = contactWhatsAppHref()
  const isAndroid = /Android/i.test(navigator.userAgent)

  document.querySelectorAll('[data-whatsapp-link]').forEach((el) => {
    el.setAttribute('href', href)
    if (isAndroid) {
      el.removeAttribute('target')
    } else {
      el.setAttribute('target', '_blank')
      el.setAttribute('rel', 'noopener noreferrer')
    }
  })
}
