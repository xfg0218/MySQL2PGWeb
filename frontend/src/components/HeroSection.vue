<template>
  <section class="hero" id="hero">
    <div class="grid-bg"></div>
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="highlight">MySQL → PostgreSQL</span><br>
        {{ t.hero.titleLine2 }}
      </h1>
      <p class="hero-desc">{{ t.hero.desc }}</p>
      <div class="hero-actions">
        <a href="#quickstart" class="btn-primary btn-lg" @click="trackClick('quick_start')">{{ t.hero.quickStart }}</a>
        <a href="https://github.com/xfg0218/MySQL2PG" target="_blank" rel="noopener noreferrer" class="btn-ghost btn-lg" @click="trackClick('github')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.43 9.64 8.21 11.21.6.11.82-.26.82-.57v-2.01c-3.34.72-4.04-1.61-4.04-1.61-.55-1.37-1.33-1.74-1.33-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.69.82.57C20.57 21.93 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z"/></svg>
          {{ t.hero.github }}
        </a>
      </div>
      <div class="hero-stats">
        <div class="stat-item" v-for="s in t.hero.stats" :key="s.label">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
import { trackClick } from '../composables/useTracker'
const { t } = useLang()
</script>
