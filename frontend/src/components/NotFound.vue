<template>
  <section class="notfound">
    <div class="notfound-inner">
      <div class="notfound-code">404</div>
      <h1 class="notfound-title">{{ t.notFound.title }}</h1>
      <p class="notfound-desc">{{ t.notFound.desc }}</p>
      <div class="notfound-actions">
        <RouterLink to="/" class="btn-primary btn-lg">{{ t.notFound.backHome }}</RouterLink>
        <RouterLink to="/manual" class="btn-ghost btn-lg">{{ t.notFound.goFaq }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
