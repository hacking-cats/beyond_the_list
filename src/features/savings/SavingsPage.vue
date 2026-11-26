<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { goalPlan } from '../../engines/savings/goalPlan';
import { savingWithCap } from '../../engines/savings/alternatives';
import { savingsAlternatives, savingsCuts } from '../../shared/statements';
import { groupOf, iconOf } from '../../shared/transactions';
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
  /** A word or two under the round button. */
  label: string;
  tip: string;
  wit: string;
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
        label: t(`features.savings.altShort.${a.key}`),
        tip: t(`features.savings.alt.${a.key}.tip`, params),
        wit: '',
        nowRappen: a.nowRappen,
        saveRappen: a.saveRappen,
      };
    }),
    ...savingsCuts.map((c) => ({
      id: `cut.${c.key}`,
      category: c.key,
      title: cat(c.key, 'name'),
      label: cat(c.key, 'short'),
      tip: cat(c.key, 'tip'),
      wit: hasWit(c.key) ? cat(c.key, 'wit') : '',
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
/** The limit is on and confirmed: its card leaves the list, a one-line status stays. */
const capDone = ref(false);
function onCapDialogHide() {
  capDone.value = capOn.value;
  // Confirmed: the limit card closes into its round "Games" button.
  if (capOn.value && openIdea.value === CAP_IDEA) openIdea.value = null;
}
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
// The game-purchase cap is always first: a full card until the limit is confirmed, then a round
// button like the other ideas (tap to open it again). The specialist follows the game limit.
// The other ideas are round buttons; tapping one opens its card under that row.
const capItem = computed(() => ideas.value.find((i) => i.id === CAP_IDEA));
/** The cap shows as an open card, without its round button, until it is confirmed. */
const capOpenTop = computed(() => !!capItem.value && !capDone.value);
const gridIdeas = computed(() => {
  const rest = ideas.value.filter((i) => i.id !== CAP_IDEA);
  const ordered = focusHits.value.length
    ? [...rest.filter((i) => i.category === focus.value), ...rest.filter((i) => i.category !== focus.value)]
    : rest;
  return capItem.value ? [capItem.value, ...ordered] : ordered;
});
const openIdea = ref<string | null>(null);
function toggleIdea(id: string) {
  openIdea.value = openIdea.value === id ? null : id;
}
const isOpen = (i: Idea) => (i.id === CAP_IDEA && capOpenTop.value) || openIdea.value === i.id;
const ideasSection = ref<HTMLElement | null>(null);
onMounted(() => {
  if (!focus.value) return;
  const hit = gridIdeas.value.find((i) => i.category === focus.value);
  openIdea.value = hit && !(hit.id === CAP_IDEA && capOpenTop.value) ? hit.id : null;
  void nextTick(() => ideasSection.value?.scrollIntoView({ block: 'start' }));
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
const cat = (key: string, field: 'name' | 'short' | 'tip' | 'wit') => t(`categories.${key}.${field}`);
const hasWit = (key: string) => i18n.te(`categories.${key}.wit`);
const chf0 = (r: number) => displayChf(r, { decimals: 0 });
/** Under a round button: the saving, or for the confirmed game limit the limit itself. */
const dotSub = (i: Idea) =>
  i.id === CAP_IDEA && capOn.value ? t('features.savings.capStatus', { amount: chf0(chfToRappen(capFrancs.value)) }) : chf0(saveOf(i));
</script>

<template>
  <div>
    <h2 class="page-heading">{{ t('features.savings.title') }}</h2>
    <div ref="ideasSection" class="section">
      <p class="section__title">{{ t('features.savings.ideasH') }}</p>
      <div v-if="focus" style="display: flex; align-items: center; justify-content: space-between; gap: var(--sp-sm); margin-bottom: var(--sp-sm)">
        <p v-if="focusHits.length" style="margin: 0">
          <b>{{ t('features.dashboard.focusH') }} {{ focusName }}</b>
        </p>
        <p v-else style="margin: 0">{{ t('features.dashboard.focusNone') }}</p>
        <button class="btn btn--ghost" @click="showAll">{{ t('features.dashboard.focusAll') }}</button>
      </div>
      <p v-if="!capOpenTop" class="hint">{{ t('features.savings.ideasTap') }}</p>
      <div class="idea-grid">
        <template v-for="i in gridIdeas" :key="i.id">
          <button
            v-if="!(i.id === CAP_IDEA && capOpenTop)"
            class="idea-dot"
            :class="`idea-dot--${groupOf(i.category)}`"
            :aria-expanded="openIdea === i.id"
            :aria-controls="`idea-${i.id}`"
            :aria-label="`${i.title}, ${dotSub(i)}`"
            @click="toggleIdea(i.id)"
          >
            <span class="idea-dot__circle">
              <q-icon :name="icon(iconOf(i.category))" size="26px" aria-hidden="true" />
              <span v-if="plan.has(i.id)" class="idea-dot__check" aria-hidden="true">✓</span>
            </span>
            <span class="idea-dot__label">{{ i.label }}</span>
            <span class="idea-dot__save amount">{{ dotSub(i) }}</span>
          </button>
          <div v-if="isOpen(i)" :id="`idea-${i.id}`" class="card idea idea--open">
            <DsIcon v-if="i.id === CAP_IDEA && capOpenTop" name="bulb" />
            <div class="card__body">
              <p class="card__title">{{ i.title }}</p>
              <p class="idea__nums">
                <span>{{ t('features.savings.nowShort') }} <b class="amount">{{ chf0(i.nowRappen) }}</b></span>
                <span class="positive">{{ t('features.savings.saveShort') }} <b class="amount">{{ chf0(saveOf(i)) }}</b> {{ t('common.perMonth') }}</span>
              </p>
              <p class="idea__tip">{{ i.tip }}</p>
              <p v-if="i.wit" class="wit idea__tip">{{ i.wit }}</p>
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
          <p v-if="i.id === CAP_IDEA && capOpenTop" class="hint idea-grid__full" style="margin: 0">{{ t('features.savings.ideasTap') }}</p>
        </template>
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

    <InvestIdeas class="section" />

    <!-- Talk to a specialist: at the end of the page, after "Compare all saving plans" -->
    <div class="section"><AdviceBooking /></div>

    <q-dialog v-model="capDialog" @hide="onCapDialogHide">
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
.idea { margin-bottom: var(--sp-sm); padding: var(--sp-sm) var(--sp-md); gap: var(--sp-sm); }
.idea .card__title { margin: 0; }
.idea__nums { display: flex; flex-wrap: wrap; gap: 0 var(--sp-md); margin: 2px 0 var(--sp-xs); font-size: var(--fs-small); color: var(--text-secondary); }
.idea__nums .positive { color: var(--success-text); }
.idea__tip { margin: 0 0 var(--sp-sm); font-size: var(--fs-small); line-height: 1.4; }
.idea-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); grid-auto-flow: row dense;
  gap: var(--sp-md) var(--sp-xs); margin-top: var(--sp-sm); }
.idea-dot { display: flex; flex-direction: column; align-items: center; gap: 2px; min-height: var(--touch); padding: 0;
  border: 0; background: none; color: var(--text); font: inherit; cursor: pointer; }
.idea-dot__circle { position: relative; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%;
  transition: box-shadow 0.15s; }
.idea-dot--cutBack .idea-dot__circle { background: var(--red); color: var(--text-inverse); }
.idea-dot--recurring .idea-dot__circle { background: var(--petrol); color: var(--text-inverse); }
.idea-dot--occasional .idea-dot__circle { background: var(--petrol-light); color: var(--petrol); box-shadow: inset 0 0 0 1px var(--petrol); }
.idea-dot[aria-expanded='true'] .idea-dot__circle { box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px var(--petrol); }
.idea-dot:focus-visible { outline: none; }
.idea-dot:focus-visible .idea-dot__circle { outline: 3px solid var(--petrol); outline-offset: 4px; }
.idea-dot__check { position: absolute; inset-block-start: -4px; inset-inline-end: -4px; display: grid; place-items: center;
  width: 22px; height: 22px; border: 2px solid var(--surface); border-radius: 50%; background: var(--success-text);
  color: var(--text-inverse); font-size: 12px; font-weight: 700; }
.idea-dot__label { font-size: var(--fs-caption); line-height: 1.2; text-align: center; }
.idea-dot__save { font-size: var(--fs-caption); font-weight: 700; color: var(--success-text); }
.idea--open, .idea-grid__full { grid-column: 1 / -1; margin: 0; }
.cap { display: flex; flex-direction: column; gap: var(--sp-sm); padding-top: var(--sp-sm); border-top: 1px solid var(--border); }
.cap__toggle { margin-inline-start: calc(-1 * var(--sp-sm)); font-weight: 600; }
.cap-done { width: 100%; max-width: 360px; padding: var(--sp-lg); text-align: center;
  background: var(--surface); color: var(--text); font-family: var(--font); border-radius: var(--r-lg); }
.cap-done__icon { color: var(--success-text); }
.cap-done__title { margin: var(--sp-sm) 0; font-size: var(--fs-subtitle); font-weight: 700; line-height: 1.3; }
.cap-done p { margin: 0 0 var(--sp-sm); }
</style>
