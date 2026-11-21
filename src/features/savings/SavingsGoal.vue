<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { goalPlan } from '../../engines/savings/goalPlan';
import { demoNewProjectRappen, projectIcons } from '../../shared/demo-data';
import { chfToRappen, displayChf } from '../../shared/money';
import { icon } from '../../shared/ui/icons';
import {
  addProject,
  goalState,
  MAX_IMAGE_BYTES,
  projectsState,
  removeProject,
  selectGoal,
  type SavingsProject,
} from './projects';

// The savings goal: pick or add a goal, set amount, already saved and months. Shown on the
// Coming up tab; the Savings tab reads the same goal (goalState) for the plan.
const { t } = useI18n();

const current = computed<SavingsProject>(
  () => projectsState.projects.find((p) => p.key === projectsState.selected) ?? projectsState.projects[0]!,
);
const projectName = (p: SavingsProject) => (p.preset ? t(`features.savings.goals.${p.key}`) : (p.name ?? ''));

function pickGoal(p: SavingsProject) {
  selectGoal(p.key);
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
}

const neededPerMonthRappen = computed(
  () =>
    goalPlan({
      goalRappen: chfToRappen(goalState.goalFrancs),
      savedRappen: chfToRappen(goalState.savedFrancs),
      months: goalState.months,
      selectedSavingsRappen: [],
    }).neededPerMonthRappen,
);
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
    {{ t('features.savings.targetL') }}: <b class="amount">{{ chf0(chfToRappen(goalState.goalFrancs)) }}</b>
    <input v-model.number="goalState.goalFrancs" type="range" min="200" max="30000" step="100" />
  </label>
  <label class="field">
    {{ t('features.savings.savedL') }}: <b class="amount">{{ chf0(chfToRappen(goalState.savedFrancs)) }}</b>
    <input v-model.number="goalState.savedFrancs" type="range" min="0" max="5000" step="50" />
  </label>
  <label class="field">
    {{ t('features.savings.whenL') }}: <b>{{ goalState.months }}</b>
    <input v-model.number="goalState.months" type="range" min="3" max="60" />
  </label>
  <div class="result">
    <span>{{ t('features.savings.needH') }}</span>
    <span class="result__amount">{{ chf0(neededPerMonthRappen) }}</span>
  </div>
  </div>
</template>
