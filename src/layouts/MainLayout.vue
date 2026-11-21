<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { enabledFeatures } from '../features/registry';
import { balances, balanceSince, dayLabel, demoPersonName, totalBalanceRappen } from '../shared/statements';
import { formatChf } from '../shared/money';
import { icon } from '../shared/ui/icons';

// One layout for the whole app: header with language switch, greeting and balance, the page,
// and a bottom tab bar (icons only, each with an accessible name) from the feature registry.
const { t, locale } = useI18n();
const route = useRoute();
const tabs = enabledFeatures();
const languages = [
  { code: 'en-US', label: 'EN' },
  { code: 'de', label: 'DE' },
] as const;


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
      <p class="summary__hello">{{ t('common.hi') }} {{ demoPersonName }} 👋</p>
      <p class="summary__balance amount">{{ formatChf(totalBalanceRappen) }}</p>
      <p class="summary__sub">
        {{ t('common.balanceSince') }} {{ dayLabel(balanceSince, locale) }}, {{ t('common.fromStatements') }}
      </p>
      <p class="summary__sub">
        {{ t('common.privateAccount') }} <span class="amount">{{ formatChf(balances.privateAccount.balanceRappen) }}</span>
        · {{ t('common.creditCard') }} <span class="amount">{{ formatChf(balances.creditCard.balanceRappen) }}</span>
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
