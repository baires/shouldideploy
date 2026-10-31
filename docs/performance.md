# Performance measurements — October 30, 2026

Measured a production build served by `next start` on localhost, using Lighthouse 13.5.0 and Chrome 155. Each iteration has three cold navigations with the default mobile profile: 412 × 823 viewport, 150 ms simulated RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. These are lab measurements of the default English page, not production field data or an INP measurement.

## Comparable before / after

The dependency install reconciled the pre-existing node_modules with the lockfile, increasing the React bundle relative to the first baseline. To avoid attributing that difference to the optimization, the **original source was rebuilt and remeasured using the same installed dependency versions**. The table compares that normalized baseline with the final isolated runs. Values are medians of three runs.

| Metric | Original source | Optimized source |
| --- | ---: | ---: |
| Lighthouse performance | 97 | 100 |
| First contentful paint | 755 ms | 603 ms |
| Largest contentful paint | 1,955 ms | 1,805 ms |
| Speed Index | 755 ms | 633 ms |
| Cumulative layout shift | 0.0959 | 0 |
| Total blocking time | 0 ms | 0 ms |
| Total transferred | 150,753 bytes | 139,433 bytes |

First paint improved 20%, LCP 8%, and transfer size 7.5%. Final scores ranged from 99 to 100. Final TBT ranged from 0 to 71 ms, so there is no claim of an improvement in blocking time. One final run had a Speed Index outlier of 1,571 ms; all raw metric values, including intermediate iterations, are in [performance-results.json](./performance-results.json).

## Changes and evidence

1. **Render the reason in the initial HTML.** The original `<h2>` was empty on the server and populated by an effect. A JavaScript-disabled navigation confirmed that no reason appeared. A serialized random seed now selects the same message during SSR and hydration. Changing language/time derives the message directly, and clicking or pressing Space generates a fresh seed. All final default-English audit runs had zero CLS.
2. **Inline the small stylesheet.** Next's Pages Router CSS optimizer uses Critters to inline styles smaller than 10 KB. The generated HTML contains an inline stylesheet and no external CSS link. The threshold includes the whole current stylesheet, preserving theme and media-query rules. This removes its render-blocking request. This uses `experimental.optimizeCss` and should be rechecked on Next upgrades.
3. **Load only the selected translation.** English remains in the initial bundle. Other locales are separate dynamic imports. A request counter prevents a slow previous selection from overriding a newer one; a failed chunk retains the current translation. The translation callback and context are stable between unrelated renders. The English initial translation chunk dropped from about 18.8 KB to 8.0 KB transferred.

The initial SSR-only iteration fixed CLS but did not materially improve Lighthouse's simulated LCP; it was not counted as an LCP win. The CSS-only iteration improved first paint but had mixed LCP results. The combined changes produced the comparable results above.

## Reproduce

Keep the same dependency versions, Chrome version, machine, and network/CPU profile when comparing revisions. Run audits separately from browser smoke tests to avoid CPU contention.

```sh
npm ci
npm run build
npm start -- --port 3100
```

In a second terminal, from the repository root:

```sh
npm install --prefix /tmp/shouldideploy-perf --no-audit --no-fund lighthouse@13.5.0 puppeteer-core
cp scripts/performance-audit.mjs /tmp/shouldideploy-perf/audit.mjs
node /tmp/shouldideploy-perf/audit.mjs comparison http://localhost:3100/
```

The audit uses macOS Google Chrome by default; set `CHROME_PATH` to override it. Full Lighthouse JSON reports are written to `/tmp/shouldideploy-perf/results` (override with `PERF_OUTPUT`). Temporary tooling stays outside project dependencies.

Browser checks use the same temporary dependencies and should run from the repository root:

```sh
cp scripts/performance-smoke.mjs /tmp/shouldideploy-perf/smoke.mjs
cp scripts/performance-language-flows.mjs /tmp/shouldideploy-perf/language-flows.mjs
node /tmp/shouldideploy-perf/smoke.mjs
node /tmp/shouldideploy-perf/language-flows.mjs
npm test -- --runInBand
```

Verified SSR content, hydration stability, theme toggle, timezone navigation, language selection, saved preferences, custom dates, click/Space handlers, JavaScript-disabled rendering, delayed translation races, and failed translation downloads. All 124 Jest tests pass; targeted ESLint and the production build pass.

## Limits and remaining work

- The production CDN, real network conditions, browser language detection, and saved-language rendering need deployment measurements. Automatic translation still happens after hydration and is not covered by the zero-CLS English result.
- Most remaining JavaScript is the React/Next runtime. Removing that would require a larger architecture change; current default-mobile lab results are already within the good LCP range. See [Web Vitals](https://web.dev/articles/vitals) for the field thresholds and percentile methodology.
- The build reports an existing Next.js security advisory for installed version 16.4.0. It completes on retry. No framework upgrade was included in these performance changes.
- Measurements ran on Node 26.8.1; the package declares Node 22.x. Repeat under the deployment runtime when validating production behavior.
