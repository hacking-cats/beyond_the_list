<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <q-page class="page">
    <h1 class="page-title">{{ t('features.dataGenerator.title') }}</h1>
    <p class="hint">{{ t('common.comingSoon') }}</p>
  </q-page>
</template>
