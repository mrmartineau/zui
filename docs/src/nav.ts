import {
  buildFooterSections,
  buildSidebarSections,
} from '@mrmartineau/zui-theme/astro'

// Shared docs navigation, built once and reused by every layout so the sidebar
// and footer rules never diverge between DocsLayout and HomeLayout.
const pages = import.meta.glob('./pages/**/*.mdx', { eager: true })
const indexPages = import.meta.glob('./pages/*/index.mdx', { eager: true })

export const sidebarSections = buildSidebarSections(pages, {
  append: [
    {
      heading: 'Guides',
      items: [
        { href: '/playground', label: 'Procedural playground' },
        { href: '/changelog', label: 'Changelog' },
      ],
    },
  ],
})

export const footerSections = buildFooterSections(indexPages)
