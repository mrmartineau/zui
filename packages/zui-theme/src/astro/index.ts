// Layout + navigation
export { default as DocsLayout } from './DocsLayout.astro'
export { default as Sidebar } from './Sidebar.astro'
export { default as TableOfContents } from './TableOfContents.astro'

// Documentation helpers
export { default as Demo } from './Demo.astro'
export { default as DemoPreview } from './DemoPreview.astro'
export { default as CopyCode } from './CopyCode.astro'
export { default as TokenGrid } from './TokenGrid.astro'
export { default as TokenRow } from './TokenRow.astro'
export { default as Section } from './Section.astro'
export { default as Subtitle } from './Subtitle.astro'

// Theme controls
export { default as DarkModeSwitcher } from './DarkModeSwitcher.astro'
export { default as MiniThemeSwitcher } from './MiniThemeSwitcher.astro'
export { default as ThemeSwitcher } from './ThemeSwitcher.astro'

// Navigation + config helpers and types
export {
  buildSidebarSections,
  buildFooterSections,
  pageHref,
  sectionKey,
} from '../nav'
export type {
  BuildSidebarOptions,
  FooterSection,
  MiniTheme,
  NavItem,
  NavSection,
  PageFrontmatter,
  PageModule,
  SiteConfig,
  SocialLink,
} from '../nav'
