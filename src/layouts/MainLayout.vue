<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { enabledFeatures } from '../features/registry';

const { t, locale } = useI18n();
const drawer = ref(false);
const menu = enabledFeatures();
const languages = [
  { code: 'en-US', label: 'EN' },
  { code: 'de', label: 'DE' },
] as const;
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="app-header-q">
      <q-toolbar>
        <q-btn flat round dense icon="menu" :aria-label="t('common.menu')" @click="drawer = !drawer" />
        <p class="app-title">{{ t('common.appName') }}</p>
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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" overlay bordered behavior="mobile">
      <q-list>
        <q-item v-for="f in menu" :key="f.key" clickable :to="f.route" active-class="text-primary" @click="drawer = false">
          <q-item-section avatar><q-icon :name="f.icon" /></q-item-section>
          <q-item-section>{{ t(f.titleKey) }}</q-item-section>
        </q-item>
      </q-list>
      <span class="chip-proto drawer-proto">{{ t('common.prototype') }}</span>
    </q-drawer>

    <q-page-container>
      <div class="content">
        <router-view />
        <footer class="app-footer">{{ t('common.footer') }}</footer>
      </div>
    </q-page-container>
  </q-layout>
</template>
