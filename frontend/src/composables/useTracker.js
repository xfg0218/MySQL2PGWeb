import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

let sessionId = sessionStorage.getItem('mysql2pg-sid')
if (!sessionId) {
  sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)
  sessionStorage.setItem('mysql2pg-sid', sessionId)
}

let pageStart = 0

function send(payload) {
  const data = JSON.stringify({ ...payload, session_id: sessionId })
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([data], { type: 'application/json' }))
  } else {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true }).catch(() => {})
  }
}

export function trackClick(action) {
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
  }

  function onPageLeave() {
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
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    onPageLeave()
    window.removeEventListener('beforeunload', onPageLeave)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { trackClick }
}
