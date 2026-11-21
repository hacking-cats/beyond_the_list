# layouts/buddy: finAInce buddy

- **Purpose:** a pale yellow AI chat sheet (brand yellow and petrol) that rolls down from the top when the user pulls the header down, plus a "listening" glow along the top of the header as a hint and a first-visit banner.
- **Contract used / implemented:** none yet. It should call `useServices().assistant.ask()` ([assistant.md](../../contracts/assistant.md)), but that contract is still `draft` and has no implementation or `useServices()`. Until then a sent message gets a fixed "not connected yet" note (i18n `buddy.notConnected`).
- **Public API:** `BuddyPanel.vue`, `BuddyIntro.vue`, `useBuddyPull()` (state + Quasar `v-touch-pan` handler), pure helpers in `pull.ts`.
- **Status:** placeholder (UI and gesture done, no answers).
- **Decisions:** layout-level, no new tab ([decision 0003](../../../docs/architecture/decisions/0003-bottom-tab-bar.md)).
- **How to test:** `npm test` (`pull.test.ts`, `introSeen.test.ts`). In `npm run dev` on a phone or in device mode: drag the header down (also works with the mouse), drag the bottom bar up or press Escape to close. Clear `btl.buddyIntroSeen.v1` in localStorage to see the banner again.
- **Known gaps:**
  - Suggestions are placeholders; they should come from engine facts once the Assistant exists.
  - The banner flag uses `localStorage` directly (guarded) until the Storage contract has an implementation.
  - Motion: transform and opacity only; `prefers-reduced-motion` switches all animation off.
