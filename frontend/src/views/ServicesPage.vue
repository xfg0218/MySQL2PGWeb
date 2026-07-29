<template>
  <div class="page-view">
    <section class="page-hero">
      <div class="section-inner">
        <div class="section-tag">{{ t.services.tag }}</div>
        <h1 class="page-hero-title">{{ t.services.title }}</h1>
        <p class="page-hero-desc">{{ t.services.desc }}</p>
        <div class="page-hero-actions">
          <RouterLink to="/" class="btn-ghost">&#8592; {{ t.nav.backHome }}</RouterLink>
          <RouterLink to="/contact" class="btn-primary">{{ t.services.commercial.btn }}</RouterLink>
        </div>
      </div>
    </section>
    <Services standalone />
  </div>
</template>

<script setup>
import { useLang } from '../composables/useLang'
import Services from '../components/Services.vue'
const { t } = useLang()
</script>
