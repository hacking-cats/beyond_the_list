/**
 * State of the pull-down buddy panel, shared by the header (pull down to open) and the panel's
 * own grab bar (push up to close). Feed Quasar's v-touch-pan events into `onPan`.
 * https://quasar.dev/vue-directives/touch-pan
 */
import { ref } from 'vue';
import { pullProgress, settleOpen } from './pull';

export interface PanEvent {
  isFirst?: boolean;
  isFinal?: boolean;
  duration?: number;
  offset?: { x?: number; y?: number };
}

export function useBuddyPull() {
  const open = ref(false);
  const dragging = ref(false);
  /** 0 = shut, 1 = fully open; follows the finger while dragging. */
  const progress = ref(0);
  let startOpen = false;

  const height = () => (typeof window === 'undefined' ? 0 : window.innerHeight);

  function setOpen(value: boolean) {
    open.value = value;
    dragging.value = false;
    progress.value = value ? 1 : 0;
  }

  function onPan(evt: PanEvent) {
    const offsetY = evt.offset?.y ?? 0;
    if (evt.isFirst) {
      startOpen = open.value;
      dragging.value = true;
    }
    if (evt.isFinal) {
      setOpen(settleOpen(startOpen, offsetY, height(), evt.duration ?? 0));
      return;
    }
    progress.value = pullProgress(startOpen, offsetY, height());
  }

  return { open, dragging, progress, setOpen, onPan };
}

export type BuddyPull = ReturnType<typeof useBuddyPull>;
