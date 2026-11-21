# Dummy data

Made-up transactions in the challenge CSV format (one file per account and year, 15 columns; see the data contract in [`src/contracts/transaction.md`](../../src/contracts/transaction.md)). This is the first version of the data loader's seed data: the CSV `TransactionSource` and the `ingest` engine read these files.

| File | Account | Rows |
|---|---|---|
| `jeanine_2025_Account1_2025.csv` | Account1, Privatkonto | 264 |
| `jeanine_2025_Account3_2025.csv` | Account3, KK-Konto (credit card) | 261 |
| `andres_2025_Account1_2025.csv` | Account1, Privatkonto (no credit card) | 835 |

## Rules
- Only **dummy** data in challenge format goes here. No real bank export, no real names, IBANs or account numbers.
- This is the only folder where CSVs are tracked (besides small fixtures in `tests/fixtures/`); every other `*.csv` is git-ignored.
- Add files, do not edit existing ones in place: tests may depend on their exact content.

## Personas

**Jeanine (2025)**: comfortable salaried employee in Bern, private account plus credit card.

**Andrés (2025)**: made-up low-income migrant in Zurich, for the struggle and savings stories. 28, from Colombia, permit B, kitchen helper at about 80% with an hourly wage (paid early the following month, so it varies; Quellensteuer is already deducted, so no tax bills). Room in a shared flat, no credit card, sends money home every month.
- Struggle: the balance is never far from zero before payday. In three months with few shifts (wages paid in March, August and November) the money runs out: the health insurance premium is paid late (Mahngebühr CHF 30 next month), a cousin sends a TWINT top-up, and in August a Zalando invoice reminder follows. One-offs hurt: Serafe, a dentist bill (not covered by basic insurance), the deductible, a ZVV fine, a phone repair.
- Avoidable, Swiss-specific spending the app can flag: daily Starbucks at Zürich HB, k kiosk snacks, Coop and late-night Coop Pronto instead of Lidl/Aldi/Denner, ZVV single tickets every work day instead of a monthly pass, SBB full fare to Bern (eight return trips) without Halbtax, an expensive Swisscom plan, Western Union fees, cash from other banks' ATMs (fee), Uber Eats, Swisslos every Saturday.
- Good habits too: Lidl when money is tight, Brockenhaus.
- Prices are rough 2025 levels and made up; they are examples, not facts about the merchants.
