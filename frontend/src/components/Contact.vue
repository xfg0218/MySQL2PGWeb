<template>
  <section class="section" id="contact">
    <div class="section-inner">
      <template v-if="!standalone">
        <div class="section-tag" v-if="t.contact.tag">{{ t.contact.tag }}</div>
        <h2 class="section-title">{{ t.contact.title }}</h2>
        <p class="section-desc">{{ t.contact.desc }}</p>
      </template>

      <div class="contact-grid">
        <div class="contact-card reveal" v-for="ch in t.contact.channels" :key="ch.title">
          <div class="contact-card-icon">{{ ch.icon }}</div>
          <h4>{{ ch.title }}</h4>
          <p>{{ ch.desc }}</p>
          <a v-if="ch.link" :href="ch.link" class="contact-link" :target="ch.external ? '_blank' : '_self'" :rel="ch.external ? 'noopener noreferrer' : undefined">
            {{ ch.linkText }}
            <span class="contact-link-arrow" v-if="ch.external">&#8599;</span>
          </a>
          <button v-else-if="ch.copy" class="contact-link contact-copy-btn" @click="copyToClipboard(ch.copy)">
            {{ copied ? t.contact.copied : ch.linkText }}
            <span class="contact-link-arrow">{{ copied ? '&#10003;' : '&#128203;' }}</span>
          </button>
          <span v-else class="contact-placeholder">{{ ch.linkText }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useLang } from '../composables/useLang'
defineProps({
  standalone: { type: Boolean, default: false }
})
const { t } = useLang()
const copied = ref(false)
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
