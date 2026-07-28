<template>
  <section class="section" id="faq">
    <div class="section-inner">
      <div class="section-tag">{{ t.faq.tag }}</div>
      <h2 class="section-title">{{ t.faq.title }}</h2>
      <p class="section-desc">{{ t.faq.desc }}</p>
      <div class="faq-list">
        <div
          class="faq-item"
          :class="{ open: openIndex === i }"
          v-for="(item, i) in t.faq.items"
          :key="i"
        >
          <button class="faq-question" @click="toggle(i)">
            <span>{{ item.q }}</span>
            <span class="faq-arrow">▼</span>
          </button>
          <div class="faq-answer">
            <div class="faq-answer-inner">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useLang } from '../composables/useLang'
const { t } = useLang()
const openIndex = ref(-1)
function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}
</script>
