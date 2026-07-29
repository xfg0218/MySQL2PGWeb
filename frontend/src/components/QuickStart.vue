<template>
  <section class="section section-alt" id="quickstart">
    <div class="section-inner">
      <div class="section-tag" v-if="t.quickstart.tag">{{ t.quickstart.tag }}</div>
      <h2 class="section-title">{{ t.quickstart.title }}</h2>
      <p class="section-desc"></p>
      <div class="qs-grid">
        <div class="qs-card reveal" v-for="step in t.quickstart.steps" :key="step.num">
          <div class="qs-card-header">
            <div class="qs-step-num">{{ step.num }}</div>
            <h4>{{ step.title }}</h4>
          </div>
          <pre v-html="step.code"></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
