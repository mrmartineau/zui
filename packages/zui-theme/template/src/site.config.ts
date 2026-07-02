import type { SiteConfig } from '@mrmartineau/zui-theme/nav'

/**
 * Global configuration for your docs site. This drives the header, footer,
 * page titles, and theme controls. Tweak it to match your package.
 */
export const site: SiteConfig = {
  author: 'Your Name',
  authorHref: 'https://example.com',
  description: 'Documentation for My Package.',
  social: [
    {
      ariaLabel: 'View on GitHub',
      href: 'https://github.com/your-name/your-package',
      icon: 'github-logo',
      label: 'Repo',
    },
    {
      ariaLabel: 'View on npm',
      href: 'https://www.npmjs.com/package/your-package',
      icon: 'package',
    },
  ],
  title: 'My Package',
  version: '0.1.0',
  versionHref: '/changelog',
  // Floating theme builder + header colour switcher are on by default.
  // Set to `false` to hide them:
  // themeSwitcher: false,
  // miniThemeSwitcher: false,
}
