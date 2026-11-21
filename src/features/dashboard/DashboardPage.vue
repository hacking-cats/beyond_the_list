<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { categoryShares } from '../../engines/insights/categoryShares';
import { alternativesFor, monthlySpending, shareOfIncome } from '../../shared/statements';
import { groupOf, iconOf, SPENDING_GROUPS } from '../../shared/transactions';
import { displayChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';
import { icon } from '../../shared/ui/icons';
import BubbleChart from './BubbleChart.vue';

const i18n = useI18n();
const { t } = i18n;
const router = useRouter();

// Opens on the recommended savings (spending that could be cut back); 'All' shows every bubble.
const onlyFlexible = ref(true);
const selected = ref<string | null>(null);
const overview = computed(() => categoryShares(monthlySpending));
const shown = computed(() =>
  overview.value.items.filter((i) => !onlyFlexible.value || i.kind === 'flexible'),
);
const selectedItem = computed(() => overview.value.items.find((i) => i.key === selected.value));
function pick(key: string) {
  selected.value = selected.value === key ? null : key;
}
const cat = (key: string, field: 'name' | 'tip') => t(`categories.${key}.${field}`);

// What the selected bubble means for this person: share of income and category advice
// (essentials), and the biggest cheaper alternative found in its payments.
const incomeShare = computed(() => (selectedItem.value ? shareOfIncome(selectedItem.value.amountRappen) : 0));
const advice = computed(() => {
  const key = selectedItem.value?.key;
  if (!key || !i18n.te(`features.dashboard.advice.${key}`)) return '';
  return t(`features.dashboard.advice.${key}`, { incomeShare: incomeShare.value });
});
const flexTip = computed(() => {
  const key = selectedItem.value?.key;
  return key && i18n.te(`categories.${key}.tip`) ? cat(key, 'tip') : '';
});
function openIdeas() {
  void router.push({ path: '/savings', query: selected.value ? { cat: selected.value } : {} });
}

const price = (r: number) => displayChf(r, { decimals: r % 100 === 0 ? 0 : 2 });
// The biggest cheaper alternative found in this category's payments (same as on the Savings page).
const selectedAlt = computed(() => (selected.value ? alternativesFor(selected.value)[0] : undefined));
const altTitle = computed(() => (selectedAlt.value ? t(`features.savings.alt.${selectedAlt.value.key}.title`) : ''));
const altTip = computed(() => {
  const a = selectedAlt.value;
  if (!a) return '';
  return t(`features.savings.alt.${a.key}.tip`, {
    count: a.count,
    now: displayChf(a.nowRappen, { decimals: 0 }),
    alt: price(a.altRappen),
    total: displayChf(a.totalRappen, { decimals: 0 }),
  });
});
// The list in three parts: recurring essentials, occasional essentials, could cut back.
const grouped = computed(() =>
  SPENDING_GROUPS.map((group) => {
    const items = overview.value.items.filter((i) => groupOf(i.key) === group);
    const totalRappen = items.reduce((s, i) => s + i.amountRappen, 0);
    const percent = overview.value.totalRappen > 0 ? Math.round((totalRappen / overview.value.totalRappen) * 100) : 0;
    return { group, items, totalRappen, percent };
  }).filter((g) => g.items.length > 0),
);
</script>

<template>
  <div>
    <p class="card__title">{{ t('features.dashboard.overviewH') }}</p>
    <p class="hint">{{ t('features.dashboard.overviewP') }}</p>

    <div class="stats">
      <div class="stat">
        <p class="stat__label">{{ t('features.dashboard.totalL') }}</p>
        <p class="stat__value">{{ displayChf(overview.totalRappen, { decimals: 0 }) }}</p>
      </div>
      <div class="stat">
        <p class="stat__label">{{ t('features.dashboard.flexL') }}</p>
        <p class="stat__value">{{ displayChf(overview.flexibleRappen, { decimals: 0 }) }}</p>
        <p class="stat__sub">{{ overview.flexiblePercent }}% {{ t('features.dashboard.ofAll') }}</p>
      </div>
    </div>

    <div class="chips" style="margin-top: 0" role="group">
      <button class="chip" :aria-pressed="onlyFlexible" @click="onlyFlexible = true">
        {{ t('features.dashboard.onlyFlexL') }}
      </button>
      <button class="chip" :aria-pressed="!onlyFlexible" @click="onlyFlexible = false">
        {{ t('features.dashboard.allL') }}
      </button>
    </div>

    <BubbleChart :items="shown" :selected="selected" :label="t('features.dashboard.overviewH')" @pick="pick" />

    <ul class="legend">
      <li v-for="g in SPENDING_GROUPS" :key="g">
        <span class="swatch" :class="`sw-${g}`"></span>{{ t(`features.dashboard.groups.${g}`) }}
      </li>
    </ul>

    <div v-if="selectedItem && selectedItem.kind === 'flexible'" class="tone tone--action" role="status">
      <DsIcon name="action" />
      <div class="tone__content">
        <p class="tone__title">
          {{ cat(selectedItem.key, 'name') }} · {{ displayChf(selectedItem.amountRappen, { decimals: 0 }) }}
          {{ t('common.perMonth') }}
        </p>
        <p>
          {{ selectedItem.percent }}% {{ t('features.dashboard.shareL') }} · {{ incomeShare }}%
          {{ t('features.dashboard.incomeShareL') }}.
        </p>
        <template v-if="selectedAlt">
          <p><b>{{ altTitle }}</b></p>
          <p>{{ altTip }}</p>
        </template>
        <p v-else-if="flexTip">{{ flexTip }}</p>
        <button class="btn btn--secondary" @click="openIdeas">
          {{ t('features.dashboard.ideasBtn') }}
        </button>
      </div>
    </div>
    <div v-else-if="selectedItem" class="card card--plain" role="status">
      <div class="card__body">
        <p class="card__title">
          {{ cat(selectedItem.key, 'name') }} · {{ displayChf(selectedItem.amountRappen, { decimals: 0 }) }}
          {{ t('common.perMonth') }}
        </p>
        <p>
          {{ selectedItem.percent }}% {{ t('features.dashboard.shareL') }} · {{ incomeShare }}%
          {{ t('features.dashboard.incomeShareL') }}.
        </p>
        <p v-if="advice || selectedAlt">{{ t('features.dashboard.essentialWhy') }}</p>
        <p v-else>{{ t('features.dashboard.essentialNote') }}</p>
        <p v-if="advice">{{ advice }}</p>
        <template v-if="selectedAlt">
          <p><b>{{ t('features.dashboard.cheaperWay') }}: {{ altTitle }}</b></p>
          <p>{{ altTip }}</p>
          <button class="btn btn--secondary" @click="openIdeas">
            {{ t('features.dashboard.ideasBtn') }}
          </button>
        </template>
      </div>
    </div>
    <p v-else class="hint" role="status">{{ t('features.dashboard.pickP') }}</p>

    <div v-for="g in grouped" :key="g.group" class="section">
      <p class="section__title group-title">
        <span>{{ t(`features.dashboard.groups.${g.group}`) }}</span>
        <span class="amount">{{ displayChf(g.totalRappen, { decimals: 0 }) }} · {{ g.percent }}%</span>
      </p>
      <ul class="rank">
        <li v-for="item in g.items" :key="item.key">
          <span class="cat-badge" :class="`cat-badge--${groupOf(item.key)}`" aria-hidden="true">
            <q-icon :name="icon(iconOf(item.key))" size="20px" />
          </span>
          <span class="rank__name">
            {{ cat(item.key, 'name') }}
            <span class="visually-hidden">, {{ t(`features.dashboard.groups.${groupOf(item.key)}`) }}</span>
          </span>
          <span class="amount">{{ displayChf(item.amountRappen, { decimals: 0 }) }}</span>
          <span class="rank__share">{{ item.percent }}%</span>
        </li>
      </ul>
    </div>

  </div>
</template>
