import kit from '@mrmartineau/kit/oxfmt' with { type: 'json' }

export default { ...kit, ignorePatterns: ['packages/vscode-zui/src/manifest.json', 'packages/raycast-zui/src/data', 'packages/raycast-zui/raycast-env.d.ts', '**/*.md', '**/*.mdx', '**/*.yml', '**/*.yaml', '**/*.html'] }
