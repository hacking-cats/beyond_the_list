<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { goalPlan } from '../../engines/savings/goalPlan';
import { savingWithCap } from '../../engines/savings/alternatives';
import { paymentsPerMonth } from '../../engines/insights/monthly';
import { savingsAlternatives, savingsCuts, transactions, yearMonths } from '../../shared/statements';
import { chfToRappen, displayChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';
import { icon } from '../../shared/ui/icons';
import { goalState, projectsState, type SavingsProject } from './projects';
import InvestIdeas from '../invest/InvestIdeas.vue';
import AdviceBooking from './AdviceBooking.vue';

const i18n = useI18n();
const { t } = i18n;

// Savings ideas, computed from the statements by the engines: first the cheaper alternatives
// found in the user's own payments (content/alternatives.json), then generic cuts for the
// flexible categories that have no specific alternative. Biggest saving first.
interface Idea {
  id: string;
  category: string;
  title: string;
  tip: string;
  wit: string;
  detail: string;
  nowRappen: number;
  saveRappen: number;
}
/** A price for the tip text: whole francs without decimals (89 CHF), else with (0.50 CHF). */
const price = (r: number) => displayChf(r, { decimals: r % 100 === 0 ? 0 : 2 });
const ideas = computed<Idea[]>(() =>
  [
    ...savingsAlternatives.map((a) => {
      const params = { count: a.count, now: chf0(a.nowRappen), alt: price(a.altRappen), total: chf0(a.totalRappen) };
      return {
        id: `alt.${a.key}`,
        category: a.category,
        title: t(`features.savings.alt.${a.key}.title`),
        tip: t(`features.savings.alt.${a.key}.tip`, params),
        wit: '',
        detail: `${a.count} ${t('features.savings.timesL')}`,
        nowRappen: a.nowRappen,
        saveRappen: a.saveRappen,
      };
    }),
    ...savingsCuts.map((c) => ({
      id: `cut.${c.key}`,
      category: c.key,
      title: cat(c.key, 'name'),
      tip: cat(c.key, 'tip'),
      wit: hasWit(c.key) ? cat(c.key, 'wit') : '',
      detail: detail(paymentsPerMonth(transactions, yearMonths, c.key)),
      nowRappen: c.nowRappen,
      saveRappen: c.saveRappen,
    })),
  ].sort((a, b) => b.saveRappen - a.saveRappen),
);

const current = computed<SavingsProject>(
  () => projectsState.projects.find((p) => p.key === projectsState.selected) ?? projectsState.projects[0]!,
);
const projectName = (p: SavingsProject) => (p.preset ? t(`features.savings.goals.${p.key}`) : (p.name ?? ''));
const plan = ref(new Set<string>());
const started = ref(false);

// The in-app purchases idea is a spending cap the user switches on (prototype: no real card
// limit), not a plan chip. The slider starts at the recommended budget from content/alternatives.json.
const CAP_IDEA = 'alt.inAppLimit';
const capIdea = savingsAlternatives.find((a) => `alt.${a.key}` === CAP_IDEA);
const capRecommendedFrancs = Math.round((capIdea?.altRappen ?? 0) / 100);
const capMaxFrancs = Math.max(capRecommendedFrancs, Math.ceil((capIdea?.nowRappen ?? 0) / 1000) * 10);
const capFrancs = ref(capRecommendedFrancs);
const capOn = ref(false);
const capDialog = ref(false);
const capSaveRappen = computed(() => savingWithCap(capIdea?.nowRappen ?? 0, chfToRappen(capFrancs.value)));
const saveOf = (i: Idea) => (i.id === CAP_IDEA ? capSaveRappen.value : i.saveRappen);
function setCap(on: boolean) {
  capOn.value = on;
  const next = new Set(plan.value);
  if (on) next.add(CAP_IDEA);
  else next.delete(CAP_IDEA);
  plan.value = next;
  capDialog.value = on;
}

function togglePlan(key: string) {
  const next = new Set(plan.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  plan.value = next;
}

// Coming from a dashboard bubble (?cat=<category>): that category's ideas first, and scroll to them.
const route = useRoute();
const router = useRouter();
const focus = computed(() => (typeof route.query.cat === 'string' ? route.query.cat : ''));
const focusName = computed(() => (focus.value ? t(`categories.${focus.value}.name`) : ''));
const focusHits = computed(() => ideas.value.filter((i) => i.category === focus.value));
// Without a focus, the game-purchase cap comes first so it is the first thing on the Savings tab.
const capFirst = computed(() => [
  ...ideas.value.filter((i) => i.id === CAP_IDEA),
  ...ideas.value.filter((i) => i.id !== CAP_IDEA),
]);
const shownIdeas = computed(() =>
  focusHits.value.length ? [...focusHits.value, ...ideas.value.filter((i) => i.category !== focus.value)] : capFirst.value,
);
const ideasSection = ref<HTMLElement | null>(null);
onMounted(() => {
  if (focus.value) void nextTick(() => ideasSection.value?.scrollIntoView({ block: 'start' }));
});
function showAll() {
  void router.replace({ path: route.path, query: {} });
}

const result = computed(() =>
  goalPlan({
    goalRappen: chfToRappen(goalState.goalFrancs),
    savedRappen: chfToRappen(goalState.savedFrancs),
    months: goalState.months,
    selectedSavingsRappen: ideas.value.filter((i) => plan.value.has(i.id)).map(saveOf),
  }),
);
const cat = (key: string, field: 'name' | 'tip' | 'wit') => t(`categories.${key}.${field}`);
const hasWit = (key: string) => i18n.te(`categories.${key}.wit`);
const detail = (n: number) =>
  n >= 1 ? `${n} ${t('features.savings.paymentsPerMonth')}` : t('features.savings.nowAndThen');
const chf0 = (r: number) => displayChf(r, { decimals: 0 });
</script>

<template>
  <div>
    <div ref="ideasSection" class="section">
      <p class="section__title">{{ t('features.savings.ideasH') }}</p>
      <div v-if="focus" style="display: flex; align-items: center; justify-content: space-between; gap: var(--sp-sm); margin-bottom: var(--sp-sm)">
        <p v-if="focusHits.length" style="margin: 0">
          <b>{{ t('features.dashboard.focusH') }} {{ focusName }}</b>
        </p>
        <p v-else style="margin: 0">{{ t('features.dashboard.focusNone') }}</p>
        <button class="btn btn--ghost" @click="showAll">{{ t('features.dashboard.focusAll') }}</button>
      </div>
      <p class="hint">{{ t('features.savings.ideasP') }}</p>
      <div v-for="i in shownIdeas" :key="i.id" class="card">
        <DsIcon name="bulb" />
        <div class="card__body">
          <p class="card__title">{{ i.title }}</p>
          <p class="line__original">{{ i.detail }}</p>
          <div class="result">
            <span>{{ t('features.savings.nowL') }}</span>
            <span class="amount">{{ chf0(i.nowRappen) }} {{ t('common.perMonth') }}</span>
          </div>
          <div class="result">
            <span>{{ t('features.savings.saveL') }}</span>
            <span class="amount positive">{{ chf0(saveOf(i)) }} {{ t('common.perMonth') }}</span>
          </div>
          <p>{{ i.tip }}</p>
          <p v-if="i.wit" class="wit" style="margin: 0 0 var(--sp-sm)">{{ i.wit }}</p>
          <div v-if="i.id === CAP_IDEA" class="cap">
            <q-toggle
              :model-value="capOn"
              color="primary"
              size="lg"
              class="cap__toggle"
              :label="t('features.savings.capL')"
              @update:model-value="setCap"
            />
            <label class="field" style="margin-top: 0">
              {{ t('features.savings.capMaxL') }}:
              <b class="amount">{{ chf0(chfToRappen(capFrancs)) }} {{ t('common.perMonth') }}</b>
              <input v-model.number="capFrancs" type="range" min="0" :max="capMaxFrancs" step="5" />
            </label>
            <p class="hint" style="margin: 0">
              {{ t('features.savings.capRec', { amount: chf0(chfToRappen(capRecommendedFrancs)) }) }}
            </p>
          </div>
          <button v-else class="chip" :aria-pressed="plan.has(i.id)" @click="togglePlan(i.id)">
            {{ plan.has(i.id) ? t('features.savings.addedL') : t('features.savings.addL') }}
          </button>
        </div>
      </div>
    </div>

    <div class="worth" role="status">
      <DsIcon name="jump" />
      <div class="card__body">
        <p class="worth__title">{{ t('features.savings.planH') }}</p>
        <p style="margin: 0 0 var(--sp-sm)">
          {{ t('features.savings.planGoal', { name: projectName(current), amount: chf0(chfToRappen(goalState.goalFrancs)), months: goalState.months }) }}
          <RouterLink to="/coming-up">{{ t('features.savings.changeGoal') }}</RouterLink>
        </p>
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

    <AdviceBooking />

    <InvestIdeas class="section" />

    <q-dialog v-model="capDialog">
      <div class="cap-done" role="alertdialog" aria-labelledby="cap-done-h" aria-describedby="cap-done-p">
        <q-icon class="cap-done__icon" :name="icon('task_alt')" size="48px" aria-hidden="true" />
        <h2 id="cap-done-h" class="cap-done__title">{{ t('features.savings.capDoneH') }}</h2>
        <p id="cap-done-p">{{ t('features.savings.capDoneP', { amount: chf0(chfToRappen(capFrancs)) }) }}</p>
        <p>{{ t('features.savings.capDoneSave', { save: chf0(capSaveRappen) }) }}</p>
        <p class="hint">{{ t('features.savings.capProto') }}</p>
        <button class="btn btn--primary btn--block" @click="capDialog = false">{{ t('features.savings.capOk') }}</button>
      </div>
    </q-dialog>

  </div>
</template>

<style scoped>
.cap { display: flex; flex-direction: column; gap: var(--sp-sm); padding-top: var(--sp-sm); border-top: 1px solid var(--border); }
.cap__toggle { margin-inline-start: calc(-1 * var(--sp-sm)); font-weight: 600; }
.cap-done { width: 100%; max-width: 360px; padding: var(--sp-lg); text-align: center;
  background: var(--surface); color: var(--text); font-family: var(--font); border-radius: var(--r-lg); }
.cap-done__icon { color: var(--success-text); }
.cap-done__title { margin: var(--sp-sm) 0; font-size: var(--fs-subtitle); font-weight: 700; line-height: 1.3; }
.cap-done p { margin: 0 0 var(--sp-sm); }
</style>
