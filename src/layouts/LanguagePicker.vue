<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { findLanguage, languages, searchLanguages } from '../i18n/languages';
import { icon } from '../shared/ui/icons';

// Header button that opens a bottom sheet: English, Deutsch, Français, Italiano and
// "Other language…", which shows a searchable list of automatically translated languages.
const { t, locale } = useI18n();

const open = ref(false);
const view = ref<'main' | 'other'>('main');
const query = ref('');

const current = computed(() => findLanguage(locale.value));
const mainLanguages = languages.filter((l) => l.group === 'main');
const otherLanguages = languages.filter((l) => l.group === 'other');
const otherSelected = computed(() => current.value?.group === 'other');
const shownOther = computed(() => searchLanguages(otherLanguages, query.value));

function show() {
  view.value = otherSelected.value ? 'other' : 'main';
  query.value = '';
  open.value = true;
}
function pick(code: string) {
  if (!findLanguage(code)?.ready) return;
  locale.value = code;
  open.value = false;
}
</script>

<template>
  <button
    class="lang-btn"
    type="button"
    aria-haspopup="dialog"
    :aria-label="`${t('common.language')}: ${current?.native ?? ''}`"
    @click="show"
  >
    <q-icon :name="icon('language')" size="22px" aria-hidden="true" />
    <span dir="auto">{{ current?.native }}</span>
    <q-icon :name="icon('expand_more')" size="20px" aria-hidden="true" />
  </button>

  <q-dialog v-model="open" position="bottom">
    <div class="lang-sheet" :aria-labelledby="`lang-sheet-h-${view}`">
      <div class="lang-sheet__grab" aria-hidden="true"></div>
      <div class="lang-sheet__head">
        <button v-if="view === 'other'" class="lang-sheet__ib" type="button" :aria-label="t('common.back')" @click="view = 'main'">
          <q-icon class="flip-rtl" :name="icon('arrow_back')" size="24px" />
        </button>
        <h2 :id="`lang-sheet-h-${view}`">
          {{ view === 'main' ? t('common.language') : t('common.langOther').replace('…', '') }}
        </h2>
        <button class="lang-sheet__ib" type="button" :aria-label="t('common.close')" @click="open = false">
          <q-icon :name="icon('close')" size="24px" />
        </button>
      </div>

      <ul v-if="view === 'main'" class="lang-list" role="radiogroup" :aria-label="t('common.language')">
        <li v-for="l in mainLanguages" :key="l.code">
          <button
            class="lang-opt"
            type="button"
            role="radio"
            :aria-checked="locale === l.code"
            :lang="l.code"
            @click="pick(l.code)"
          >
            <span class="lang-opt__radio" aria-hidden="true"></span>
            <span class="lang-opt__name">
              <b dir="auto">{{ l.native }}</b>
              <span lang="en">{{ l.english }}</span>
            </span>
          </button>
        </li>
        <li>
          <button class="lang-opt" type="button" role="radio" :aria-checked="otherSelected" @click="view = 'other'">
            <span class="lang-opt__radio" aria-hidden="true"></span>
            <span class="lang-opt__name">
              <b>{{ t('common.langOther') }}</b>
              <span dir="auto">{{ otherSelected ? current?.native : t('common.langOtherHint') }}</span>
            </span>
            <q-icon class="lang-opt__chev flip-rtl" :name="icon('chevron_right')" size="22px" aria-hidden="true" />
          </button>
        </li>
      </ul>

      <template v-else>
        <q-input
          v-model="query"
          class="lang-sheet__search"
          outlined
          clearable
          type="search"
          :placeholder="t('common.langSearch')"
          :aria-label="t('common.langSearch')"
        >
          <template #prepend><q-icon :name="icon('search')" aria-hidden="true" /></template>
        </q-input>
        <p class="lang-sheet__note">{{ t('common.langAutoNote') }}</p>
        <ul class="lang-list" role="radiogroup" :aria-label="t('common.langOther')">
          <li v-for="l in shownOther" :key="l.code">
            <button
              class="lang-opt"
              type="button"
              role="radio"
              :aria-checked="locale === l.code"
              :aria-disabled="!l.ready"
              :lang="l.code"
              @click="pick(l.code)"
            >
              <span class="lang-opt__radio" aria-hidden="true"></span>
              <span class="lang-opt__name">
                <b :dir="l.rtl ? 'rtl' : 'auto'">{{ l.native }}</b>
                <span lang="en">{{ l.english }}</span>
              </span>
              <span v-if="!l.ready" class="lang-opt__tag">{{ t('common.langSoon') }}</span>
              <span v-else-if="l.rtl" class="lang-opt__tag">{{ t('common.langRtl') }}</span>
            </button>
          </li>
          <li v-if="!shownOther.length" class="lang-sheet__empty">{{ t('common.langNone') }}</li>
        </ul>
      </template>
    </div>
  </q-dialog>
</template>
