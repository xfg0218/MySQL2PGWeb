<template>
  <footer class="site-footer">
    <p>
      <a href="https://github.com/xfg0218/MySQL2PG" target="_blank">GitHub</a> ·
      {{ t.footer.text }}
    </p>
    <p class="footer-meta">{{ t.footer.copyright }}</p>
  </footer>
</template>

<script setup>
import { useLang } from '../composables/useLang'
const { t } = useLang()
</script>
