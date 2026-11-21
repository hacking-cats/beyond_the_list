# Dummy data

Made-up transactions in the challenge CSV format (one file per account and year, 15 columns; see the data contract in [`src/contracts/transaction.md`](../../src/contracts/transaction.md)). This is the first version of the data loader's seed data: the CSV `TransactionSource` and the `ingest` engine read these files.

| File | Account | Rows |
|---|---|---|
| `jeanine_2025_Account1_2025.csv` | Account1, Privatkonto | 264 |
| `jeanine_2025_Account3_2025.csv` | Account3, KK-Konto (credit card) | 261 |

## Rules
- Only **dummy** data in challenge format goes here. No real bank export, no real names, IBANs or account numbers.
- This is the only folder where CSVs are tracked (besides small fixtures in `tests/fixtures/`); every other `*.csv` is git-ignored.
- Add files, do not edit existing ones in place: tests may depend on their exact content.
