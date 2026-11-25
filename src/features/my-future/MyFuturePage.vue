<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { hasSalary } from '../../shared/statements';
import DsIcon from '../../shared/ui/DsIcon.vue';

// Two versions of the texts: the statements show a salary (employed) or not
// (e.g. a parent at home, covered for AHV through the partner).
const { t } = useI18n();
const showAhv = ref(false);
</script>

<template>
  <div>
    <h2 class="page-heading">{{ t('features.myFuture.title') }}</h2>
    <div class="card card--plain">
      <div>
        <p class="card__title">{{ hasSalary ? t('features.myFuture.ahvEmpH') : t('features.myFuture.ahvH') }}</p>
        <p>{{ hasSalary ? t('features.myFuture.ahvEmpP') : t('features.myFuture.ahvP') }}</p>
        <button v-if="!showAhv" class="btn btn--secondary" @click="showAhv = true">
          {{ t('features.myFuture.ahvBtn') }}
        </button>
        <p v-else class="reveal">{{ t('features.myFuture.ahvMore') }}</p>
      </div>
    </div>
    <div v-if="hasSalary" class="worth" style="margin-bottom: var(--sp-lg)">
      <DsIcon name="info" />
      <div>
        <p class="worth__title">{{ t('features.myFuture.p3EmpH') }}</p>
        <p>{{ t('features.myFuture.p3EmpP') }}</p>
      </div>
    </div>
    <div v-else class="tone tone--attention">
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
