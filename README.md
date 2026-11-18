# odormap-common

Common TypeScript types, validation schemas and translations used by the OdorMap API, web and mobile apps.

OdorMap lets residents report bad odors from their phones. Each report is stored with its location and the wind at that moment, so odors can be traced back to their sources. It starts in Bačka Topola.

## What is in here

| File | What it holds |
| --- | --- |
| `src/enums.ts` | Fixed lists of values: odor kinds, strengths, durations, source kinds, languages, roles |
| `src/schemas.ts` | The shape of every request and response the API accepts or returns, with validation rules |
| `src/geo.ts` | Location helpers: is a point inside an area? Used by the API and the apps |
| `src/labels.ts` | Serbian (Latin) and Hungarian words for every fixed value, for showing in the apps |
| `src/index.ts` | Exports everything above |

Schemas are written with [Zod](https://zod.dev). One schema gives both a runtime check and a TypeScript type:

```ts
import { CreateReportRequest, LABELS } from '@odormap/common';

const report = CreateReportRequest.parse(requestBody); // throws if invalid
const label = LABELS.sr.odorKind[report.odorKind];  // e.g. "Svinjski stajnjak"
```

## Using it in another OdorMap project

It is installed straight from GitHub, pinned to a version tag:

```bash
npm install github:sholime/odormap-common#v0.1.0
```

npm builds the package automatically when it installs it.

## Working on it

```bash
npm install
npm test           # run the tests
npm run typecheck  # check types without building
npm run build      # compile to dist/
```

## Adding a new value (for example an odor kind)

1. Add it to the list in `src/enums.ts`.
2. Add its Serbian and Hungarian label in `src/labels.ts`. TypeScript reports an error until you do.
3. Bump `version` in `package.json`, merge, and tag the release (`git tag v0.2.0 && git push --tags`).
4. Update the version tag in the API and UI projects.
