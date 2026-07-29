<template>
  <section class="section" id="architecture">
    <div class="section-inner">
      <div class="section-tag" v-if="t.architecture.tag">{{ t.architecture.tag }}</div>
      <h2 class="section-title">{{ t.architecture.title }}</h2>
      <p class="section-desc">{{ t.architecture.desc }}</p>
      <div class="arch-pipeline reveal">
        <template v-for="(stage, i) in t.architecture.stages" :key="i">
          <div class="arch-stage">
            <div class="arch-stage-icon">{{ stage.icon }}</div>
            <h4>{{ stage.title }}</h4>
            <p>{{ stage.desc }}</p>
          </div>
          <div class="arch-arrow" v-if="i < t.architecture.stages.length - 1">→</div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
