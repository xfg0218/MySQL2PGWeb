<template>
  <NavBar />
  <HeroSection />
  <PainPoints />
  <Comparison />
  <Features />
  <Metrics />
  <FlowSteps />
  <Versions />
  <QuickStart />
  <FooterBar />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import PainPoints from './components/PainPoints.vue'
import Comparison from './components/Comparison.vue'
import Features from './components/Features.vue'
import Metrics from './components/Metrics.vue'
import FlowSteps from './components/FlowSteps.vue'
import Versions from './components/Versions.vue'
import QuickStart from './components/QuickStart.vue'
import FooterBar from './components/FooterBar.vue'

import { useTheme } from './composables/useTheme'
import { useLang } from './composables/useLang'
import { onMounted, watch, nextTick } from 'vue'

useTheme()
const { lang } = useLang()

function setupRevealObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 50)
        obs.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el))
}

onMounted(setupRevealObserver)

watch(lang, () => {
  nextTick(setupRevealObserver)
})
</script>
