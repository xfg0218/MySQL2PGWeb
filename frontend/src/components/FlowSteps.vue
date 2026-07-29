<template>
  <section class="section section-alt" id="flow">
    <div class="section-inner">
      <div class="section-tag" v-if="t.flow.tag">{{ t.flow.tag }}</div>
      <h2 class="section-title">{{ t.flow.title }}</h2>
      <p class="section-desc">{{ t.flow.desc }}</p>
      <div class="flow-card-grid">
        <div class="flow-card reveal" v-for="step in t.flow.steps" :key="step.num">
          <div class="flow-card-num">{{ step.num }}</div>
          <h4 class="flow-card-title">{{ step.title }}</h4>
          <p class="flow-card-desc">{{ step.desc }}</p>
          <div class="flow-card-tags">
            <span class="flow-tag" v-for="tag in step.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="flow-summary reveal">
        <div class="flow-summary-item" v-for="s in t.flow.summary" :key="s.label">
          <span class="flow-summary-num">{{ s.num }}</span>
          <span class="flow-summary-label">{{ s.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
