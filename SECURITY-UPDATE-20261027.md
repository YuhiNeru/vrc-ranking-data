# Security runtime update: 2026-10-27

The scheduled snapshot job used actions/checkout@v4 and actions/setup-node@v4 (Node 20 action runtime). Both actions now use the latest official releases, pinned to verified commit hashes: checkout v7.0.1 and setup-node v7.1.0, whose action.yml specifies node24. The script runtime now requires ^24.22.1 with check-latest enabled, ensuring the Brotli and emSign fixes instead of allowing an older cached Node 24 patch.

Validation: existing 3 freshness tests pass on Node 24.22.1. Snapshot data, credentials, schedule, permissions and repository visibility are unchanged. The hosted runner's action-internal Node patch remains GitHub-managed; source configuration alone does not prove the exact hosted binary version.

Official references: [checkout release](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node release](https://github.com/actions/setup-node/releases/tag/v7.1.0), [Node.js security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).
