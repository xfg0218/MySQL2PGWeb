<template>
  <section class="section section-alt" id="competitors">
    <div class="section-inner">
      <div class="section-tag">{{ t.competitors.tag }}</div>
      <h2 class="section-title">{{ t.competitors.title }}</h2>
      <p class="section-desc">{{ t.competitors.desc }}</p>
      <div class="comp-wrapper reveal">
        <table class="comp-table">
          <thead>
            <tr>
              <th>{{ t.competitors.colFeature }}</th>
              <th v-for="tool in t.competitors.tools" :key="tool.name">
                {{ tool.icon }} {{ tool.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in t.competitors.rows" :key="row.feature">
              <td>{{ row.feature }}</td>
              <td><span :class="row.m2pg ? 'comp-check' : 'comp-cross'">{{ row.m2pg ? '✓' : '—' }}</span></td>
              <td><span :class="row.pgloader ? 'comp-check' : 'comp-cross'">{{ row.pgloader ? '✓' : '—' }}</span></td>
              <td><span :class="row.aws ? 'comp-check' : 'comp-cross'">{{ row.aws ? '✓' : '—' }}</span></td>
              <td><span :class="row.azure ? 'comp-check' : 'comp-cross'">{{ row.azure ? '✓' : '—' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
