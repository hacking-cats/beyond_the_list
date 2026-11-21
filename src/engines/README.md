# Engines

Pure functions that compute every number in the app: plain data in, plain data out. No UI, storage, network, clock or randomness (pass "today" as an input). Each engine has unit tests with known answers.

| Engine | Job | Used by | Spec |
|---|---|---|---|
| ingest | Read CSV rows, merge accounts, fix data quirks into `Transaction[]` | every other engine | [ingest/SPEC.md](ingest/SPEC.md) |
| categorize | Merchant name → clean name + category | insights, savings, dashboard | [categorize/SPEC.md](categorize/SPEC.md) |
| insights | Monthly totals, trends, recurring payments, pay-cycle dates, safe to spend | dashboard, report | [insights/SPEC.md](insights/SPEC.md) |
| alerts | Flag suspicious payments | dashboard, notifier | [alerts/SPEC.md](alerts/SPEC.md) |
| savings | Savings rate, spending cuts, cheaper alternatives | savings, report | [savings/SPEC.md](savings/SPEC.md) |
| invest | Match surplus and goals to products in `content/invest-products.json` | invest, report | [invest/SPEC.md](invest/SPEC.md) |
| report | Collect the facts for the written monthly report | assistant | [report/SPEC.md](report/SPEC.md) |
| advice | Sample appointment times for the advice-booking prototype | savings | [advice/SPEC.md](advice/SPEC.md) |

Template: [`docs/templates/engine-spec.md`](../../docs/templates/engine-spec.md).
