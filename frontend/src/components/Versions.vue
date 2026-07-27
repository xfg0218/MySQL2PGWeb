<template>
  <section class="section" id="versions">
    <div class="section-inner">
      <div class="section-tag">{{ t.versions.tag }}</div>
      <h2 class="section-title">{{ t.versions.title }}</h2>
      <p class="section-desc"></p>
      <div class="ver-grid">
        <div class="ver-box reveal">
          <h3>{{ t.versions.mysql }}</h3>
          <div class="ver-tags">
            <span class="ver-tag active" v-for="v in t.versions.mysqlVersions" :key="v">{{ v }}</span>
          </div>
        </div>
        <div class="ver-box reveal">
          <h3>{{ t.versions.pg }}</h3>
          <div class="ver-tags">
            <span class="ver-tag active" v-for="v in t.versions.pgVersions" :key="v">{{ v }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
