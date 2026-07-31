<template>
  <section class="section section-alt" id="quickstart">
    <div class="section-inner">
      <div class="section-tag" v-if="t.quickstart.tag">{{ t.quickstart.tag }}</div>
      <h2 class="section-title">{{ t.quickstart.title }}</h2>
      <p class="section-desc"></p>
      <div class="qs-grid">
        <div class="qs-card reveal" v-for="(step, idx) in t.quickstart.steps" :key="step.num">
          <div class="qs-card-header">
            <div class="qs-step-num">{{ step.num }}</div>
            <h4>{{ step.title }}</h4>
          </div>
          <pre v-html="step.code"></pre>
          <button class="code-copy-btn" :class="{ copied: copyState[idx] }" @click="copyCode(idx, step.code)" :aria-label="copyState[idx] ? 'Copied' : 'Copy code'">{{ copyState[idx] ? '✓' : 'Copy' }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useLang } from '../composables/useLang'
const { t } = useLang()
const copyState = reactive({})

function copyCode(idx, html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const plain = tmp.textContent || tmp.innerText
  navigator.clipboard.writeText(plain).then(() => {
    copyState[idx] = true
    setTimeout(() => { copyState[idx] = false }, 2000)
  }).catch(() => {})
}
</script>
