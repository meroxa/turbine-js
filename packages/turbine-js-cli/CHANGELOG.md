# @meroxa/turbine-js-cli

## 1.3.1

### Patch Changes

- a338721: fix: make sure IR output is stringified

## 1.3.0

### Minor Changes

- 5e641b6: feat(errors): add request info to API error output
- 5e641b6: feat(accounts): allow turbine-js to operate with shared user accounts

### Patch Changes

- 5e641b6: fix: ensure listresources uses turbine-response format
- 31f4f24: fix: v2 IR output
- 31f4f24: build(deps): upgrade @meroxa packages

## 1.2.1

### Patch Changes

- 6891db6: fix: Update template app with latest framework version
- 02d0825: fix: use correct format for deployment IR
- 924a0e3: build(deps): bump @types/node from 17.0.45 to 18.8.4
- 921958b: build(deps): Bump meroxa-js to 1.5.0
- 4f93709: build(deps): cleanup unused dependencies
- 1b2f7ca: build(deps): bump sinon from 14.0.0 to 14.0.1
- Updated dependencies [924a0e3]
  - @meroxa/turbine-js-framework@1.1.1

## 1.2.0

### Minor Changes

- ffb3509: feat: support auto-configure of Confluent Cloud resource
- 0b6cb13: feat: return IR response when spec is passed

## 1.1.0

### Minor Changes

- 6786351: ## What's Changed

  - Add IR runtime by @jmar910 in https://github.com/meroxa/turbine-js/pull/130
  - Add changesets GitHub action by @jmar910 in https://github.com/meroxa/turbine-js/pull/131
  - Fix IR secrets to return object instead of array by @jmar910 in https://github.com/meroxa/turbine-js/pull/133
  - upd(resources): allow automatic configuration of kafka-type connectors by @jayjayjpg in https://github.com/meroxa/turbine-js/pull/135
  - Add validations for single source and collections by @jmar910 in https://github.com/meroxa/turbine-js/pull/134

  **Full Changelog**: https://github.com/meroxa/turbine-js/compare/v0.5.0...v0.6.0

### Patch Changes

- Updated dependencies [6786351]
  - @meroxa/turbine-js-framework@1.1.0
