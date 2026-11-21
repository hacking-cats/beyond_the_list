# Dummy data

Made-up transactions in the challenge CSV format (one file per account and year, 15 columns; see the data contract in [`src/contracts/transaction.md`](../../src/contracts/transaction.md)). This is the first version of the data loader's seed data: the CSV `TransactionSource` and the `ingest` engine read these files.

| File | Account | Rows |
|---|---|---|
| `jeanine_2025_Account1_2025.csv` | Account1, Privatkonto | 264 |
| `jeanine_2025_Account3_2025.csv` | Account3, KK-Konto (credit card) | 261 |
| `andres_2025_Account1_2025.csv` | Account1, Privatkonto (no credit card) | 835 |
| `jeanine_singlemom_2025_Account1_2025.csv` | Account1, Privatkonto | 411 |
| `jeanine_singlemom_2025_Account3_2025.csv` | Account3, KK-Konto (credit card) | 260 |

## Rules
- Only **dummy** data in challenge format goes here. No real bank export, no real names, IBANs or account numbers.
- This is the only folder where CSVs are tracked (besides small fixtures in `tests/fixtures/`); every other `*.csv` is git-ignored.
- Add files, do not edit existing ones in place: tests may depend on their exact content.

## Personas

**Jeanine (2025)**, the original challenge sample: comfortable salaried employee in Bern, private account plus credit card.

**Jeanine as a single mother (2025)**, `jeanine_singlemom_2025_*`, the persona the app shows: made up, built on the same name and city. She lives in Bern-Bümpliz with two children (13 and 8) and has no other support. She works 100% as a retail sales assistant: CHF 3'932.60 net a month, including the child allowances, and a 13th salary in December.
- Fixed costs: rent CHF 1'490 (3.5 rooms), health insurance for the family CHF 446.80 after premium reduction, day school for the younger child, Libero monthly pass, two phones, internet, Serafe, small tax instalments.
- The children and her card: her credit card is saved on the children's phone, tablet and PlayStation, and they use it without her noticing. Streaming grows from Netflix and Spotify Family in January to five services by September (Disney+ from February, YouTube Premium from April, a second Spotify plan for the older child from June, Crunchyroll from September). Pay-to-win purchases (Roblox Robux via Apple, Brawl Stars via Google Play, FC Points on the PlayStation Store, Fortnite V-Bucks via Epic Games) rise from about CHF 50 in January to about CHF 250 a month in the autumn: 150 purchases, CHF 2'010 in the year.
- Family life: Temu and Zalando orders for the kids; McDonald's on some Saturdays and pizza delivery on tired Fridays; football club, swimming course, school camp, pocket money.
- Struggle: the growing card bill eats her small buffer month by month (the lowest balance before payday sinks from about CHF -1'000 in January to about CHF -2'270 in November, counted from the start of the year); the year only ends slightly positive thanks to the 13th salary. A broken washing machine is paid with Klarna instalments (one reminder fee). Health insurance is paid late twice (CHF 20 reminder fees). The school dentist, an orthodontist deposit for braces and Christmas all fall on her alone.
- Generator script and checklist of assumed prices: kept outside the repo (project files, `dummy-data/`).

**Andrés (2025)**: made-up low-income migrant in Zurich, for the struggle and savings stories. 28, from Colombia, permit B, kitchen helper at about 80% with an hourly wage (paid early the following month, so it varies; Quellensteuer is already deducted, so no tax bills). Room in a shared flat, no credit card, sends money home every month.
- Struggle: the balance is never far from zero before payday. In three months with few shifts (wages paid in March, August and November) the money runs out: the health insurance premium is paid late (Mahngebühr CHF 30 next month), a cousin sends a TWINT top-up, and in August a Zalando invoice reminder follows. One-offs hurt: Serafe, a dentist bill (not covered by basic insurance), the deductible, a ZVV fine, a phone repair.
- Avoidable, Swiss-specific spending the app can flag: daily Starbucks at Zürich HB, k kiosk snacks, Coop and late-night Coop Pronto instead of Lidl/Aldi/Denner, ZVV single tickets every work day instead of a monthly pass, SBB full fare to Bern (eight return trips) without Halbtax, an expensive Swisscom plan, Western Union fees, cash from other banks' ATMs (fee), Uber Eats, Swisslos every Saturday.
- Good habits too: Lidl when money is tight, Brockenhaus.
- Prices are rough 2025 levels and made up; they are examples, not facts about the merchants.
