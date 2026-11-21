<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { demoLines } from '../../shared/demo-data';
import { formatChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';

const { t } = useI18n();
const open = ref(new Set<string>());
function toggle(key: string) {
  const next = new Set(open.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  open.value = next;
}
</script>

<template>
  <div>
    <p class="hint">{{ t('features.movements.hint') }}</p>
    <ul class="statement statement--flush">
      <li v-for="line in demoLines" :key="line.key">
        <button class="line" :aria-expanded="open.has(line.key)" @click="toggle(line.key)">
          <span class="line__main">
            <span class="line__merchant">{{ t(`features.movements.lines.${line.key}.name`) }}</span>
            <span v-if="line.newToYou" class="line__new">{{ t('features.movements.newToYou') }}</span>
            <span class="line__original">{{ line.originalName }}</span>
          </span>
          <span v-if="line.newToYou" class="line__flag line__flag--attention">
            <DsIcon name="attention" small :label="t('features.movements.newToYou')" />
          </span>
          <span class="line__amount" :class="{ 'line__amount--in': line.amountRappen > 0 }">
            {{ formatChf(line.amountRappen, { sign: true }) }}
          </span>
        </button>
        <div v-if="open.has(line.key)" class="line-explain reply">
          <p>{{ t(`features.movements.lines.${line.key}.explain`) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
