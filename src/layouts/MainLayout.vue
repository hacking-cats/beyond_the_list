<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { enabledFeatures } from '../features/registry';
import { demoPersonName, latestSummary, monthLabel } from '../shared/statements';
import { formatChf } from '../shared/money';
import { icon } from '../shared/ui/icons';
import BuddyPanel from './buddy/BuddyPanel.vue';
import BuddyIntro from './buddy/BuddyIntro.vue';
import { useBuddyPull } from './buddy/useBuddyPull';
import './buddy/buddy.css';

// One layout for the whole app: header with language switch, greeting and balance, the page,
// and a bottom tab bar (icons only, each with an accessible name) from the feature registry.
// Pulling the header down rolls down the PostFinAInce buddy (src/layouts/buddy/).
const { t, locale } = useI18n();
const route = useRoute();
const tabs = enabledFeatures();
const languages = [
  { code: 'en-US', label: 'EN' },
  { code: 'de', label: 'DE' },
] as const;

const buddy = useBuddyPull();
const buddyButton = ref<HTMLButtonElement | null>(null);

function closeBuddy() {
  buddy.setOpen(false);
  buddyButton.value?.focus();
}
</script>

<template>
  <div class="app">
    <header
      v-touch-pan.vertical.prevent.mouse="buddy.onPan"
      class="app-header buddy-pull"
      :class="{ 'is-pulling': buddy.dragging.value, 'is-open': buddy.open.value }"
      :title="t('buddy.pullHint')"
    >
      <h1 class="app-header__title">{{ t('common.appName') }}</h1>
      <button
        ref="buddyButton"
        type="button"
        class="buddy-btn"
        :aria-label="t('buddy.open')"
        :aria-expanded="buddy.open.value"
        @click="buddy.setOpen(true)"
      >
        <q-icon :name="icon('auto_awesome')" size="22px" aria-hidden="true" />
      </button>
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
      <span class="buddy-glow" aria-hidden="true"><span class="buddy-glow__wave" /></span>
      <span class="buddy-nub" aria-hidden="true" />
    </header>

    <BuddyIntro @try="buddy.setOpen(true)" />

    <section class="summary">
      <p class="summary__hello">{{ t('common.hi') }} {{ demoPersonName }} 👋</p>
      <p class="summary__balance amount">{{ formatChf(latestSummary.leftRappen) }}</p>
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

    <BuddyPanel
      :open="buddy.open.value"
      :progress="buddy.progress.value"
      :dragging="buddy.dragging.value"
      @close="closeBuddy"
      @pan="buddy.onPan"
    />
  </div>
</template>
