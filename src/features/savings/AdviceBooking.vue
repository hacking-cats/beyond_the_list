<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import links from '../../../content/postfinance-links.json';
import { firstFreeDay, sampleSlots, type AdviceDay } from '../../engines/advice/sampleSlots';
import { productLanguage } from '../../engines/invest/matchProducts';
import { intlLocale } from '../../i18n/languages';
import { icon } from '../../shared/ui/icons';

// "Talk to a PostFinance specialist": invitation card + booking sheet with SAMPLE times.
// PostFinance has no public booking interface, so the last step says it is a prototype and
// shows how to book for real (PostFinance App / e-finance, or by phone).
const { t, locale } = useI18n();

type Topic = 'saving' | 'investing' | 'retirement';
type Place = 'branch' | 'video';
const topics: Topic[] = ['saving', 'investing', 'retirement'];
const places: { key: Place; icon: string }[] = [
  { key: 'branch', icon: 'storefront' },
  { key: 'video', icon: 'videocam' },
];

const open = ref(false);
const step = ref<'pick' | 'done'>('pick');
const topic = ref<Topic>('saving');
const place = ref<Place>('branch');
const days = ref<AdviceDay[]>([]);
const day = ref<AdviceDay | undefined>();
const time = ref<string | null>(null);

const adviceUrl = computed(() => links.personalAdvice[productLanguage(locale.value)]);
const phone = links.advicePhone;

const fmt = (iso: string, options: Intl.DateTimeFormatOptions) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale(locale.value), { ...options, timeZone: 'UTC' }).format(
    new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)),
  );
};
const weekdayShort = (d: AdviceDay) => fmt(d.date, { weekday: 'short' });
const dayNumber = (d: AdviceDay) => fmt(d.date, { day: 'numeric' });
const dayLong = (d: AdviceDay) => fmt(d.date, { weekday: 'long', day: 'numeric', month: 'long' });
const monthLabel = computed(() => (day.value ? fmt(day.value.date, { month: 'long', year: 'numeric' }) : ''));

function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function show() {
  days.value = sampleSlots(todayIso());
  day.value = firstFreeDay(days.value);
  time.value = null;
  step.value = 'pick';
  open.value = true;
}
function pickDay(d: AdviceDay) {
  if (!d.hasFree) return;
  day.value = d;
  time.value = null;
}
function pickTime(slot: { time: string; free: boolean }) {
  if (slot.free) time.value = slot.time;
}
const where = computed(() => (place.value === 'branch' ? t('features.savings.advice.nearYou') : t('features.savings.advice.byVideo')));
</script>

