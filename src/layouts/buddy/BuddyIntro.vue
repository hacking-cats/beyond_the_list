<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { icon } from '../../shared/ui/icons';
import { introSeen, markIntroSeen } from './introSeen';

// First-visit banner that introduces the buddy. Dismissed once, never shown again on this device.
const emit = defineEmits<{ try: [] }>();
const { t } = useI18n();
const show = ref(!introSeen());

function dismiss(andTry: boolean) {
  markIntroSeen();
  show.value = false;
  if (andTry) emit('try');
}
</script>

<template>
  <transition name="buddy-intro">
    <q-banner v-if="show" class="buddy-intro" role="region" :aria-label="t('buddy.introTitle')">
      <template #avatar>
        <span class="buddy-intro__spark" aria-hidden="true">
          <q-icon :name="icon('auto_awesome')" size="24px" />
        </span>
      </template>
      <p class="buddy-intro__title">{{ t('buddy.introTitle') }}</p>
      <p class="buddy-intro__body">{{ t('buddy.introBody') }}</p>
      <template #action>
        <button type="button" class="btn btn--ghost" @click="dismiss(false)">{{ t('buddy.introDismiss') }}</button>
        <button type="button" class="btn btn--primary" @click="dismiss(true)">{{ t('buddy.introTry') }}</button>
      </template>
    </q-banner>
  </transition>
</template>
