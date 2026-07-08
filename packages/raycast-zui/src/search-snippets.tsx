import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useState } from 'react'
import {
  type Framework,
  RefreshDataAction,
  useReferenceData,
} from './reference'

const FRAMEWORKS: { id: Framework; label: string; lang: string }[] = [
  { id: 'html', label: 'HTML', lang: 'html' },
  { id: 'react', label: 'React', lang: 'tsx' },
  { id: 'astro', label: 'Astro', lang: 'astro' },
  { id: 'solid', label: 'Solid', lang: 'tsx' },
  { id: 'svelte', label: 'Svelte', lang: 'svelte' },
  { id: 'vue', label: 'Vue', lang: 'vue' },
]

export default function SearchSnippets() {
  const { data, isLoading, refresh } = useReferenceData()
  const [frameworkId, setFrameworkId] = useState<Framework>('html')
  const framework =
    FRAMEWORKS.find((f) => f.id === frameworkId) ?? FRAMEWORKS[0]
  const available = data.snippets.filter(
    (snippet) => snippet.frameworks[framework.id],
  )
  const pages = [...new Set(available.map((snippet) => snippet.page))]

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      searchBarPlaceholder={`Search ZUI ${framework.label} snippets…`}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Framework"
          storeValue
          onChange={(value) => setFrameworkId(value as Framework)}
        >
          {FRAMEWORKS.map((f) => (
            <List.Dropdown.Item key={f.id} title={f.label} value={f.id} />
          ))}
        </List.Dropdown>
      }
    >
      {pages.map((page) => (
        <List.Section key={page} title={page}>
          {available
            .filter((snippet) => snippet.page === page)
            .map((snippet) => {
              const code = snippet.frameworks[framework.id] ?? ''
              return (
                <List.Item
                  key={snippet.id}
                  icon={Icon.CodeBlock}
                  title={snippet.title}
                  keywords={[snippet.page, framework.label]}
                  detail={
                    <List.Item.Detail
                      markdown={`\`\`\`${framework.lang}\n${code}\n\`\`\``}
                    />
                  }
                  actions={
                    <ActionPanel>
                      <Action.CopyToClipboard
                        title="Copy Snippet"
                        content={code}
                      />
                      <Action.Paste title="Paste Snippet" content={code} />
                      <Action.OpenInBrowser
                        title="Open Documentation"
                        url={snippet.pageUrl}
                        shortcut={{ key: 'd', modifiers: ['cmd'] }}
                      />
                      <RefreshDataAction refresh={refresh} />
                    </ActionPanel>
                  }
                />
              )
            })}
        </List.Section>
      ))}
    </List>
  )
}
