<template>
  <section class="section" id="faq">
    <div class="section-inner">
      <template v-if="!standalone">
        <div class="section-tag" v-if="t.faq.tag">{{ t.faq.tag }}</div>
        <h2 class="section-title">{{ t.faq.title }}</h2>
        <p class="section-desc">{{ t.faq.desc }}</p>
      </template>

      <!-- Search -->
      <div class="faq-search">
        <svg class="faq-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="faq-search-input"
          :placeholder="t.faq.searchPlaceholder"
        />
        <button v-if="searchQuery" class="faq-search-clear" @click="searchQuery = ''">&times;</button>
      </div>

      <!-- Category tabs -->
      <div class="faq-tabs">
        <button
          :class="['faq-tab', { active: activeCat === null }]"
          @click="activeCat = null"
        >
          {{ t.faq.allLabel }}
          <span class="faq-tab-count">{{ t.faq.items.length }}</span>
        </button>
        <button
          v-for="cat in t.faq.categories"
          :key="cat.key"
          :class="['faq-tab', { active: activeCat === cat.key }]"
          @click="activeCat = activeCat === cat.key ? null : cat.key"
        >
          <span class="faq-tab-icon">{{ cat.icon }}</span>
          {{ cat.label }}
          <span class="faq-tab-count">{{ catCount(cat.key) }}</span>
        </button>
      </div>

      <!-- FAQ list -->
      <div class="faq-list" v-if="filteredItems.length">
        <details
          v-for="(item, i) in filteredItems"
          :key="item.q"
          class="faq-item reveal"
          :open="openIndex === i"
          @toggle="onToggle(i, $event)"
        >
          <summary class="faq-question" @click.prevent="toggle(i)">
            <span class="faq-q-badge">{{ catIcon(item.cat) }}</span>
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

      <!-- No results -->
      <div v-else class="faq-no-results">
        <span class="faq-no-results-icon">🔍</span>
        <p>{{ t.faq.noResults }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLang } from '../composables/useLang'
defineProps({ standalone: Boolean })
const { t } = useLang()

const openIndex = ref(-1)
const activeCat = ref(null)
const searchQuery = ref('')

const filteredItems = computed(() => {
  let items = t.value.faq.items
  if (activeCat.value) {
    items = items.filter(item => item.cat === activeCat.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    items = items.filter(item =>
      item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    )
  }
  return items
})

function catCount(key) {
  return t.value.faq.items.filter(item => item.cat === key).length
}

function catIcon(key) {
  const cat = t.value.faq.categories.find(c => c.key === key)
  return cat ? cat.icon : '❓'
}

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i
}

function onToggle(i, event) {
  if (!event.target.open && openIndex.value === i) {
    openIndex.value = -1
  }
}
</script>
