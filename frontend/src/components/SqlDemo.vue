<template>
  <section class="section section-alt" id="sqldemo">
    <div class="section-inner">
      <div class="section-tag" v-if="t.sqlDemo.tag">{{ t.sqlDemo.tag }}</div>
      <h2 class="section-title">{{ t.sqlDemo.title }}</h2>
      <p class="section-desc">{{ t.sqlDemo.desc }}</p>
      <div class="sqldemo-tabs reveal">
        <button
          v-for="(ex, i) in t.sqlDemo.examples"
          :key="i"
          class="sqldemo-tab"
          :class="{ active: activeTab === i }"
          @click="activeTab = i"
        >{{ ex.title }}</button>
      </div>
      <div class="sqldemo-pair reveal">
        <div class="sqldemo-pane">
          <div class="sqldemo-pane-header">
            <span class="db-icon">🐬</span> MySQL
          </div>
          <pre v-html="t.sqlDemo.examples[activeTab].mysql"></pre>
        </div>
        <div class="sqldemo-pane">
          <div class="sqldemo-pane-header">
            <span class="db-icon">🐘</span> PostgreSQL
          </div>
          <pre v-html="t.sqlDemo.examples[activeTab].pg"></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useLang } from '../composables/useLang'
const { t } = useLang()
const activeTab = ref(0)
</script>
