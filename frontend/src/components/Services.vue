<template>
  <section class="section section-alt" id="services">
    <div class="section-inner">
      <template v-if="!standalone">
        <div class="section-tag" v-if="t.services.tag">{{ t.services.tag }}</div>
        <h2 class="section-title">{{ t.services.title }}</h2>
        <p class="section-desc">{{ t.services.desc }}</p>
      </template>
      <div class="svc-plans">
        <!-- Open Source -->
        <div class="svc-plan reveal">
          <div class="svc-plan-badge">{{ t.services.openSource.badge }}</div>
          <h3 class="svc-plan-name">{{ t.services.openSource.name }}</h3>
          <div class="svc-plan-price">{{ t.services.openSource.price }}</div>
          <p class="svc-plan-intro">{{ t.services.openSource.intro }}</p>
          <ul class="svc-plan-features">
            <li v-for="f in t.services.openSource.features" :key="f"><span class="svc-check">&#10003;</span>{{ f }}</li>
          </ul>
          <a :href="t.services.openSource.link" target="_blank" rel="noopener noreferrer" class="btn-ghost svc-plan-btn">
            {{ t.services.openSource.btn }} &#8599;
          </a>
        </div>
        <!-- Commercial (Recommended) -->
        <div class="svc-plan svc-plan-featured reveal">
          <div class="svc-plan-recommend">{{ t.services.commercial.recommend }}</div>
          <div class="svc-plan-badge">{{ t.services.commercial.badge }}</div>
          <h3 class="svc-plan-name">{{ t.services.commercial.name }}</h3>
          <div class="svc-plan-price">{{ t.services.commercial.price }}</div>
          <p class="svc-plan-intro">{{ t.services.commercial.intro }}</p>
          <ul class="svc-plan-features">
            <li v-for="f in t.services.commercial.features" :key="f"><span class="svc-check">&#10003;</span>{{ f }}</li>
          </ul>
          <RouterLink to="/contact" class="btn-primary btn-lg svc-plan-btn">{{ t.services.commercial.btn }}</RouterLink>
        </div>
      </div>

      <!-- Edition Comparison Table -->
      <div class="svc-compare reveal">
        <h3 class="svc-compare-title">{{ t.services.compareTitle }}</h3>
        <p class="svc-compare-desc">{{ t.services.compareDesc }}</p>
        <div class="svc-compare-table">
          <div class="svc-compare-header">
            <div class="svc-compare-feat-col">{{ t.services.compareFeature }}</div>
            <div class="svc-compare-col">{{ t.services.openSource.name }}</div>
            <div class="svc-compare-col svc-compare-col-featured">{{ t.services.commercial.name }}</div>
          </div>
          <div class="svc-compare-group" v-for="g in t.services.compareGroups" :key="g.title">
            <div class="svc-compare-group-title">{{ g.title }}</div>
            <div class="svc-compare-row" v-for="r in g.rows" :key="r.label">
              <div class="svc-compare-feat-col">{{ r.label }}</div>
              <div class="svc-compare-col">
                <span v-if="r.open === true" class="svc-check-icon">&#10003;</span>
                <span v-else-if="r.open === false" class="svc-dash">&mdash;</span>
                <span v-else>{{ r.open }}</span>
              </div>
              <div class="svc-compare-col svc-compare-col-featured">
                <span v-if="r.commercial === true" class="svc-check-icon">&#10003;</span>
                <span v-else-if="r.commercial === false" class="svc-dash">&mdash;</span>
                <span v-else>{{ r.commercial }}</span>
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
defineProps({
  standalone: { type: Boolean, default: false }
})
const { t } = useLang()
</script>