<template>
  <section class="advice-card" aria-labelledby="advice-h">
    <span class="advice-card__icon" aria-hidden="true"><q-icon :name="icon('support_agent')" size="24px" /></span>
    <div>
      <h2 id="advice-h" class="advice-card__title">{{ t('features.savings.advice.cardH') }}</h2>
      <p class="advice-card__text">{{ t('features.savings.advice.cardP') }}</p>
      <button class="btn btn--secondary advice-card__btn" type="button" aria-haspopup="dialog" @click="show">
        <q-icon :name="icon('event')" size="20px" aria-hidden="true" />
        {{ t('features.savings.advice.cardBtn') }}
      </button>
      <p class="advice-card__sub">{{ t('features.savings.advice.cardSub') }}</p>
    </div>
  </section>

  <q-dialog v-model="open" position="bottom">
    <div class="advice-sheet" :aria-labelledby="step === 'pick' ? 'advice-sheet-h' : 'advice-done-h'">
      <div class="lang-sheet__grab" aria-hidden="true"></div>
      <div class="lang-sheet__head">
        <h2 v-if="step === 'pick'" id="advice-sheet-h">{{ t('features.savings.advice.sheetH') }}</h2>
        <span v-else class="advice-sheet__spacer"></span>
        <button class="lang-sheet__ib" type="button" :aria-label="t('common.close')" @click="open = false">
          <q-icon :name="icon('close')" size="24px" />
        </button>
      </div>

      <div v-if="step === 'pick'" class="advice-sheet__body">
        <p id="advice-topic-l" class="advice-sheet__label">{{ t('features.savings.advice.topicL') }}</p>
        <div class="advice-sheet__row" role="radiogroup" aria-labelledby="advice-topic-l">
          <button
            v-for="k in topics"
            :key="k"
            class="advice-chip"
            type="button"
            role="radio"
            :aria-checked="topic === k"
            @click="topic = k"
          >
            {{ t(`features.savings.advice.topics.${k}`) }}
          </button>
        </div>

        <p id="advice-place-l" class="advice-sheet__label">{{ t('features.savings.advice.placeL') }}</p>
        <div class="advice-sheet__row" role="radiogroup" aria-labelledby="advice-place-l">
          <button
            v-for="p in places"
            :key="p.key"
            class="advice-chip"
            type="button"
            role="radio"
            :aria-checked="place === p.key"
            @click="place = p.key"
          >
            <q-icon :name="icon(p.icon)" size="18px" aria-hidden="true" />
            {{ t(`features.savings.advice.places.${p.key}`) }}
          </button>
        </div>

        <p class="advice-sheet__month">{{ monthLabel }}</p>
        <div class="advice-days" role="radiogroup" :aria-label="t('features.savings.advice.dayL')">
          <button
            v-for="d in days"
            :key="d.date"
            class="advice-day"
            type="button"
            role="radio"
            :aria-checked="day?.date === d.date"
            :aria-disabled="!d.hasFree"
            :aria-label="`${dayLong(d)}${d.hasFree ? '' : ', ' + t('features.savings.advice.full')}`"
            @click="pickDay(d)"
          >
            <span>{{ weekdayShort(d) }}</span>
            <b>{{ dayNumber(d) }}</b>
            <i aria-hidden="true"></i>
          </button>
        </div>

        <template v-if="day">
          <p id="advice-time-l" class="advice-sheet__label">{{ t('features.savings.advice.freeOn', { day: dayLong(day) }) }}</p>
          <div class="advice-slots" role="radiogroup" aria-labelledby="advice-time-l">
            <button
              v-for="s in day.slots"
              :key="s.time"
              class="advice-slot"
              type="button"
              role="radio"
              :aria-checked="time === s.time"
              :aria-disabled="!s.free"
              :aria-label="s.free ? s.time : `${s.time}, ${t('features.savings.advice.taken')}`"
              @click="pickTime(s)"
            >
              {{ s.time }}
            </button>
          </div>
        </template>

        <div v-if="day && time" class="advice-sheet__summary" role="status">
          <b>{{ dayLong(day) }}, {{ time }}</b><br />
          {{ t(`features.savings.advice.topics.${topic}`) }} · {{ where }}
        </div>
        <p v-else class="advice-sheet__hint" role="status">{{ t('features.savings.advice.pickTime') }}</p>

        <button class="btn btn--primary btn--block advice-sheet__cta" type="button" :disabled="!time" @click="step = 'done'">
          {{ t('features.savings.advice.bookBtn') }}
        </button>
        <p class="advice-sheet__note">{{ t('features.savings.advice.sampleNote') }}</p>
      </div>

      <div v-else class="advice-sheet__body advice-done">
        <q-icon class="advice-done__icon" :name="icon('task_alt')" size="56px" aria-hidden="true" />
        <h2 id="advice-done-h" class="advice-done__title">{{ t('features.savings.advice.doneH') }}</h2>
        <p v-if="day">
          <b>{{ dayLong(day) }}, {{ time }}</b><br />
          {{ t(`features.savings.advice.topics.${topic}`) }} · {{ where }}
        </p>
        <div class="advice-done__real">
          <p><b>{{ t('features.savings.advice.realH') }}</b></p>
          <p>{{ t('features.savings.advice.realP') }}</p>
          <ul>
            <li>{{ t('features.savings.advice.realApp') }}</li>
            <li>{{ t('features.savings.advice.realPhone') }} <span dir="ltr" class="advice-phone">{{ phone.display }}</span></li>
          </ul>
        </div>
        <a class="btn btn--primary btn--block advice-done__link" :href="adviceUrl" target="_blank" rel="noopener noreferrer">
          {{ t('features.savings.advice.openAdvice') }}
          <q-icon :name="icon('open_in_new')" size="18px" aria-hidden="true" />
          <span class="visually-hidden">{{ t('features.invest.opensSite') }}</span>
        </a>
        <a class="btn btn--secondary btn--block advice-done__link" :href="`tel:${phone.tel}`">
          <q-icon :name="icon('phone')" size="20px" aria-hidden="true" />
          {{ t('features.savings.advice.call') }} <span dir="ltr" class="advice-phone">{{ phone.display }}</span>
        </a>
        <p class="advice-sheet__note">{{ t('features.savings.advice.nothingSent') }}</p>
      </div>
    </div>
  </q-dialog>
</template>
