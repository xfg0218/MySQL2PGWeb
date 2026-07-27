<template>
  <section class="section" id="compare">
    <div class="section-inner">
      <div class="section-tag">{{ t.compare.tag }}</div>
      <h2 class="section-title">{{ t.compare.title }}</h2>
      <p class="section-desc">{{ t.compare.desc }}</p>
      <div class="compare-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th>{{ t.compare.colDim }}</th>
              <th>{{ t.compare.colDts }}</th>
              <th>{{ t.compare.colM2p }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in t.compare.rows" :key="row.dim" class="reveal">
              <td>{{ row.dim }}</td>
              <td><span class="badge-no" v-if="row.dts === 'no'">{{ t.compare.no }}</span><span v-else>{{ row.dts }}</span></td>
              <td><span class="badge-yes">✓ {{ row.mysql2pg }}</span></td>
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
