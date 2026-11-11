import type { D1SearchOptions } from 'astro-d1-search'

// Keep this file free of Node imports: the /search page bundles it into the Worker.
// One source per docs section. `type` becomes the `type` filter of /api/search.
const searchConfig: D1SearchOptions = {
  binding: 'SEARCH_DB',
  database: 'zui-docs-search',
  sources: [
    {
      dir: 'src/pages/components',
      type: 'component',
      url: '/components/:slug',
    },
    { dir: 'src/pages/tokens', type: 'token', url: '/tokens/:slug' },
    { dir: 'src/pages/utilities', type: 'utility', url: '/utilities/:slug' },
    { dir: 'src/pages/guides', type: 'guide', url: '/guides/:slug' },
    {
      dir: 'src/pages/integrations',
      type: 'integration',
      url: '/integrations/:slug',
    },
  ],
}

export default searchConfig
