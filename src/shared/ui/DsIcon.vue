<script setup lang="ts">
// Outline icons from the design system (docs: one icon family, fixed meanings).
export type DsIconName = 'bulb' | 'attention' | 'action' | 'info' | 'jump' | 'close' | 'send';

const props = withDefaults(defineProps<{ name: DsIconName; small?: boolean; label?: string }>(), {
  small: false,
  label: '',
});

const paths: Record<DsIconName, string[]> = {
  bulb: ['M9 18h6M10 21h4', 'M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1V16h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z'],
  attention: ['M12 3.5 2.5 20h19L12 3.5z', 'M12 10v4.5M12 17.2v.1'],
  action: ['M8 2.5h8L21.5 8v8L16 21.5H8L2.5 16V8z', 'M12 7.5v5.5M12 16.2v.1'],
  info: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M12 11v5.5M12 7.8v.1'],
  jump: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z', 'M8 12h8M13 8.5l3.5 3.5-3.5 3.5'],
  close: ['M6 6l12 12M18 6 6 18'],
  send: ['M4 12 20 4l-6 16-2.5-6.5z', 'M11.5 13.5 20 4'],
};
</script>

<template>
  <svg
    class="icon"
    :class="{ 'icon--sm': props.small }"
    viewBox="0 0 24 24"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label || undefined"
    :aria-hidden="props.label ? undefined : 'true'"
  >
    <path v-for="d in paths[props.name]" :key="d" :d="d" />
  </svg>
</template>
