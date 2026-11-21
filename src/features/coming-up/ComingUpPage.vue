<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { setAsidePerMonth } from '../../engines/savings/goalPlan';
import { taxPaidLastYear } from '../../shared/statements';
import { chfToRappen, formatChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';

const { t } = useI18n();
const taxFrancs = ref(Math.max(500, Math.round(taxPaidLastYear / 100)));
const months = ref(4);
const perMonth = computed(() => setAsidePerMonth(chfToRappen(taxFrancs.value), months.value));
const potCreated = ref(false);
const showFranchise = ref(false);
const chf0 = (r: number) => formatChf(r, { decimals: 0 });
</script>

<template>
  <div>
    <div class="tone tone--attention">
      <DsIcon name="attention" />
      <div class="tone__content">
        <p class="tone__title">{{ t('features.comingUp.taxH') }}</p>
        <p class="tone__body">{{ t('features.comingUp.taxP') }}</p>
        <label class="field">
          {{ t('features.comingUp.taxL') }}: <b class="amount">{{ chf0(chfToRappen(taxFrancs)) }}</b>
          <input v-model.number="taxFrancs" type="range" min="500" max="8000" step="100" />
        </label>
        <label class="field">
          {{ t('features.comingUp.monthsL') }}: <b>{{ months }}</b>
          <input v-model.number="months" type="range" min="1" max="12" />
        </label>
        <div class="result">
          <span>{{ t('features.comingUp.perMonth') }}</span>
          <span class="result__amount">{{ chf0(perMonth) }}</span>
        </div>
        <button class="btn btn--primary btn--block" @click="potCreated = true">
          {{ t('features.comingUp.saveBtn') }}
        </button>
        <p class="done" role="status">{{ potCreated ? t('features.comingUp.saved') : '' }}</p>
      </div>
    </div>

    <div class="worth">
      <DsIcon name="info" />
      <div>
        <p class="worth__title">{{ t('features.comingUp.kkH') }}</p>
        <p>{{ t('features.comingUp.kkP') }}</p>
        <button v-if="!showFranchise" class="btn btn--secondary" @click="showFranchise = true">
          {{ t('features.comingUp.kkBtn') }}
        </button>
        <p v-else class="reveal">{{ t('features.comingUp.kkMore') }}</p>
      </div>
    </div>

    <div class="card" style="margin-top: var(--sp-lg)">
      <DsIcon name="bulb" />
      <div>
        <p class="card__title">{{ t('features.comingUp.prH') }}</p>
        <p>{{ t('features.comingUp.prP') }}</p>
      </div>
    </div>
  </div>
</template>
