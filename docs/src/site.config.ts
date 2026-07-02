import type { SiteConfig } from '@mrmartineau/zui-theme/nav'
import { version } from '../../packages/zui/package.json'

export const site: SiteConfig = {
  author: 'Zander Martineau',
  authorHref: 'https://zander.wtf',
  description:
    'A CSS-first UI library with optional React, Astro, Solid, Svelte, Vue, and Web Components.',
  social: [
    {
      ariaLabel: 'View on GitHub',
      href: 'https://github.com/mrmartineau/zui',
      icon: 'github-logo',
      label: 'Repo',
    },
    {
      ariaLabel: 'View on npm',
      href: 'https://npmx.dev/package/@mrmartineau/zui',
      icon: 'package',
    },
  ],
  title: 'ZUI',
  version,
  versionHref: '/changelog',
}
