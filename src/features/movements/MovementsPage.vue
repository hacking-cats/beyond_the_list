<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Transaction } from '../../engines/ingest/types';
import { formatChf } from '../../shared/money';
import { latestTransactions } from '../../shared/statements';
import DsIcon from '../../shared/ui/DsIcon.vue';

const { t } = useI18n();
const open = ref(new Set<string>());
function toggle(id: string) {
  const next = new Set(open.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  open.value = next;
}

/** Categories that often surprise newcomers: shown with the attention icon. */
const NEW_TO_YOU = new Set(['tax', 'insurance', 'utilities']);
const isNew = (tx: Transaction) => tx.kind === 'expense' && NEW_TO_YOU.has(tx.category ?? '');
const title = (tx: Transaction) =>
  tx.kind === 'transfer' || tx.kind === 'income' ? t(`categories.${tx.kind}.name`) : tx.counterparty;
const day = (tx: Transaction) => `${tx.date.slice(8, 10)}.${tx.date.slice(5, 7)}.`;
const explain = (tx: Transaction) =>
  tx.kind === 'refund'
    ? `${t('categories.refund.explain')} (${t(`categories.${tx.category ?? 'other'}.name`)})`
    : t(`categories.${tx.kind === 'expense' ? (tx.category ?? 'other') : tx.kind}.explain`);
</script>

<template>
  <div>
    <p class="hint">{{ t('features.movements.hint') }}</p>
    <ul class="statement statement--flush">
      <li v-for="tx in latestTransactions" :key="tx.id">
        <button class="line" :aria-expanded="open.has(tx.id)" @click="toggle(tx.id)">
          <span class="line__main">
            <span class="line__merchant">{{ title(tx) }}</span>
            <span v-if="isNew(tx)" class="line__new">{{ t('features.movements.newToYou') }}</span>
            <span v-else-if="tx.kind === 'refund'" class="line__new">{{ t('features.movements.refund') }}</span>
            <span class="line__original">{{ day(tx) }} · {{ tx.originalName }}</span>
          </span>
          <span v-if="isNew(tx)" class="line__flag line__flag--attention">
            <DsIcon name="attention" small :label="t('features.movements.newToYou')" />
          </span>
          <span class="line__amount" :class="{ 'line__amount--in': tx.amountRappen > 0 }">
            {{ formatChf(tx.amountRappen, { sign: true }) }}
          </span>
        </button>
        <div v-if="open.has(tx.id)" class="line-explain reply">
          <p>{{ explain(tx) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
