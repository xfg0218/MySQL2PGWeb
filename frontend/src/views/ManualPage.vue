<template>
  <div class="page-view">
    <section class="page-hero">
      <div class="section-inner">
        <div class="section-tag">{{ t.manual.tag }}</div>
        <h1 class="page-hero-title">{{ t.manual.title }}</h1>
        <p class="page-hero-desc">{{ t.manual.desc }}</p>
        <div class="page-hero-actions">
          <RouterLink to="/" class="btn-ghost">&#8592; {{ t.nav.backHome }}</RouterLink>
        </div>
      </div>
    </section>

    <div class="manual-layout">
      <!-- Sidebar TOC with categories -->
      <aside class="manual-toc" :class="{ open: tocOpen }">
        <button class="manual-toc-toggle" @click="tocOpen = !tocOpen" :aria-expanded="tocOpen">
          {{ t.manual.toc }}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" :class="{ rotated: tocOpen }">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <nav class="manual-toc-list" v-show="tocOpen">
          <div v-for="cat in categories" :key="cat.id" class="manual-toc-group">
            <button
              class="manual-toc-group-title"
              @click="toggleCat(cat.id)"
              :aria-expanded="!isCollapsed(cat.id)"
            >
              <span>{{ cat.title }}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="manual-toc-chevron" :class="{ collapsed: isCollapsed(cat.id) }">
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="manual-toc-group-items" v-show="!isCollapsed(cat.id)">
              <a
                v-for="s in cat.sections"
                :key="s.id"
                :href="'#' + s.id"
                :class="{ active: activeId === s.id }"
                @click="scrollTo(s.id)"
              >{{ s.title }}</a>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="manual-content">
        <template v-for="cat in categories" :key="cat.id">
          <section
            v-for="s in cat.sections"
            :id="s.id"
            :key="s.id"
            class="manual-section"
          >
            <h2 class="manual-section-title">{{ s.title }}</h2>
            <div class="manual-body" v-html="s.body"></div>
          </section>
        </template>

        <div class="manual-footer">
          <p>MySQL2PG · <a href="https://github.com/xfg0218/MySQL2PG" target="_blank" rel="noopener">GitHub</a> · <a href="https://mysql2pg.com" target="_blank" rel="noopener">{{ t.manual.officialSite }}</a> · Apache-2.0 License</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useLang } from '../composables/useLang'
import { useManual } from '../composables/useManual'

const { t } = useLang()
const { categories, sections } = useManual()

const tocOpen = ref(false)
const activeId = ref('')
const collapsedCats = reactive(new Set())

function isCollapsed(id) {
  return collapsedCats.has(id)
}

function toggleCat(id) {
  if (collapsedCats.has(id)) {
    collapsedCats.delete(id)
  } else {
    collapsedCats.add(id)
  }
}

function scrollTo(id) {
  // Only close TOC on mobile
  if (window.innerWidth <= 1024) {
    tocOpen.value = false
  }
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

let observer = null

onMounted(() => {
  // Collapse all categories by default
  categories.value.forEach(cat => collapsedCats.add(cat.id))

  const ids = sections.value.map(s => s.id)
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
          // Auto-expand the category containing the active section
          for (const cat of categories.value) {
            if (cat.sections.some(s => s.id === entry.target.id)) {
              collapsedCats.delete(cat.id)
              break
            }
          }
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  )
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  if (window.innerWidth > 1024) {
    tocOpen.value = true
  }
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>
