<template>
  <section class="section section-alt" id="competitors">
    <div class="section-inner">
      <div class="section-tag" v-if="t.competitors.tag">{{ t.competitors.tag }}</div>
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
              <td><span :class="cellClass(row.m2pg)">{{ cellIcon(row.m2pg) }}</span></td>
              <td><span :class="cellClass(row.pgloader)">{{ cellIcon(row.pgloader) }}</span></td>
              <td><span :class="cellClass(row.aws)">{{ cellIcon(row.aws) }}</span></td>
              <td><span :class="cellClass(row.azure)">{{ cellIcon(row.azure) }}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="comp-legend">
          <span class="comp-legend-item"><span class="comp-check">✓</span> {{ t.competitors.legendFull }}</span>
          <span class="comp-legend-item"><span class="comp-partial">~</span> {{ t.competitors.legendPartial }}</span>
          <span class="comp-legend-item"><span class="comp-cross">—</span> {{ t.competitors.legendNone }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()

const cellIcon = (v) => v === true ? '✓' : v === 'partial' ? '~' : '—'
const cellClass = (v) => v === true ? 'comp-check' : v === 'partial' ? 'comp-partial' : 'comp-cross'
</script>
