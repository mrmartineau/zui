// Per-package semantic-release config — run from packages/zui-theme by the "NPM Release" workflow.
// `semantic-release-monorepo` scopes commit analysis to this package's directory and tags
// releases as `@mrmartineau/zui-theme-v${version}`, keeping them distinct from @mrmartineau/zui.
// No prior tag exists, so the first release will be 1.0.0 (semantic-release ignores the
// 0.1.0 in package.json on a first release).
export default {
  branches: ['main'],
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    // Bump the version in package.json but don't publish here — pnpm publish rewrites the
    // `workspace:*` dependency on @mrmartineau/zui to a real version before publishing.
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
