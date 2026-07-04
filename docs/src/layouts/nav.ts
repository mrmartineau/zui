import {
  buildFooterSections,
  buildSidebarSections,
} from '@mrmartineau/zui-theme/nav'

// Shared by Layout.astro and HomeLayout.astro so sidebar/footer rules can't
// drift between the docs and homepage shells.
const pages = import.meta.glob('../pages/**/*.mdx', { eager: true })
const indexPages = import.meta.glob('../pages/*/index.mdx', { eager: true })

export const sections = buildSidebarSections(pages, {
  append: [
    { heading: 'Guides', items: [{ href: '/changelog', label: 'Changelog' }] },
  ],
})

export const footerSections = buildFooterSections(indexPages)
