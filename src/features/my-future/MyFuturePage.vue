<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DsIcon from '../../shared/ui/DsIcon.vue';

const { t } = useI18n();
const showAhv = ref(false);
</script>

<template>
  <div>
    <div class="card card--plain">
      <div>
        <p class="card__title">{{ t('features.myFuture.ahvH') }}</p>
        <p>{{ t('features.myFuture.ahvP') }}</p>
        <button v-if="!showAhv" class="btn btn--secondary" @click="showAhv = true">
          {{ t('features.myFuture.ahvBtn') }}
        </button>
        <p v-else class="reveal">{{ t('features.myFuture.ahvMore') }}</p>
      </div>
    </div>
    <div class="tone tone--attention">
      <DsIcon name="attention" />
      <div class="tone__content">
        <p class="tone__title">{{ t('features.myFuture.p3H') }}</p>
        <p class="tone__body">{{ t('features.myFuture.p3P') }}</p>
      </div>
    </div>
    <div class="worth">
      <DsIcon name="info" />
      <div>
        <p class="worth__title">{{ t('features.myFuture.indH') }}</p>
        <p>{{ t('features.myFuture.indP') }}</p>
      </div>
    </div>
  </div>
</template>
