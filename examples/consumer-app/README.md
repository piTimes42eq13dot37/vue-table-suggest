# consumer-app

Minimal Vue 3 consumer app that imports `vue-table-suggest` from the local workspace package.

## Run

From this folder:

```bash
npm install
npm run dev
```

Or from repository root:

```bash
npm --prefix examples/consumer-app install
npm --prefix examples/consumer-app run dev
```

This verifies that another Vue app can consume:

- `TableSuggest` component from `vue-table-suggest`
- model definition helpers from `vue-table-suggest`
- package CSS via `vue-table-suggest/style.css`
