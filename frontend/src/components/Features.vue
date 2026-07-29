<template>
  <section class="section section-alt" id="features">
    <div class="section-inner">
      <div class="section-tag" v-if="t.features.tag">{{ t.features.tag }}</div>
      <h2 class="section-title">{{ t.features.title }}</h2>
      <p class="section-desc">{{ t.features.desc }}</p>
      <div class="feat-grid">
        <div class="feat-card reveal" v-for="f in t.features.items" :key="f.title">
          <div class="feat-card-icon">{{ f.icon }}</div>
          <h4>{{ f.title }}</h4>
          <p>{{ f.desc }}</p>
          <div class="feat-metric">{{ f.metric }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
