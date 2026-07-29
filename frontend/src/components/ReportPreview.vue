<template>
  <section class="section" id="report">
    <div class="section-inner">
      <div class="section-tag" v-if="t.report.tag">{{ t.report.tag }}</div>
      <h2 class="section-title">{{ t.report.title }}</h2>
      <p class="section-desc">{{ t.report.desc }}</p>
      <div class="report-layout">
        <div class="report-sections reveal">
          <div class="report-section-card" v-for="s in t.report.sections" :key="s.title">
            <div class="report-section-icon">{{ s.icon }}</div>
            <div>
              <h4>{{ s.title }}</h4>
              <p>{{ s.desc }}</p>
            </div>
          </div>
        </div>
        <div class="report-mock reveal">
          <div class="report-mock-bar">
            <span class="report-mock-dot r"></span>
            <span class="report-mock-dot y"></span>
            <span class="report-mock-dot g"></span>
            <span class="report-mock-url">migration-report.html</span>
          </div>
          <div class="report-mock-body">
            <div class="report-mock-stats">
              <div class="report-mock-stat" v-for="s in t.report.mockStats" :key="s.label">
                <span class="val">{{ s.value }}</span>
                <span class="label">{{ s.label }}</span>
              </div>
            </div>
            <div class="report-mock-risks">
              <div
                class="report-risk-item"
                :class="r.level"
                v-for="(r, i) in t.report.mockRisks"
                :key="i"
              >
                <span class="report-risk-icon">{{ r.level === 'warn' ? '⚠️' : 'ℹ️' }}</span>
                <span>{{ r.text }}</span>
              </div>
            </div>
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
