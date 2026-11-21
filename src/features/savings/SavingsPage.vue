<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { goalPlan } from '../../engines/savings/goalPlan';
import { paymentsPerMonth } from '../../engines/insights/monthly';
import { demoNewProjectRappen, demoSavedRappen, projectIcons } from '../../shared/demo-data';
import { savingsCuts, transactions, yearMonths } from '../../shared/statements';
import { chfToRappen, displayChf } from '../../shared/money';
import DsIcon from '../../shared/ui/DsIcon.vue';
import { icon } from '../../shared/ui/icons';
import { addProject, MAX_IMAGE_BYTES, projectsState, removeProject, type SavingsProject } from './projects';
import InvestIdeas from '../invest/InvestIdeas.vue';

const i18n = useI18n();
const { t } = i18n;

// Savings ideas, computed from the statements (flexible spending only, biggest first).
const ideas = savingsCuts.map((c) => ({ ...c, perMonth: paymentsPerMonth(transactions, yearMonths, c.key) }));

const current = computed<SavingsProject>(
  () => projectsState.projects.find((p) => p.key === projectsState.selected) ?? projectsState.projects[0]!,
);
const projectName = (p: SavingsProject) => (p.preset ? t(`features.savings.goals.${p.key}`) : (p.name ?? ''));

const goalFrancs = ref(Math.round(current.value.amountRappen / 100));
const savedFrancs = ref(Math.round(demoSavedRappen / 100));
const months = ref(24);
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
    selectedSavingsRappen: ideas.filter((i) => plan.value.has(i.key)).map((i) => i.saveRappen),
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
      <div v-for="i in ideas" :key="i.key" class="card">
        <DsIcon name="bulb" />
        <div class="card__body">
          <p class="card__title">{{ cat(i.key, 'name') }}</p>
          <p class="line__original">{{ detail(i.perMonth) }}</p>
          <div class="result">
            <span>{{ t('features.savings.nowL') }}</span>
            <span class="amount">{{ chf0(i.nowRappen) }} {{ t('common.perMonth') }}</span>
          </div>
          <div class="result">
            <span>{{ t('features.savings.saveL') }}</span>
            <span class="amount positive">{{ chf0(i.saveRappen) }} {{ t('common.perMonth') }}</span>
          </div>
          <p>{{ cat(i.key, 'tip') }}</p>
          <p v-if="hasWit(i.key)" class="wit" style="margin: 0 0 var(--sp-sm)">{{ cat(i.key, 'wit') }}</p>
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

    <InvestIdeas class="section" />
  </div>
</template>
