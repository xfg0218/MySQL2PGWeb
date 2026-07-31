<template>
  <section class="section section-alt" id="assessment">
    <div class="section-inner">
      <div class="section-tag" v-if="t.assessment.tag">{{ t.assessment.tag }}</div>
      <h2 class="section-title">{{ t.assessment.title }}</h2>
      <p class="section-desc">{{ t.assessment.desc }}</p>

      <div class="assess-report reveal" v-if="t.assessment.mockReport">
        <!-- Ambient glow -->
        <div class="assess-report-glow"></div>

        <!-- Header -->
        <div class="assess-report-header">
          <div class="assess-report-title-row">
            <span class="assess-report-prompt">&gt;</span>
            <h3 class="assess-report-title">{{ t.assessment.mockReport.title }}</h3>
          </div>
          <div class="assess-report-meta">
            <span class="assess-report-meta-item">
              <span class="assess-report-meta-icon">📅</span>
              {{ t.assessment.mockReport.date }}
            </span>
            <span class="assess-report-meta-item">
              <span class="assess-report-meta-icon">🔌</span>
              {{ t.assessment.mockReport.sourceLabel }}：<code>{{ t.assessment.mockReport.source }}</code>
            </span>
            <span class="assess-report-meta-item">
              <span class="assess-report-meta-icon">🎯</span>
              {{ t.assessment.mockReport.targetLabel }}：<code>{{ t.assessment.mockReport.target }}</code>
            </span>
          </div>
          <div class="assess-report-versions">
            <div class="assess-report-version-line">
              <span class="assess-report-version-label">{{ t.assessment.mockReport.mysqlVersionLabel }}：</span>
              <span class="assess-report-version-value">{{ t.assessment.mockReport.mysqlVersion }}</span>
            </div>
            <div class="assess-report-version-line">
              <span class="assess-report-version-label">{{ t.assessment.mockReport.pgVersionLabel }}：</span>
              <span class="assess-report-version-value">{{ t.assessment.mockReport.pgVersion }}</span>
            </div>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="assess-report-metrics">
          <div
            class="assess-report-metric reveal"
            v-for="(m, i) in t.assessment.mockReport.metrics"
            :key="i"
            :style="{ '--delay': i * 0.06 + 's' }"
          >
            <div class="assess-report-metric-label">{{ m.label }}</div>
            <div class="assess-report-metric-value" :class="m.highlight || ''">{{ m.value }}</div>
            <div class="assess-report-metric-bar"></div>
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
