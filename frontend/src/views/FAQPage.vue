<template>
  <div class="page-view">
    <section class="page-hero">
      <div class="section-inner">
        <div class="section-tag" v-if="t.faq.tag">{{ t.faq.tag }}</div>
        <h1 class="page-hero-title">{{ t.faq.title }}</h1>
        <p class="page-hero-desc">{{ t.faq.desc }}</p>
        <div class="page-hero-actions">
          <RouterLink to="/" class="btn-ghost">&#8592; {{ t.nav.backHome }}</RouterLink>
        </div>
      </div>
    </section>
    <FAQ standalone />
  </div>
</template>

<script setup>
import { useLang } from '../composables/useLang'
import FAQ from '../components/FAQ.vue'
const { t } = useLang()
</script>
