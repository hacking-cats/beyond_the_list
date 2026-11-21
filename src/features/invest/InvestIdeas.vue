<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import products from '../../../content/invest-products.json';
import links from '../../../content/postfinance-links.json';
import { matchProducts, productLanguage, type InvestProduct } from '../../engines/invest/matchProducts';
import { hasSalary } from '../../shared/statements';
import { displayChf } from '../../shared/money';
import { icon } from '../../shared/ui/icons';

// PostFinance saving-plan products as ideas (not advice), each with its official link.
// Used at the bottom of the Savings page (decision: no extra tab, see decision 0003).
const { t, locale } = useI18n();

const ideas = computed(() => matchProducts({ hasEarnedIncome: hasSalary }, products as InvestProduct[], locale.value));
const compareUrl = computed(() => links.savingPlanComparison[productLanguage(locale.value)]);
const p = (key: string, field: 'name' | 'what' | 'fees') => t(`features.invest.products.${key}.${field}`);
</script>

<template>
  <section class="invest" aria-labelledby="invest-h">
    <p id="invest-h" class="card__title">{{ t('features.invest.sectionH') }}</p>
    <p class="hint">{{ t('features.invest.intro') }}</p>

    <div class="invest__note" role="note">
      <q-icon :name="icon('info')" size="20px" aria-hidden="true" />
      <p>
        <b>{{ t('features.invest.noteTitle') }}</b> {{ t('features.invest.noteBody') }}
      </p>
    </div>

    <p class="section__title">{{ t('features.invest.listH') }}</p>
    <ul class="invest__list">
      <li v-for="idea in ideas" :key="idea.key" class="invest__card">
        <div class="invest__top">
          <span class="invest__icon" aria-hidden="true"><q-icon :name="icon(idea.icon)" size="22px" /></span>
          <div>
            <p class="invest__name">{{ p(idea.key, 'name') }}</p>
            <p class="invest__what">{{ p(idea.key, 'what') }}</p>
            <span v-if="idea.easiestStart" class="invest__tag">{{ t('features.invest.easiestStart') }}</span>
          </div>
        </div>
        <p class="invest__facts">
          <span class="invest__fact">{{ t('features.invest.fromL') }}: <b class="amount">{{ displayChf(idea.minRappen, { decimals: 0 }) }}</b></span>
          <span class="invest__fact">{{ t('features.invest.feesL') }}: <b>{{ p(idea.key, 'fees') }}</b></span>
        </p>
        <a class="invest__link" :href="idea.url" target="_blank" rel="noopener noreferrer">
          {{ t('features.invest.linkBtn') }}
          <q-icon :name="icon('open_in_new')" size="18px" aria-hidden="true" />
          <span class="visually-hidden">{{ p(idea.key, 'name') }}, {{ t('features.invest.opensSite') }}</span>
        </a>
      </li>
    </ul>

    <a class="invest__all" :href="compareUrl" target="_blank" rel="noopener noreferrer">
      {{ t('features.invest.compareLink') }}
      <q-icon :name="icon('open_in_new')" size="18px" aria-hidden="true" />
      <span class="visually-hidden">{{ t('features.invest.opensSite') }}</span>
    </a>
    <p class="invest__checked">{{ t('features.invest.checked') }}</p>
  </section>
</template>
