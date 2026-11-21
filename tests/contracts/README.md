# Contract test suites

One suite per contract (`<contract>.contract.test.ts`), written as a function that takes an implementation, so every adapter (fake, csv, claude, ...) runs the same tests. Each suite lists the tests from the "Contract tests" section of its spec in `src/contracts/`.
