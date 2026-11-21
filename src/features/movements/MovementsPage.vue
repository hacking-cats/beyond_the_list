<script setup lang="ts">
/**
 * Explained tab: shows the "Beyond the List" prototype (public/v2/index.html) in a frame that
 * fills the space between the header and the tab bar. A stopgap until the prototype is ported
 * into this folder (ADR 0007, issues #28–#31); the previous per-category list is in git history.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const src = `${import.meta.env.BASE_URL}v2/index.html`;

const frame = ref<HTMLIFrameElement | null>(null);
const height = ref('70vh');
const TABBAR_PX = 56; // .tabbar__tab min-height in src/css/app.css

function fit() {
  const el = frame.value;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  height.value = `${Math.max(320, window.innerHeight - top - TABBAR_PX)}px`;
}

// Re-fit when anything above the frame changes height (e.g. the buddy intro banner is dismissed).
let observer: ResizeObserver | undefined;
onMounted(() => {
  fit();
  window.addEventListener('resize', fit);
  observer = new ResizeObserver(fit);
  observer.observe(document.body);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', fit);
  observer?.disconnect();
});
</script>

<template>
  <iframe ref="frame" class="explained-frame" :src="src" :title="t('features.movements.title')" :style="{ height }" />
</template>

<style scoped>
/* Cancel the panel padding so the prototype uses the full width, like the other tabs' lists. */
.explained-frame {
  display: block;
  width: calc(100% + 2 * var(--sp-lg));
  margin: calc(-1 * var(--sp-lg));
  border: 0;
}
</style>
