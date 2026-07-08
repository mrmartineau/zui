import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { RefreshDataAction, useReferenceData } from './reference'

const SECTION_ORDER = [
  'Components',
  'Tokens',
  'Utilities',
  'Guides',
  'Integrations',
  'Other',
]

const SECTION_ICONS: Record<string, Icon> = {
  Components: Icon.AppWindowGrid2x2,
  Guides: Icon.Book,
  Integrations: Icon.Plug,
  Other: Icon.Document,
  Tokens: Icon.Swatch,
  Utilities: Icon.WrenchScrewdriver,
}

export default function SearchDocs() {
  const { data, isLoading, refresh } = useReferenceData()
  const docs = data.docs
  const sections = SECTION_ORDER.filter((section) =>
    docs.some((doc) => doc.section === section),
  )

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search the ZUI documentation…"
    >
      {sections.map((section) => (
        <List.Section key={section} title={section}>
          {docs
            .filter((doc) => doc.section === section)
            .map((doc) => (
              <List.Item
                key={doc.slug}
                icon={SECTION_ICONS[section] ?? Icon.Document}
                title={doc.title}
                subtitle={doc.description}
                keywords={doc.slug.split('/')}
                actions={
                  <ActionPanel>
                    <Action.OpenInBrowser url={doc.url} />
                    <Action.CopyToClipboard
                      title="Copy URL"
                      content={doc.url}
                    />
                    <RefreshDataAction refresh={refresh} />
                  </ActionPanel>
                }
              />
            ))}
        </List.Section>
      ))}
    </List>
  )
}
