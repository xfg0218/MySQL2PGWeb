<template>
  <footer class="site-footer">
    <p>
      <a href="https://github.com/xfg0218/MySQL2PG" target="_blank" rel="noopener noreferrer" @click="trackClick('github')">GitHub</a> ·
      {{ t.footer.text }}
    </p>
    <p class="footer-meta">{{ t.footer.copyright }}</p>
  </footer>
</template>

<script setup>
import { useLang } from '../composables/useLang'
import { trackClick } from '../composables/useTracker'
const { t } = useLang()
</script>
