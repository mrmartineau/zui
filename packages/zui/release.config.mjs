// Per-package semantic-release config — run from packages/zui by the "NPM Release" workflow.
// `semantic-release-monorepo` scopes commit analysis to this package's directory so a
// release is only cut when commits actually touch packages/zui.
export default {
  branches: ['main'],
  // Keep the historical `v${version}` tag format (e.g. v1.5.0) so semantic-release recognises
  // the last release. `semantic-release-monorepo` would otherwise rewrite it to
  // `@mrmartineau/zui-v${version}` and treat this as a first release (1.0.0), which npm rejects.
  tagFormat: 'v${version}',
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    // Bump the version in package.json but don't publish here — pnpm publish handles the
    // actual publish so `workspace:` protocol deps are rewritten to real versions.
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/exec', { publishCmd: 'pnpm publish --no-git-checks' }],
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
