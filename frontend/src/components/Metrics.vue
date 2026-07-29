<template>
  <section class="section" id="metrics">
    <div class="section-inner">
      <div class="section-tag" v-if="t.metrics.tag">{{ t.metrics.tag }}</div>
      <h2 class="section-title">{{ t.metrics.title }}</h2>
      <p class="section-desc"></p>
      <div class="metrics-grid">
        <div class="metric-box reveal" v-for="m in t.metrics.items" :key="m.label">
          <div class="metric-value"
               :data-target="m.target"
               :data-suffix="m.suffix"
               :data-decimal="m.decimal || 0"
               :data-done="false">0</div>
          <div class="metric-label">{{ m.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
import { onMounted, watch, nextTick } from 'vue'

const { lang, t } = useLang()

function setupCounterObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target
        if (el.dataset.done === 'true') return
        el.dataset.done = 'true'
        const target = parseFloat(el.dataset.target)
        const suffix = el.dataset.suffix || ''
        const decimal = parseInt(el.dataset.decimal) || 0
        let current = 0
        const step = target / 60
        const timer = setInterval(() => {
          current += step
          if (current >= target) { current = target; clearInterval(timer) }
          el.textContent = (decimal ? current.toFixed(decimal) : Math.floor(current)) + suffix
        }, 25)
        obs.unobserve(el)
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('.metric-value[data-done="false"]').forEach(el => obs.observe(el))
}

onMounted(setupCounterObserver)

watch(lang, () => {
  nextTick(() => {
    document.querySelectorAll('.metric-value').forEach(el => {
      el.dataset.done = 'false'
      el.textContent = '0'
    })
    setupCounterObserver()
  })
})
</script>
