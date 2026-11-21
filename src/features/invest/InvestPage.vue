<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div>
    <p class="card__title">{{ t('features.invest.title') }}</p>
    <p class="hint">{{ t('common.comingSoon') }}</p>
  </div>
</template>
