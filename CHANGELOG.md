## [1.0.1](https://github.com/meteorlxy/create/compare/v1.0.0...v1.0.1) (2023-07-10)

### Bug Fixes

- add prettier and ls-lint to lint command ([92b6640](https://github.com/meteorlxy/create/commit/92b664012afb7f5a91cbae6ca652e0922a5d36b8))

# [1.0.0](https://github.com/meteorlxy/create/compare/v0.8.0...v1.0.0) (2023-07-10)

### Bug Fixes

- find sort-package-json file correctly ([d035dab](https://github.com/meteorlxy/create/commit/d035dabc6225def38a101b79ca316d950fc1c923))

### Features

- add vitest integration ([2368b22](https://github.com/meteorlxy/create/commit/2368b22338979cbe7deb37195655514296cc1e1f))
- update prettier integration ([7dccbf2](https://github.com/meteorlxy/create/commit/7dccbf2dc4f38daff51e3e313fbd0c9d66cb84e9))

# [0.8.0](https://github.com/meteorlxy/create/compare/v0.7.0...v0.8.0) (2023-02-20)

### Features

- enable syncWorkspaceLock lerna-lite option ([594af96](https://github.com/meteorlxy/create/commit/594af96ace9f46939d21dd0ec98273ca76611d94))
- **github:** update github files template ([f09ba55](https://github.com/meteorlxy/create/commit/f09ba55bfe56381186b73808252c8bb19aee626b))

# [0.7.0](https://github.com/meteorlxy/create/compare/v0.6.3...v0.7.0) (2022-07-17)

### Bug Fixes

- remove useWorkspaces lerna config with pnpm ([9317b6f](https://github.com/meteorlxy/create/commit/9317b6f5c1dfe40349ac1b3c32e1df0681422b37))
- update pnpm version in ci template ([6b18fe6](https://github.com/meteorlxy/create/commit/6b18fe65440969362daa4dac89ae0daae07d6cf0))

### Features

- create packageManager field ([6d91e71](https://github.com/meteorlxy/create/commit/6d91e71d33cea7e203e639f7f50abb7cf3ca3b3b))

## [0.6.3](https://github.com/meteorlxy/create/compare/v0.6.2...v0.6.3) (2022-06-20)

### Bug Fixes

- omit empty registry in lerna config ([57e570b](https://github.com/meteorlxy/create/commit/57e570ba7d293bba969c5f279e88bb8e857a41f6))
- remove lerna-scope commitlint config ([6bb10c2](https://github.com/meteorlxy/create/commit/6bb10c2ec93cf830c2477c83a4192559581fe026))
- specify cjs and esm extensions ([2d9bd69](https://github.com/meteorlxy/create/commit/2d9bd69fee4998e3ecd6d996d615f358f268fa65))

## [0.6.2](https://github.com/meteorlxy/create/compare/v0.6.1...v0.6.2) (2022-06-20)

### Bug Fixes

- fix ts monorepo template path ([5fada35](https://github.com/meteorlxy/create/commit/5fada354814505d24963697736a4a5839daece34))

## [0.6.1](https://github.com/meteorlxy/create/compare/v0.6.0...v0.6.1) (2022-06-20)

### Bug Fixes

- fix ts monorepo ([fbe99b5](https://github.com/meteorlxy/create/commit/fbe99b5993db0646a00355eadff095e776fa757b))

# [0.6.0](https://github.com/meteorlxy/create/compare/v0.5.2...v0.6.0) (2022-06-20)

### Bug Fixes

- add private field to pnpm monorepo root ([7cba724](https://github.com/meteorlxy/create/commit/7cba724849e5bb0423d116e08d3c511391d0cf3d))

### Features

- add more binary file extensions ([362a912](https://github.com/meteorlxy/create/commit/362a912754e83e6e1dd8f7a789dde61db2f4e93c))
- add support for esm ([3de4b45](https://github.com/meteorlxy/create/commit/3de4b45016c2c8b3b1fc892b68a3d31609cb7eb3))
- use lerna-lite fork ([423c287](https://github.com/meteorlxy/create/commit/423c287026bfbc73550e71b02fbcee1f489b61ff))

### BREAKING CHANGES

- migrate to pure esm module

## [0.5.2](https://github.com/meteorlxy/create/compare/v0.5.1...v0.5.2) (2022-04-15)

### Bug Fixes

- set up pnpm before node in github workflow ([1cbc20e](https://github.com/meteorlxy/create/commit/1cbc20e3e1d1b4ab20f7f2179dc0914736c51987))

## [0.5.1](https://github.com/meteorlxy/create/compare/v0.5.0...v0.5.1) (2022-04-15)

### Bug Fixes

- use ejs ext for readme template ([01193c5](https://github.com/meteorlxy/create/commit/01193c55e7d7be4c1cfe3814a858b531a07a3031))

### Performance Improvements

- use Promise.all as possible ([5574f9a](https://github.com/meteorlxy/create/commit/5574f9a1e21c17fd7665943f404e302cf483d526))

# [0.5.0](https://github.com/meteorlxy/create/compare/v0.4.0...v0.5.0) (2022-04-15)

### Bug Fixes

- create vscode eslint config conditionally ([a7ad383](https://github.com/meteorlxy/create/commit/a7ad383a292dad28a33c741f073ed5291fd52b94))
- use outputFile to write ejs rendered result ([f6ce039](https://github.com/meteorlxy/create/commit/f6ce039579721be0516db7dc86da716ce25d35c8))

### Features

- add github meta files ([f7b9fab](https://github.com/meteorlxy/create/commit/f7b9fab1ebe4314ba7b8c6adfee53a5fc41523bd))
- remove vetur config ([10c1fcc](https://github.com/meteorlxy/create/commit/10c1fccf5b8e0087e7ad19a13d28518412469f2d))
- update monorepo tsconfig structure ([a4f1b65](https://github.com/meteorlxy/create/commit/a4f1b658e6f692b8491e519dc5b58b5ba9a48043))

# [0.4.0](https://github.com/meteorlxy/create/compare/v0.3.0...v0.4.0) (2022-04-15)

### Features

- add monorepo workspace config ([21de340](https://github.com/meteorlxy/create/commit/21de340b61e98b64e940e957f7bcd97d850e99bd))
- extend base tsconfig from package ([c8dba5c](https://github.com/meteorlxy/create/commit/c8dba5cca9bc74000f9a0f4b8158d648abc3745a))

# [0.3.0](https://github.com/meteorlxy/create/compare/v0.2.1...v0.3.0) (2021-08-25)

### Features

- set noImplicitOverride in tsconfig ([e96f74d](https://github.com/meteorlxy/create/commit/e96f74d9bca6d14d33f0823e3e3b75b29a173514))
- support pnpm ([aba0c0d](https://github.com/meteorlxy/create/commit/aba0c0d9bb14404eb6ff7a5e9311a0ed83b94747))

## [0.2.1](https://github.com/meteorlxy/create/compare/v0.2.0...v0.2.1) (2021-04-21)

### Bug Fixes

- fix commitlint option in husky hook ([de92622](https://github.com/meteorlxy/create/commit/de9262275ec4be6bab61a6fcd4a750919fd81078))

# [0.2.0](https://github.com/meteorlxy/create/compare/v0.1.0...v0.2.0) (2021-04-21)

### Bug Fixes

- make husky hooks scripts executable ([f8191d4](https://github.com/meteorlxy/create/commit/f8191d4f306a1d119181ad1d6549e7f6fc0b5622))

### Features

- switch default branch to main ([a4bb303](https://github.com/meteorlxy/create/commit/a4bb3038432f621ff50436728d92f00c1db1f267))

# 0.1.0 (2021-03-21)

### Features

- add project scaffolding ([112acc4](https://github.com/meteorlxy/create/commit/112acc4a7f8b92065fb45d7a65ad45cea29cc4d6))
