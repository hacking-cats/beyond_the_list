<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { goalPlan } from '../../engines/savings/goalPlan';
import { savingWithCap } from '../../engines/savings/alternatives';
import { paymentsPerMonth } from '../../engines/insights/monthly';
import { demoNewProjectRappen, demoSavedRappen, projectIcons } from '../../shared/demo-data';
import { savingsAlternatives, savingsCuts, transactions, yearMonths } from '../../shared/statements';
import { chfToRappen, displayChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';
import { icon } from '../../shared/ui/icons';
import { addProject, MAX_IMAGE_BYTES, projectsState, removeProject, type SavingsProject } from './projects';

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

const goalFrancs = ref(Math.round(current.value.amountRappen / 100));
const savedFrancs = ref(Math.round(demoSavedRappen / 100));
const months = ref(12);
const plan = ref(new Set<string>());
const started = ref(false);

function pickGoal(p: SavingsProject) {
  projectsState.selected = p.key;
  goalFrancs.value = Math.round(p.amountRappen / 100);
  started.value = false;
  adding.value = false;
}

// ---- Add a project of your own -------------------------------------------------
const adding = ref(false);
const newName = ref('');
const newIcon = ref(projectIcons[0]!);
const newImage = ref<string | undefined>(undefined);
const formError = ref('');

function openForm() {
  adding.value = true;
  newName.value = '';
  newIcon.value = projectIcons[0]!;
  newImage.value = undefined;
  formError.value = '';
}
function onPhoto(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    formError.value = t('features.savings.photoWrongType');
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    formError.value = t('features.savings.photoTooBig');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') newImage.value = reader.result;
    formError.value = '';
  };
  reader.readAsDataURL(file);
}
function create() {
  const name = newName.value.trim();
  if (!name) {
    formError.value = t('features.savings.nameRequired');
    return;
  }
  const project = addProject({
    name,
    icon: newIcon.value,
    ...(newImage.value ? { image: newImage.value } : {}),
    amountRappen: demoNewProjectRappen,
  });
  pickGoal(project);
}
function removeCurrent() {
  removeProject(current.value.key);
  goalFrancs.value = Math.round(current.value.amountRappen / 100);
}

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
const shownIdeas = computed(() =>
  focusHits.value.length ? [...focusHits.value, ...ideas.value.filter((i) => i.category !== focus.value)] : ideas.value,
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
    goalRappen: chfToRappen(goalFrancs.value),
    savedRappen: chfToRappen(savedFrancs.value),
    months: months.value,
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
    <p class="card__title">{{ t('features.savings.goalH') }}</p>
    <div class="goals" role="group" :aria-label="t('features.savings.goalH')">
      <button
        v-for="p in projectsState.projects"
        :key="p.key"
        class="goal"
        :aria-pressed="p.key === projectsState.selected"
        :aria-label="projectName(p)"
        :title="projectName(p)"
        @click="pickGoal(p)"
      >
        <img v-if="p.image" :src="p.image" alt="" />
        <q-icon v-else :name="icon(p.icon)" size="26px" aria-hidden="true" />
      </button>
      <button
        class="goal goal--add"
        :aria-pressed="adding"
        :aria-label="t('features.savings.addNew')"
        :title="t('features.savings.addNew')"
        @click="adding ? (adding = false) : openForm()"
      >
        <q-icon :name="icon('add')" size="26px" aria-hidden="true" />
      </button>
    </div>

    <form v-if="adding" class="card card--plain new-project" @submit.prevent="create">
      <p class="card__title">{{ t('features.savings.newH') }}</p>
      <label class="ask__label" for="project-name">{{ t('features.savings.nameL') }}</label>
      <input
        id="project-name"
        v-model="newName"
        class="ask__input"
        maxlength="40"
        autocomplete="off"
        :placeholder="t('features.savings.namePh')"
      />
      <p class="ask__label">{{ t('features.savings.iconL') }}</p>
      <div class="goals" role="radiogroup" :aria-label="t('features.savings.iconL')">
        <button
          v-for="name in projectIcons"
          :key="name"
          type="button"
          class="goal goal--sm"
          role="radio"
          :aria-checked="!newImage && name === newIcon"
          :aria-pressed="!newImage && name === newIcon"
          :aria-label="t(`features.savings.icons.${name}`)"
          :title="t(`features.savings.icons.${name}`)"
          @click="newIcon = name; newImage = undefined"
        >
          <q-icon :name="icon(name)" size="22px" aria-hidden="true" />
        </button>
      </div>
      <p class="ask__label">{{ t('features.savings.photoL') }}</p>
      <div class="photo-row">
        <img v-if="newImage" :src="newImage" alt="" class="photo-preview" />
        <label class="btn btn--secondary">
          <q-icon :name="icon('photo_camera')" size="20px" aria-hidden="true" />
          {{ t('features.savings.photoBtn') }}
          <input type="file" accept="image/*" class="visually-hidden" @change="onPhoto" />
        </label>
        <button v-if="newImage" type="button" class="btn btn--ghost" @click="newImage = undefined">
          {{ t('features.savings.photoRemove') }}
        </button>
      </div>
      <p class="hint" style="margin: 0">{{ t('features.savings.photoNote') }}</p>
      <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      <div class="form-actions">
        <button type="submit" class="btn btn--primary">{{ t('features.savings.createBtn') }}</button>
        <button type="button" class="btn btn--secondary" @click="adding = false">
          {{ t('features.savings.cancelBtn') }}
        </button>
      </div>
    </form>

    <p class="goal-name">
      <span>{{ t('features.savings.savingFor') }}: <b>{{ projectName(current) }}</b></span>
      <button v-if="!current.preset" class="btn btn--ghost" @click="removeCurrent">
        {{ t('features.savings.removeBtn') }}
      </button>
    </p>

    <label class="field">
      {{ t('features.savings.targetL') }}: <b class="amount">{{ chf0(chfToRappen(goalFrancs)) }}</b>
      <input v-model.number="goalFrancs" type="range" min="200" max="30000" step="100" />
    </label>
    <label class="field">
      {{ t('features.savings.savedL') }}: <b class="amount">{{ chf0(chfToRappen(savedFrancs)) }}</b>
      <input v-model.number="savedFrancs" type="range" min="0" max="5000" step="50" />
    </label>
    <label class="field">
      {{ t('features.savings.whenL') }}: <b>{{ months }}</b>
      <input v-model.number="months" type="range" min="3" max="60" />
    </label>
    <div class="result">
      <span>{{ t('features.savings.needH') }}</span>
      <span class="result__amount">{{ chf0(result.neededPerMonthRappen) }}</span>
    </div>

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
