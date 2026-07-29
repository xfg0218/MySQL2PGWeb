<template>
  <section class="section" id="faq">
    <div class="section-inner">
      <template v-if="!standalone">
        <div class="section-tag" v-if="t.faq.tag">{{ t.faq.tag }}</div>
        <h2 class="section-title">{{ t.faq.title }}</h2>
        <p class="section-desc">{{ t.faq.desc }}</p>
      </template>
      <div class="faq-list">
        <details
          v-for="(item, i) in t.faq.items"
          :key="i"
          class="faq-item reveal"
          :open="openIndex === i"
          @toggle="onToggle(i, $event)"
        >
          <summary class="faq-question" @click.prevent="toggle(i)">
            <span class="faq-q-badge">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="faq-q-text">{{ item.q }}</span>
            <span class="faq-arrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </summary>
          <div class="faq-answer">
            <div class="faq-answer-inner">
              <div class="faq-a-label">A</div>
              <div class="faq-a-text">{{ item.a }}</div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useLang } from '../composables/useLang'
defineProps({ standalone: Boolean })
const { t } = useLang()

const openIndex = ref(-1)

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}

function onToggle(i, event) {
  if (!event.target.open && openIndex.value === i) {
    openIndex.value = -1
  }
}
</script>
