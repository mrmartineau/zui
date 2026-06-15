/**
 * Navigation + site configuration helpers for the ZUI docs theme.
 *
 * These helpers turn the result of Astro's `import.meta.glob` over your
 * `src/pages` directory into the data structures the theme components consume.
 * Run the glob from a file inside your own project (so the paths resolve
 * relative to your `pages` directory) and pass the result here.
 */

export interface PageFrontmatter {
  title: string
  description?: string
  /** Order within a section's sidebar list. Lower comes first. */
  order?: number
  /** Order of the whole section. Set on the section's `index.mdx`. */
  sectionOrder?: number
}

export interface PageModule {
  frontmatter?: PageFrontmatter
}

export interface NavItem {
  href: string
  label: string
  /** Only mark active on an exact path match (used for section index pages). */
  exact?: boolean
  order?: number
}

export interface NavSection {
  heading: string
  sectionOrder: number
  items: NavItem[]
}

export interface FooterSection {
  href: string
  label: string
  sectionOrder: number
}

/** A header/footer link, typically to a social or external destination. */
export interface SocialLink {
  href: string
  label?: string
  /** Phosphor icon name, e.g. `github-logo`. Rendered as `<i class="ph ph-…">`. */
  icon?: string
  ariaLabel?: string
}

export interface MiniTheme {
  id: string
  /** Any CSS colour value, e.g. `var(--color-slate-500)`. */
  color: string
}

export interface SiteConfig {
  /** Brand name. Used for the logo and the `<title>` prefix. */
  title: string
  /** Logo text override. Defaults to `title`. */
  logo?: string
  /** Default `<meta name="description">`. */
  description?: string
  version?: string
  /** Where the version badge links to. Default `/changelog`. */
  versionHref?: string
  /** Author shown in the footer credit. */
  author?: string
  authorHref?: string
  /** Header + footer links (GitHub, npm, …). */
  social?: SocialLink[]
  /** Load Phosphor Icons from the CDN. Default `true`. */
  phosphor?: boolean
  /** Phosphor web package version used for the CDN URL. */
  phosphorVersion?: string
  /** Show the floating theme builder. Default `true`. */
  themeSwitcher?: boolean
  /** Show the header colour-theme dot switcher. Default `true`. */
  miniThemeSwitcher?: boolean
  /** Colour options for the mini theme switcher. */
  miniThemes?: MiniTheme[]
  /** Show the light/dark/system toggle. Default `true`. */
  colorSchemeToggle?: boolean
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Convert a glob key (e.g. `../pages/components/button.mdx`) to an href. */
export function pageHref(filePath: string): string {
  return (
    filePath
      .replace(/^.*\/pages\//, '/')
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '') || '/'
  )
}

/** Extract the top-level section key from a glob key, e.g. `components`. */
export function sectionKey(filePath: string): string | null {
  return filePath.match(/\/pages\/([^/]+)\//)?.[1] ?? null
}

function compareItems(a: NavItem, b: NavItem): number {
  const aOrdered = a.order !== undefined
  const bOrdered = b.order !== undefined
  if (aOrdered && bOrdered) return (a.order ?? 0) - (b.order ?? 0)
  if (aOrdered) return -1
  if (bOrdered) return 1
  return a.label.localeCompare(b.label)
}

export interface BuildSidebarOptions {
  /** Append extra (non-page) items to a section, keyed by section heading. */
  append?: Array<{ heading: string; items: NavItem[] }>
}

/**
 * Build grouped sidebar sections from a `pages` glob.
 *
 * @example
 * const pages = import.meta.glob('../pages/**\/*.mdx', { eager: true })
 * const sections = buildSidebarSections(pages)
 */
export function buildSidebarSections(
  pages: Record<string, unknown>,
  options: BuildSidebarOptions = {},
): NavSection[] {
  const sectionMap = new Map<string, NavSection>()

  for (const [path, mod] of Object.entries(pages)) {
    const key = sectionKey(path)
    if (!key) continue

    const fm = (mod as PageModule).frontmatter ?? ({} as PageFrontmatter)
    const isIndex = /\/index\.mdx$/.test(path)
    const href = pageHref(path)

    if (!sectionMap.has(key)) {
      sectionMap.set(key, {
        heading: capitalize(key),
        items: [],
        sectionOrder: Number.POSITIVE_INFINITY,
      })
    }

    const section = sectionMap.get(key)
    if (!section) continue

    if (isIndex) {
      section.sectionOrder = fm.sectionOrder ?? Number.POSITIVE_INFINITY
    }

    section.items.push({
      exact: isIndex || undefined,
      href,
      label: fm.title ?? capitalize(key),
      order: isIndex ? (fm.order ?? 0) : fm.order,
    })
  }

  const sections = [...sectionMap.values()]
    .sort(
      (a, b) =>
        a.sectionOrder - b.sectionOrder || a.heading.localeCompare(b.heading),
    )
    .map((section) => ({
      ...section,
      items: [...section.items].sort(compareItems),
    }))

  for (const extra of options.append ?? []) {
    const section = sections.find((s) => s.heading === extra.heading)
    if (section) section.items.push(...extra.items)
  }

  return sections
}

/**
 * Build the footer section links from a glob of section `index.mdx` pages.
 *
 * @example
 * const indexPages = import.meta.glob('../pages/*\/index.mdx', { eager: true })
 * const footerSections = buildFooterSections(indexPages)
 */
export function buildFooterSections(
  indexPages: Record<string, unknown>,
): FooterSection[] {
  return Object.entries(indexPages)
    .map(([path, mod]) => {
      const fm = (mod as PageModule).frontmatter ?? ({} as PageFrontmatter)
      const sectionName = sectionKey(path) ?? ''
      return {
        href: `/${sectionName}`,
        label: capitalize(sectionName),
        sectionOrder: fm.sectionOrder ?? Number.POSITIVE_INFINITY,
      }
    })
    .sort(
      (a, b) =>
        a.sectionOrder - b.sectionOrder || a.label.localeCompare(b.label),
    )
}
