<template>
  <section class="section section-alt" id="assessment">
    <div class="section-inner">
      <div class="section-tag">{{ t.assessment.tag }}</div>
      <h2 class="section-title">{{ t.assessment.title }}</h2>
      <p class="section-desc">{{ t.assessment.desc }}</p>
      <div class="assess-grid">
        <div
          class="assess-card reveal"
          :class="cat.color"
          v-for="cat in t.assessment.categories"
          :key="cat.title"
        >
          <div class="assess-card-header">
            <div class="assess-card-icon">{{ cat.icon }}</div>
            <div class="assess-card-score">{{ cat.score }}</div>
          </div>
          <h4>{{ cat.title }}</h4>
          <ul class="assess-card-items">
            <li v-for="item in cat.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
