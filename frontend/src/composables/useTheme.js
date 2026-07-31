import { ref } from 'vue'

function getInitialTheme() {
  const stored = localStorage.getItem('mysql2pg-theme')
  if (stored) return stored
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

const theme = ref(getInitialTheme())

function applyTheme(t) {
  document.documentElement.classList.toggle('light', t === 'light')
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = t === 'light' ? '#ffffff' : '#09090b'
}

applyTheme(theme.value)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('mysql2pg-theme', theme.value)
  applyTheme(theme.value)
}

export function useTheme() {
  return { theme, toggleTheme }
}
