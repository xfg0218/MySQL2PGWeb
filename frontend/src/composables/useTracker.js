import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

let sessionId = sessionStorage.getItem('mysql2pg-sid')
if (!sessionId) {
  sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)
  sessionStorage.setItem('mysql2pg-sid', sessionId)
}

let pageStart = 0
let maxScrollDepth = 0

function getUTM() {
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source') || '',
    utm_medium: p.get('utm_medium') || '',
    utm_campaign: p.get('utm_campaign') || '',
  }
}

function getClientMeta() {
  return {
    screen: screen.width + 'x' + screen.height,
    viewport: window.innerWidth + 'x' + window.innerHeight,
    lang: navigator.language || '',
    scroll_depth: maxScrollDepth,
    ...getUTM(),
  }
}

function send(payload) {
  const data = JSON.stringify({ session_id: sessionId, ...getClientMeta(), ...payload })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([data], { type: 'application/json' }))
  } else {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true }).catch(() => {})
  }
}

function updateScrollDepth() {
  const docH = document.documentElement.scrollHeight - window.innerHeight
  if (docH <= 0) { maxScrollDepth = 100; return }
  const pct = Math.round((window.scrollY / docH) * 100)
  if (pct > maxScrollDepth) maxScrollDepth = pct
}

export function trackClick(action) {
  updateScrollDepth()
  send({
    event: 'click',
    action,
    page: window.location.pathname + window.location.hash,
    page_duration_ms: Date.now() - pageStart,
  })
}

export function useTracker() {
  const route = useRoute()

  function onPageEnter() {
    pageStart = Date.now()
    maxScrollDepth = 0
  }

  function onPageLeave() {
    updateScrollDepth()
    const dur = Date.now() - pageStart
    if (dur > 0) {
      send({
        event: 'page_leave',
        page: route.path,
        page_duration_ms: dur,
      })
    }
  }

  function onVisibility() {
    if (document.visibilityState === 'hidden') {
      onPageLeave()
    } else {
      pageStart = Date.now()
    }
  }

  onMounted(() => {
    onPageEnter()
    window.addEventListener('beforeunload', onPageLeave)
    window.addEventListener('scroll', updateScrollDepth, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    onPageLeave()
    window.removeEventListener('beforeunload', onPageLeave)
    window.removeEventListener('scroll', updateScrollDepth)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  watch(() => route.path, () => {
    onPageLeave()
    onPageEnter()
  })

  return { trackClick }
}
