<template>
  <div class="page-view">
    <section class="page-hero">
      <div class="section-inner">
        <div class="section-tag">{{ t.contact.tag }}</div>
        <h1 class="page-hero-title">{{ t.contact.title }}</h1>
        <p class="page-hero-desc">{{ t.contact.desc }}</p>
        <div class="page-hero-actions">
          <RouterLink to="/" class="btn-ghost">&#8592; {{ t.nav.backHome }}</RouterLink>
        </div>
      </div>
    </section>
    <Contact standalone />
  </div>
</template>

<script setup>
import { useLang } from '../composables/useLang'
import Contact from '../components/Contact.vue'
const { t } = useLang()
</script>
