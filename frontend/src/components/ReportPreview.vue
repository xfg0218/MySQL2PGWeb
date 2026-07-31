<template>
  <section class="section" id="report">
    <div class="section-inner">
      <div class="section-tag" v-if="t.report.tag">{{ t.report.tag }}</div>
      <h2 class="section-title">{{ t.report.title }}</h2>
      <p class="section-desc">{{ t.report.desc }}</p>

      <div class="rpt-mock reveal" v-if="t.report.mockReport">
        <!-- Gradient top border -->
        <div class="rpt-mock-topbar"></div>

        <!-- Header -->
        <div class="rpt-mock-header">
          <div class="rpt-mock-title-row">
            <span class="rpt-mock-prompt">&gt;</span>
            <h3 class="rpt-mock-title">{{ t.report.mockReport.title }}</h3>
            <span class="rpt-mock-date">{{ t.report.mockReport.date }}</span>
          </div>
          <div class="rpt-mock-source">Source: {{ t.report.mockReport.source }}</div>
        </div>

        <!-- Stats Grid -->
        <div class="rpt-mock-stats">
          <div
            class="rpt-mock-stat"
            v-for="(s, i) in t.report.mockReport.stats"
            :key="i"
          >
            <div class="rpt-mock-stat-label">{{ s.label }}</div>
            <div class="rpt-mock-stat-value" :class="s.color">{{ s.value }}</div>
            <div class="rpt-mock-stat-bar" :class="s.color"></div>
          </div>
        </div>

        <!-- Performance Section -->
        <div class="rpt-mock-perf">
          <div class="rpt-mock-perf-header">
            <span class="rpt-mock-perf-icon">⚡</span>
            <span class="rpt-mock-perf-title">{{ t.report.mockReport.performanceTitle }}</span>
            <span class="rpt-mock-perf-badge">{{ t.report.mockReport.stagesBadge }}</span>
          </div>
          <div class="rpt-mock-perf-stages">
            <div
              class="rpt-mock-stage"
              v-for="(st, i) in t.report.mockReport.stages"
              :key="i"
            >
              <span class="rpt-mock-stage-label">{{ st.label }}</span>
              <span class="rpt-mock-stage-count">{{ st.count }}</span>
              <div class="rpt-mock-stage-bar-bg">
                <div class="rpt-mock-stage-bar-fill" :style="{ width: st.percent + '%' }"></div>
              </div>
              <span class="rpt-mock-stage-time">{{ st.time }}</span>
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
