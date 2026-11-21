<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CategoryShare } from '../../engines/insights/categoryShares';
import { displayChf } from '../../shared/money';
import { iconOf } from '../../shared/transactions';
import { groupOf, type SpendingGroup } from '../../shared/transactions';
import { iconPaths } from '../../shared/ui/icons';
import { packCircles } from './packCircles';

const props = defineProps<{ items: CategoryShare[]; selected: string | null; label: string }>();
const emit = defineEmits<{ pick: [key: string] }>();
const { t } = useI18n();

const host = ref<HTMLElement | null>(null);
const width = ref(328);
let observer: ResizeObserver | null = null;
onMounted(() => {
  if (!host.value) return;
  width.value = Math.max(260, host.value.clientWidth);
  observer = new ResizeObserver(([entry]) => {
    if (entry) width.value = Math.max(260, entry.contentRect.width);
  });
  observer.observe(host.value);
});
onBeforeUnmount(() => observer?.disconnect());

const packing = computed(() => packCircles(props.items.map((i) => i.amountRappen), width.value));
const bubbles = computed(() =>
  packing.value.circles.map((c) => {
    const item = props.items[c.index]!;
    const big = c.r >= 55;
    const amount = displayChf(item.amountRappen, { decimals: 0 });
    // Icon above the amount when both fit; otherwise the icon alone (the amount is in the list).
    const withAmount = c.r >= 30 && (amount.length - 2) * (big ? 8 : 7) <= 2 * c.r - 10; // -2: bidi marks
    const iconSize = withAmount ? (big ? 30 : 24) : Math.round(Math.min(24, Math.max(12, c.r * 1.1)));
    return {
      ...c,
      item,
      big,
      amount,
      withAmount,
      showIcon: c.r >= 9,
      iconSize,
      iconY: withAmount ? -iconSize + 2 : -iconSize / 2,
      paths: iconPaths(iconOf(item.key)),
    };
  }),
);
const name = (key: string) => t(`categories.${key}.name`);
// PostFinance colours per spending group: petrol = essentials, recurring; light petrol =
// essentials, non-recurring (outlined in petrol); grapefruit = could cut back, the only alert
// colour. White text on petrol, graphite on the other two.
const FILL: Record<SpendingGroup, string> = {
  recurring: 'var(--petrol)',
  occasional: 'var(--petrol-light)',
  cutBack: 'var(--grapefruit)',
};
const ink = (key: string) => (groupOf(key) === 'recurring' ? 'var(--text-inverse)' : 'var(--text)');
function onKey(e: KeyboardEvent, key: string) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    emit('pick', key);
  }
}
</script>

<template>
  <div ref="host">
    <svg
      class="bubbles"
      role="group"
      :aria-label="props.label"
      :viewBox="`0 0 ${packing.width} ${Math.ceil(packing.height)}`"
    >
      <g
        v-for="b in bubbles"
        :key="b.item.key"
        class="bubble"
        :class="{ 'is-dim': props.selected && props.selected !== b.item.key, 'is-sel': props.selected === b.item.key }"
        :transform="`translate(${b.x},${b.y})`"
        tabindex="0"
        role="button"
        :aria-label="`${name(b.item.key)}: ${b.amount}, ${b.item.percent}%, ${t(`features.dashboard.groups.${groupOf(b.item.key)}`)}`"
        @click="emit('pick', b.item.key)"
        @keydown="onKey($event, b.item.key)"
      >
        <circle :r="b.r" :class="`bubble__mark--${groupOf(b.item.key)}`" :fill="FILL[groupOf(b.item.key)]" />
        <g
          v-if="b.showIcon"
          class="bubble__icon"
          aria-hidden="true"
          :transform="`translate(${-b.iconSize / 2},${b.iconY}) scale(${b.iconSize / 24})`"
        >
          <path v-for="(p, i) in b.paths" :key="i" :d="p.d" :fill="p.hidden ? 'none' : ink(b.item.key)" />
        </g>
        <text v-if="b.withAmount" dy="1.1em" :font-size="b.big ? 14 : 12" :fill="ink(b.item.key)">{{ b.amount }}</text>
      </g>
    </svg>
  </div>
</template>
