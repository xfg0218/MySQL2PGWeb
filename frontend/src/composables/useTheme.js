import { ref } from 'vue'

const theme = ref(localStorage.getItem('mysql2pg-theme') || 'dark')

function applyTheme(t) {
  document.documentElement.classList.toggle('light', t === 'light')
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
