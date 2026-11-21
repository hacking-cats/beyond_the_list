<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CategoryShare } from '../../engines/insights/categoryShares';
import { formatChf } from '../../shared/money';
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
    const short = t(`features.dashboard.cats.${item.key}.short`);
    const big = c.r >= 55;
    const fits = c.r >= 26 && Math.max(short.length * (big ? 8 : 7), 56) <= 2 * c.r - 12;
    return { ...c, item, short, fits, big, francs: Math.round(item.amountRappen / 100) };
  }),
);
const name = (key: string) => t(`features.dashboard.cats.${key}.name`);
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
        :aria-label="`${name(b.item.key)}: ${formatChf(b.item.amountRappen, { decimals: 0 })}, ${b.item.percent}%, ${t(`features.dashboard.${b.item.kind}`)}`"
        @click="emit('pick', b.item.key)"
        @keydown="onKey($event, b.item.key)"
      >
        <circle :r="b.r" :fill="b.item.kind === 'flexible' ? 'var(--grapefruit)' : 'var(--petrol)'" />
        <template v-if="b.fits">
          <text
            dy="-0.2em"
            :font-size="b.big ? 14 : 12"
            font-weight="600"
            :fill="b.item.kind === 'flexible' ? 'var(--text)' : 'var(--text-inverse)'"
          >{{ b.short }}</text>
          <text
            dy="1.1em"
            :font-size="b.big ? 14 : 12"
            :fill="b.item.kind === 'flexible' ? 'var(--text)' : 'var(--text-inverse)'"
          >{{ formatChf(b.item.amountRappen, { decimals: 0 }) }}</text>
        </template>
        <text
          v-else-if="b.r >= 14"
          dy="0.35em"
          font-size="12"
          font-weight="600"
          :fill="b.item.kind === 'flexible' ? 'var(--text)' : 'var(--text-inverse)'"
        >{{ b.francs }}</text>
      </g>
    </svg>
  </div>
</template>
