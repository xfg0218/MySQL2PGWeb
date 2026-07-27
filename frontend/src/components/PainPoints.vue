<template>
  <section class="section section-alt" id="pain">
    <div class="section-inner">
      <div class="section-tag">{{ t.pain.tag }}</div>
      <h2 class="section-title">{{ t.pain.title }}</h2>
      <p class="section-desc">{{ t.pain.desc }}</p>
      <div class="pain-grid">
        <div class="pain-card reveal" v-for="item in t.pain.items" :key="item.title">
          <div class="pain-card-icon">{{ item.icon }}</div>
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
