<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { enabledFeatures } from '../features/registry';
import { demoPersonName, latestSummary, monthLabel } from '../shared/statements';
import { displayChf } from '../shared/money';
import { icon } from '../shared/ui/icons';
import LanguagePicker from './LanguagePicker.vue';

// One layout for the whole app: header with language switch, greeting and balance, the page,
// and a bottom tab bar (icons only, each with an accessible name) from the feature registry.
const { t, locale } = useI18n();
const route = useRoute();
const tabs = enabledFeatures();


</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-header__title">{{ t('common.appName') }}</h1>
      <LanguagePicker />
    </header>

    <section class="summary">
      <p class="summary__hello">{{ t('common.hi') }} {{ demoPersonName }} 👋</p>
      <p class="summary__balance amount">{{ displayChf(latestSummary.leftRappen) }}</p>
      <p class="summary__sub">
        {{ t('common.leftIn') }} {{ monthLabel(latestSummary.month, locale) }} {{ t('common.accounts') }}
      </p>
    </section>

    <main class="panel">
      <router-view />
    </main>

    <footer class="app-footer">{{ t('common.footer') }}</footer>

    <nav class="tabbar" role="tablist" :aria-label="t('common.sections')">
      <router-link
        v-for="f in tabs"
        :key="f.key"
        :to="f.route"
        class="tabbar__tab"
        role="tab"
        :aria-selected="route.path === f.route"
        :aria-label="t(f.titleKey)"
        :title="t(f.titleKey)"
      >
        <q-icon :name="icon(f.icon)" size="26px" aria-hidden="true" />
      </router-link>
    </nav>
  </div>
</template>
