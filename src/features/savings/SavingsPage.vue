<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { goalPlan } from '../../engines/savings/goalPlan';
import { demoGoals, demoIdeas, demoSavedRappen, type GoalKey } from '../../shared/demo-data';
import { chfToRappen, formatChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';

const { t } = useI18n();

const goalKeys = Object.keys(demoGoals) as GoalKey[];
const goalKey = ref<GoalKey>('car');
const goalFrancs = ref(Math.round(demoGoals.car / 100));
const savedFrancs = ref(Math.round(demoSavedRappen / 100));
const months = ref(24);
const plan = ref(new Set<string>());
const started = ref(false);

function pickGoal(key: GoalKey) {
  goalKey.value = key;
  goalFrancs.value = Math.round(demoGoals[key] / 100);
  started.value = false;
}
function togglePlan(key: string) {
  const next = new Set(plan.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  plan.value = next;
}

const result = computed(() =>
  goalPlan({
    goalRappen: chfToRappen(goalFrancs.value),
    savedRappen: chfToRappen(savedFrancs.value),
    months: months.value,
    selectedSavingsRappen: demoIdeas.filter((i) => plan.value.has(i.key)).map((i) => i.saveRappen),
  }),
);
const idea = (key: string, field: 'name' | 'detail' | 'tip' | 'wit') => t(`features.savings.ideas.${key}.${field}`);
const chf0 = (r: number) => formatChf(r, { decimals: 0 });
</script>

<template>
  <div>
    <p class="card__title">{{ t('features.savings.goalH') }}</p>
    <div class="chips" style="margin-top: 0" role="group" :aria-label="t('features.savings.goalH')">
      <button v-for="k in goalKeys" :key="k" class="chip" :aria-pressed="k === goalKey" @click="pickGoal(k)">
        {{ t(`features.savings.goals.${k}`) }}
      </button>
    </div>

    <label class="field">
      {{ t('features.savings.targetL') }}: <b class="amount">{{ chf0(chfToRappen(goalFrancs)) }}</b>
      <input v-model.number="goalFrancs" type="range" min="1000" max="80000" step="500" />
    </label>
    <label class="field">
      {{ t('features.savings.savedL') }}: <b class="amount">{{ chf0(chfToRappen(savedFrancs)) }}</b>
      <input v-model.number="savedFrancs" type="range" min="0" max="20000" step="100" />
    </label>
    <label class="field">
      {{ t('features.savings.whenL') }}: <b>{{ months }}</b>
      <input v-model.number="months" type="range" min="3" max="60" />
    </label>
    <div class="result">
      <span>{{ t('features.savings.needH') }}</span>
      <span class="result__amount">{{ chf0(result.neededPerMonthRappen) }}</span>
    </div>

    <div class="section">
      <p class="section__title">{{ t('features.savings.ideasH') }}</p>
      <p class="hint">{{ t('features.savings.ideasP') }}</p>
      <div v-for="i in demoIdeas" :key="i.key" class="card">
        <DsIcon name="bulb" />
        <div class="card__body">
          <p class="card__title">{{ idea(i.key, 'name') }}</p>
          <p class="line__original">{{ idea(i.key, 'detail') }}</p>
          <div class="result">
            <span>{{ t('features.savings.nowL') }}</span>
            <span class="amount">{{ chf0(i.nowRappen) }} {{ t('common.perMonth') }}</span>
          </div>
          <div class="result">
            <span>{{ t('features.savings.saveL') }}</span>
            <span class="amount positive">{{ chf0(i.saveRappen) }} {{ t('common.perMonth') }}</span>
          </div>
          <p>{{ idea(i.key, 'tip') }}</p>
          <p v-if="i.hasWit" class="wit" style="margin: 0 0 var(--sp-sm)">{{ idea(i.key, 'wit') }}</p>
          <button class="chip" :aria-pressed="plan.has(i.key)" @click="togglePlan(i.key)">
            {{ plan.has(i.key) ? t('features.savings.addedL') : t('features.savings.addL') }}
          </button>
        </div>
      </div>
    </div>

    <div class="worth" role="status">
      <DsIcon name="jump" />
      <div class="card__body">
        <p class="worth__title">{{ t('features.savings.planH') }}</p>
        <template v-if="result.monthsAtFoundPace !== null">
          <p style="margin: 0">{{ t('features.savings.planFound') }}</p>
          <p class="result__amount" style="margin: 0 0 var(--sp-sm)">
            {{ chf0(result.foundPerMonthRappen) }} {{ t('common.perMonth') }}
          </p>
          <p>
            {{ t('features.savings.planReach') }} <b>{{ result.monthsAtFoundPace }} {{ t('common.months') }}</b>.
          </p>
          <p v-if="result.onTrack" class="done">{{ t('features.savings.planOk') }}</p>
          <div v-else class="result" style="margin: 0">
            <span>{{ t('features.savings.planShort') }}</span>
            <span class="amount">{{ chf0(result.missingPerMonthRappen) }}</span>
          </div>
        </template>
        <p v-else>{{ t('features.savings.planNone') }}</p>
      </div>
    </div>
    <button class="btn btn--primary btn--block" style="margin-top: var(--sp-lg)" @click="started = true">{{ t('features.savings.startBtn') }}</button>
    <p class="done" role="status">{{ started ? t('features.savings.started') : '' }}</p>

  </div>
</template>
