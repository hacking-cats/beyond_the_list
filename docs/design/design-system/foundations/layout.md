# Layout

- Mobile-first from 360px; content max width 480px, centred on larger screens.
- 16px side padding; 24px between major sections.
- Touch targets at least 44×44px.
- Respect safe-area insets; no horizontal scrolling.
- Header: screen title "Statement", the current date ("Today: 23 September 2025") and the prototype chip.
- The statement scrolls; the answer opens as a bottom sheet over it (see `components/answer-sheet.md`).
- Bottom tab bar (decision 0003): fixed to the bottom, 56px high plus the safe-area inset, one tab per enabled feature in the registry's order.
  - Icons only (Material outlined, 26px), each tab with an accessible name and a tooltip; never colour alone.
  - Inactive tabs in textSecondary; the active tab in petrol with a 2px petrol top border.
  - No hamburger menu or drawer.
