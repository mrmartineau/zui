// Per-package semantic-release config — run from packages/vscode-zui by the
// "VS Code Extension Release" workflow. `semantic-release-monorepo` scopes commit
// analysis to this package's directory and tags releases as `vscode-zui-v${version}`,
// keeping them distinct from @mrmartineau/zui and @mrmartineau/zui-theme.
//
// A `vscode-zui-v0.1.0` tag is pre-created so semantic-release continues from 0.1.0
// (conventional commits: fix -> 0.1.x, feat -> 0.x.0) instead of treating this as a
// first release and jumping straight to 1.0.0.
//
// This extension publishes to the VS Code Marketplace via `vsce`, NOT npm:
//   - @semantic-release/npm only bumps the version in package.json (npmPublish: false);
//     it never publishes to the npm registry.
//   - @semantic-release/exec runs `vsce package` + `vsce publish` after the bump, so the
//     marketplace gets the version semantic-release just computed.
export default {
  branches: ['main'],
  tagFormat: 'vscode-zui-v${version}',
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/exec', { publishCmd: 'pnpm run package && pnpm run publish' }],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          'chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    ['@semantic-release/github', { failComment: false, failTitle: false }],
  ],
}
