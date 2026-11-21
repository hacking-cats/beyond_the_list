<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { icon } from '../../shared/ui/icons';
import type { PanEvent } from './useBuddyPull';

// The finAInce buddy: a pale yellow chat sheet that rolls down from the top of the app.
// It follows the finger while the header is pulled (progress), and settles open or shut.
// Placeholder only: the Assistant contract (src/contracts/assistant.md) is still a draft with no
// implementation and no useServices() yet, so a sent message gets a "not connected yet" note.
// When the assistant exists, `send` calls useServices().assistant.ask(text, context) instead.
const props = defineProps<{ open: boolean; progress: number; dragging: boolean }>();
const emit = defineEmits<{ close: []; pan: [evt: PanEvent] }>();

const { t } = useI18n();

type Line = { id: number; role: 'user' | 'buddy'; text?: string };
const lines = ref<Line[]>([]);
const draft = ref('');
let nextId = 1;

const suggestions = [
  { key: 'suggestSave', icon: 'savings' },
  { key: 'suggestFood', icon: 'restaurant' },
  { key: 'suggestFuture', icon: 'auto_awesome' },
] as const;

const heading = ref<HTMLElement | null>(null);
const log = ref<HTMLElement | null>(null);

const visible = computed(() => props.open || props.dragging || props.progress > 0);
const style = computed(() => ({ transform: `translate3d(0, ${(props.progress - 1) * 100}%, 0)` }));

function send(text: string) {
  const clean = text.trim();
  if (!clean) return;
  lines.value.push({ id: nextId++, role: 'user', text: clean }, { id: nextId++, role: 'buddy' });
  draft.value = '';
  void nextTick(() => log.value?.scrollTo({ top: log.value.scrollHeight }));
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

// Keep the page behind still while the buddy is open, and move focus in.
watch(
  () => props.open,
  (isOpen) => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) void nextTick(() => heading.value?.focus());
  },
);
onBeforeUnmount(() => {
  document.documentElement.style.overflow = '';
});
</script>

<template>
  <section
    class="buddy"
    :class="{ 'is-dragging': dragging, 'is-hidden': !visible }"
    :style="style"
    role="dialog"
    aria-modal="true"
    aria-labelledby="buddy-title"
    :aria-hidden="open ? undefined : 'true'"
    :inert="!open"
    @keydown="onKey"
  >
    <div class="buddy__top">
      <button class="buddy__close" type="button" :aria-label="t('buddy.close')" @click="emit('close')">
        <q-icon :name="icon('close')" size="22px" aria-hidden="true" />
      </button>
      <span class="buddy__name">{{ t('buddy.name') }}</span>
    </div>

    <div ref="log" class="buddy__body" aria-live="polite">
      <div class="buddy__spacer" />
      <h2 id="buddy-title" ref="heading" class="buddy__heading" tabindex="-1">{{ t('buddy.heading') }}</h2>

      <ul class="buddy__suggest" :aria-label="t('buddy.suggestions')">
        <li v-for="s in suggestions" :key="s.key">
          <button type="button" class="buddy__chip" @click="send(t(`buddy.${s.key}`))">
            <q-icon :name="icon(s.icon)" size="20px" aria-hidden="true" />
            <span>{{ t(`buddy.${s.key}`) }}</span>
          </button>
        </li>
      </ul>

      <div v-for="l in lines" :key="l.id" class="buddy__msg" :class="`buddy__msg--${l.role}`">
        <span class="visually-hidden">{{ l.role === 'user' ? t('buddy.you') : t('buddy.name') }}:</span>
        {{ l.role === 'user' ? l.text : t('buddy.notConnected') }}
      </div>
    </div>

    <form class="buddy__ask" @submit.prevent="send(draft)">
      <label class="visually-hidden" for="buddy-input">{{ t('buddy.inputLabel') }}</label>
      <input
        id="buddy-input"
        v-model="draft"
        class="buddy__input"
        type="text"
        autocomplete="off"
        enterkeyhint="send"
        :placeholder="t('buddy.placeholder')"
      />
      <button class="buddy__send" type="submit" :aria-label="t('buddy.send')" :disabled="!draft.trim()">
        <q-icon :name="icon('send')" size="20px" aria-hidden="true" />
      </button>
    </form>

    <div
      v-touch-pan.vertical.prevent.mouse="(e: PanEvent) => emit('pan', e)"
      class="buddy__grab"
      :title="t('buddy.pushHint')"
    >
      <q-icon :name="icon('expand_less')" size="20px" aria-hidden="true" />
      <span class="buddy__handle" aria-hidden="true" />
    </div>
  </section>
</template>
