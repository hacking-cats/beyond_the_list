# layouts

`MainLayout.vue`: header (app name, language switch), greeting and the balance (total of both accounts, opening balance + payments, "since <date>"; decision 0005), the page, and a **bottom tab bar** whose tabs are generated from the feature registry: icons only, each with an accessible name, fixed to the bottom of the screen. One layout for the whole app. No hamburger menu or drawer ([decision 0003](../../docs/architecture/decisions/0003-bottom-tab-bar.md)).

Pulling the header down rolls down the finAInce buddy chat: see [buddy/](buddy/README.md).
