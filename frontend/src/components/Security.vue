<template>
  <section class="section" id="security">
    <div class="section-inner">
      <div class="section-tag">{{ t.security.tag }}</div>
      <h2 class="section-title">{{ t.security.title }}</h2>
      <p class="section-desc">{{ t.security.desc }}</p>
      <div class="sec-grid">
        <div
          class="sec-card reveal"
          v-for="item in t.security.items"
          :key="item.title"
        >
          <div class="sec-icon">{{ item.icon }}</div>
          <h4 class="sec-title">{{ item.title }}</h4>
          <p class="sec-desc">{{ item.desc }}</p>
        </div>
      </div>
      <div class="sec-summary reveal">
        <span class="sec-summary-icon">🛡</span>
        <span>{{ t.security.summary }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
