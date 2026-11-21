<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { categoryShares } from '../../engines/insights/categoryShares';
import { setAsidePerMonth } from '../../engines/savings/goalPlan';
import { demoAccount, demoSpending, demoTaxBillRappen } from '../../shared/demo-data';
import { chfToRappen, formatChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';
import BubbleChart from './BubbleChart.vue';

const { t } = useI18n();
const router = useRouter();

// Overview
const onlyFlexible = ref(false);
const selected = ref<string | null>(null);
const overview = computed(() => categoryShares(demoSpending));
const shown = computed(() =>
  overview.value.items.filter((i) => !onlyFlexible.value || i.kind === 'flexible'),
);
const selectedItem = computed(() => overview.value.items.find((i) => i.key === selected.value));
function pick(key: string) {
  selected.value = selected.value === key ? null : key;
}
const cat = (key: string, field: 'name' | 'tip') => t(`features.dashboard.cats.${key}.${field}`);

// Coming up
const taxFrancs = ref(Math.round(demoTaxBillRappen / 100));
const months = ref(4);
const perMonth = computed(() => setAsidePerMonth(chfToRappen(taxFrancs.value), months.value));
const potCreated = ref(false);
const showFranchise = ref(false);
</script>

<template>
  <q-page class="page">
    <section class="summary">
      <p class="summary__hello">{{ t('common.hello') }}</p>
      <p class="summary__balance amount">{{ formatChf(demoAccount.balanceRappen) }}</p>
      <p class="summary__sub">{{ t('common.jointAccount') }}</p>
    </section>

    <h1 class="page-title">{{ t('features.dashboard.overviewH') }}</h1>
    <p class="hint">{{ t('features.dashboard.overviewP') }}</p>

    <div class="stats">
      <div class="stat">
        <p class="stat__label">{{ t('features.dashboard.totalL') }}</p>
        <p class="stat__value">{{ formatChf(overview.totalRappen, { decimals: 0 }) }}</p>
      </div>
      <div class="stat">
        <p class="stat__label">{{ t('features.dashboard.flexL') }}</p>
        <p class="stat__value">{{ formatChf(overview.flexibleRappen, { decimals: 0 }) }}</p>
        <p class="stat__sub">{{ overview.flexiblePercent }}% {{ t('features.dashboard.ofAll') }}</p>
      </div>
    </div>

    <div class="chips" style="margin-top: 0" role="group">
      <button class="chip" :aria-pressed="!onlyFlexible" @click="onlyFlexible = false">
        {{ t('features.dashboard.allL') }}
      </button>
      <button class="chip" :aria-pressed="onlyFlexible" @click="onlyFlexible = true">
        {{ t('features.dashboard.onlyFlexL') }}
      </button>
    </div>

    <BubbleChart :items="shown" :selected="selected" :label="t('features.dashboard.overviewH')" @pick="pick" />

    <ul class="legend">
      <li><span class="swatch sw-essential"></span>{{ t('features.dashboard.essential') }}</li>
      <li><span class="swatch sw-flexible"></span>{{ t('features.dashboard.flexible') }}</li>
    </ul>

    <div v-if="selectedItem && selectedItem.kind === 'flexible'" class="tone tone--attention" role="status">
      <DsIcon name="attention" />
      <div class="tone__content">
        <p class="tone__title">
          {{ cat(selectedItem.key, 'name') }} · {{ formatChf(selectedItem.amountRappen, { decimals: 0 }) }}
          {{ t('common.perMonth') }}
        </p>
        <p>{{ selectedItem.percent }}% {{ t('features.dashboard.shareL') }}.</p>
        <p>{{ cat(selectedItem.key, 'tip') }}</p>
        <button class="btn btn--secondary" @click="router.push('/savings')">
          {{ t('features.dashboard.ideasBtn') }}
        </button>
      </div>
    </div>
    <div v-else-if="selectedItem" class="card card--plain" role="status">
      <div class="card__body">
        <p class="card__title">
          {{ cat(selectedItem.key, 'name') }} · {{ formatChf(selectedItem.amountRappen, { decimals: 0 }) }}
          {{ t('common.perMonth') }}
        </p>
        <p>{{ selectedItem.percent }}% {{ t('features.dashboard.shareL') }}.</p>
        <p>{{ t('features.dashboard.essentialNote') }}</p>
      </div>
    </div>
    <p v-else class="hint" role="status">{{ t('features.dashboard.pickP') }}</p>

    <div class="section">
      <p class="section__title">{{ t('features.dashboard.listH') }}</p>
      <ul class="rank">
        <li v-for="item in overview.items" :key="item.key">
          <span class="swatch" :class="`sw-${item.kind}`" aria-hidden="true"></span>
          <span class="rank__name">
            {{ cat(item.key, 'name') }}
            <span class="visually-hidden">, {{ t(`features.dashboard.${item.kind}`) }}</span>
          </span>
          <span class="amount">{{ formatChf(item.amountRappen, { decimals: 0 }) }}</span>
          <span class="rank__share">{{ item.percent }}%</span>
        </li>
      </ul>
    </div>

    <div class="section" style="margin-top: var(--sp-xl)">
      <p class="section__title">{{ t('features.dashboard.comingUpH') }}</p>

      <div class="tone tone--attention">
        <DsIcon name="attention" />
        <div class="tone__content">
          <p class="tone__title">{{ t('features.dashboard.taxH') }}</p>
          <p class="tone__body">{{ t('features.dashboard.taxP') }}</p>
          <label class="field">
            {{ t('features.dashboard.taxL') }}:
            <b class="amount">{{ formatChf(chfToRappen(taxFrancs), { decimals: 0 }) }}</b>
            <input v-model.number="taxFrancs" type="range" min="500" max="8000" step="100" />
          </label>
          <label class="field">
            {{ t('features.dashboard.monthsL') }}: <b>{{ months }}</b>
            <input v-model.number="months" type="range" min="1" max="12" />
          </label>
          <div class="result">
            <span>{{ t('features.dashboard.perMonth') }}</span>
            <span class="result__amount">{{ formatChf(perMonth, { decimals: 0 }) }}</span>
          </div>
          <button class="btn btn--primary btn--block" @click="potCreated = true">
            {{ t('features.dashboard.saveBtn') }}
          </button>
          <p class="done" role="status">{{ potCreated ? t('features.dashboard.saved') : '' }}</p>
        </div>
      </div>

      <div class="worth">
        <DsIcon name="info" />
        <div>
          <p class="worth__title">{{ t('features.dashboard.kkH') }}</p>
          <p>{{ t('features.dashboard.kkP') }}</p>
          <button v-if="!showFranchise" class="btn btn--secondary" @click="showFranchise = true">
            {{ t('features.dashboard.kkBtn') }}
          </button>
          <p v-else>{{ t('features.dashboard.kkMore') }}</p>
        </div>
      </div>

      <div class="card">
        <DsIcon name="bulb" />
        <div class="card__body">
          <p class="card__title">{{ t('features.dashboard.prH') }}</p>
          <p>{{ t('features.dashboard.prP') }}</p>
        </div>
      </div>
    </div>
  </q-page>
</template>
