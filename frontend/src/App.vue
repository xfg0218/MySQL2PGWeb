<template>
  <NavBar />
  <router-view />
  <FooterBar />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import { useTheme } from './composables/useTheme'
import { useLang } from './composables/useLang'
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

useTheme()
const { lang } = useLang()
const route = useRoute()

let revealObs = null
let mutationObs = null

function observeReveal(el) {
  if (el && !el.classList.contains('visible') && !el._revealObserved) {
    el._revealObserved = true
    revealObs.observe(el)
  }
}

function setupReveal() {
  if (!revealObs) {
    revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          revealObs.unobserve(e.target)
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' })
  }

  document.querySelectorAll('.reveal:not(.visible)').forEach(observeReveal)

  if (!mutationObs) {
    mutationObs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue
          if (node.classList?.contains('reveal')) observeReveal(node)
          node.querySelectorAll?.('.reveal:not(.visible)').forEach(observeReveal)
        }
      }
    })
    mutationObs.observe(document.body, { childList: true, subtree: true })
  }
}

onMounted(() => {
  setupReveal()
  // Fallback: if reveal elements are still hidden after 2s, force-show them
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible')
    })
  }, 2000)
})

onUnmounted(() => {
  revealObs?.disconnect()
  mutationObs?.disconnect()
})

watch(lang, () => {
  nextTick(setupReveal)
})

watch(() => route.path, () => {
  nextTick(() => {
    window.scrollTo(0, 0)
    nextTick(setupReveal)
  })
})
</script>
