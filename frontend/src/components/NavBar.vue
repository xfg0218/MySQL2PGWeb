<template>
  <nav class="navbar" aria-label="Main navigation">
    <div class="navbar-logo">
      <img src="../assets/logo.svg" alt="MySQL2PG" class="logo-img" />
      <span class="logo-text">MySQL<span class="logo-highlight">2</span>PG</span>
    </div>
    <ul class="navbar-links">
      <li><RouterLink :to="{ path: '/', hash: '#pain' }">{{ t.nav.pain }}</RouterLink></li>
      <li><RouterLink :to="{ path: '/', hash: '#features' }">{{ t.nav.features }}</RouterLink></li>
      <li><RouterLink :to="{ path: '/', hash: '#architecture' }">{{ t.nav.architecture }}</RouterLink></li>
      <li><RouterLink :to="{ path: '/', hash: '#sqldemo' }">SQL</RouterLink></li>
      <li><RouterLink to="/services">{{ t.nav.services }}</RouterLink></li>
      <li><RouterLink to="/contact">{{ t.nav.contact }}</RouterLink></li>
      <li><RouterLink to="/manual">{{ t.nav.manual }}</RouterLink></li>
    </ul>
    <div class="navbar-actions">
      <button class="btn-ghost btn-toggle" @click="toggleLang" :aria-label="lang === 'zh' ? 'Switch to English' : '切换到中文'">
        {{ lang === 'zh' ? 'EN' : '中' }}
      </button>
      <button class="btn-ghost btn-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ theme === 'dark' ? '☀️' : '🌙' }}
      </button>
      <a href="https://github.com/xfg0218/MySQL2PG" target="_blank" rel="noopener noreferrer" class="btn-ghost btn-github-desktop" @click="trackClick('github')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.43 9.64 8.21 11.21.6.11.82-.26.82-.57v-2.01c-3.34.72-4.04-1.61-4.04-1.61-.55-1.37-1.33-1.74-1.33-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.82.57C20.57 21.93 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z"/></svg>
        GitHub
      </a>
      <RouterLink :to="{ path: '/', hash: '#quickstart' }" class="btn-primary btn-cta-desktop" @click="trackClick('quick_start')">{{ t.nav.quickStartBtn }}</RouterLink>
      <button class="btn-hamburger" @click="mobileOpen = !mobileOpen" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'" :aria-expanded="mobileOpen">
        <span :class="['hamburger-line', { open: mobileOpen }]"></span>
        <span :class="['hamburger-line', { open: mobileOpen }]"></span>
        <span :class="['hamburger-line', { open: mobileOpen }]"></span>
      </button>
    </div>
  </nav>
  <!-- Mobile menu overlay -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="mobile-overlay" @click.self="mobileOpen = false" role="dialog" aria-modal="true" aria-label="Navigation menu" @keydown.escape="mobileOpen = false" ref="mobileMenuRef">
        <div class="mobile-menu">
          <RouterLink :to="{ path: '/', hash: '#pain' }" @click="mobileOpen = false">{{ t.nav.pain }}</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#features' }" @click="mobileOpen = false">{{ t.nav.features }}</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#architecture' }" @click="mobileOpen = false">{{ t.nav.architecture }}</RouterLink>
          <RouterLink :to="{ path: '/', hash: '#sqldemo' }" @click="mobileOpen = false">SQL</RouterLink>
          <RouterLink to="/services" @click="mobileOpen = false">{{ t.nav.services }}</RouterLink>
          <RouterLink to="/contact" @click="mobileOpen = false">{{ t.nav.contact }}</RouterLink>
          <RouterLink to="/manual" @click="mobileOpen = false">{{ t.nav.manual }}</RouterLink>
          <div class="mobile-menu-divider"></div>
          <a href="https://github.com/xfg0218/MySQL2PG" target="_blank" rel="noopener noreferrer" class="mobile-menu-gh" @click="trackClick('github')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.43 9.64 8.21 11.21.6.11.82-.26.82-.57v-2.01c-3.34.72-4.04-1.61-4.04-1.61-.55-1.37-1.33-1.74-1.33-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.82.57C20.57 21.93 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z"/></svg>
            GitHub
          </a>
          <RouterLink :to="{ path: '/', hash: '#quickstart' }" class="btn-primary mobile-menu-cta" @click="mobileOpen = false; trackClick('quick_start')">{{ t.nav.quickStartBtn }}</RouterLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { useLang } from '../composables/useLang'
import { trackClick } from '../composables/useTracker'

const { theme, toggleTheme } = useTheme()
const { lang, t, toggleLang } = useLang()

const mobileOpen = ref(false)
const mobileMenuRef = ref(null)
const route = useRoute()

watch(() => route.path, () => { mobileOpen.value = false })

watch(mobileOpen, (open) => {
  if (open) {
    nextTick(() => {
      const firstLink = mobileMenuRef.value?.querySelector('a')
      firstLink?.focus()
    })
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>
