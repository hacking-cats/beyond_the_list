<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { enabledFeatures } from '../features/registry';
import { demoAccount } from '../shared/demo-data';
import { formatChf } from '../shared/money';

// One layout for the whole app, as in the klar prototype: header with language switch,
// greeting and balance, then a tab bar generated from the feature registry.
const { t, locale } = useI18n();
const route = useRoute();
const tabs = enabledFeatures();
const languages = [
  { code: 'en-US', label: 'EN' },
  { code: 'de', label: 'DE' },
] as const;

// Keep the active tab visible when the tab bar scrolls on narrow phones.
watch(
  () => [route.path, locale.value],
  async () => {
    await nextTick();
    document.querySelector('.tabs .tab[aria-selected="true"]')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  },
);
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-header__title">{{ t('common.appName') }}</h1>
      <div class="lang" role="group" :aria-label="t('common.language')">
        <button
          v-for="l in languages"
          :key="l.code"
          class="chip"
          :aria-pressed="locale === l.code"
          @click="locale = l.code"
        >
          {{ l.label }}
        </button>
      </div>
    </header>

    <section class="summary">
      <p class="summary__hello">{{ t('common.hello') }}</p>
      <p class="summary__balance amount">{{ formatChf(demoAccount.balanceRappen) }}</p>
      <p class="summary__sub">{{ t('common.jointAccount') }}</p>
    </section>

    <nav class="tabs" role="tablist">
      <router-link
        v-for="f in tabs"
        :key="f.key"
        :to="f.route"
        class="tab"
        role="tab"
        :aria-selected="route.path === f.route"
      >
        {{ t(f.titleKey) }}
      </router-link>
    </nav>

    <main class="panel">
      <router-view />
    </main>

    <footer class="app-footer">{{ t('common.footer') }}</footer>
  </div>
</template>
