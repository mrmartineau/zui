import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useState } from 'react'
import { type TokenEntry, tokens } from './data'

const CATEGORY_LABELS: Record<string, string> = {
  animation: 'Animation',
  aspect: 'Aspect Ratio',
  color: 'Color',
  easing: 'Easing',
  'font-size': 'Font Size',
  'font-stacks': 'Font Stacks',
  'font-weight': 'Font Weight',
  'letter-spacing': 'Letter Spacing',
  'line-height': 'Line Height',
  radii: 'Radii',
  shadow: 'Shadows',
  size: 'Size',
  space: 'Space',
  theme: 'Theme',
  zindex: 'Z-Index',
}

const categoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category

const categories = [...new Set(tokens.map((token) => token.category))]

function tokenIcon(token: TokenEntry) {
  if (token.color) {
    return { source: Icon.CircleFilled, tintColor: token.color }
  }
  return token.category === 'color' || token.category === 'theme' ? Icon.EyeDropper : Icon.Ruler
}

function TokenItem({ token, showCategory }: { token: TokenEntry; showCategory: boolean }) {
  const cssVar = `var(${token.name})`
  return (
    <List.Item
      icon={tokenIcon(token)}
      title={token.name}
      subtitle={token.value}
      keywords={token.name.split('-').filter(Boolean)}
      accessories={showCategory ? [{ tag: categoryLabel(token.category) }] : undefined}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title={`Copy ${cssVar}`} content={cssVar} />
          <Action.Paste title={`Paste ${cssVar}`} content={cssVar} />
          <Action.CopyToClipboard
            title="Copy Token Name"
            content={token.name}
            shortcut={{ key: 'c', modifiers: ['cmd', 'shift'] }}
          />
          <Action.CopyToClipboard
            title="Copy Value"
            content={token.value}
            shortcut={{ key: 'v', modifiers: ['cmd', 'shift'] }}
          />
          {token.docsUrl && (
            <Action.OpenInBrowser
              title="Open Documentation"
              url={token.docsUrl}
              shortcut={{ key: 'd', modifiers: ['cmd'] }}
            />
          )}
        </ActionPanel>
      }
    />
  )
}

export default function SearchTokens() {
  const [category, setCategory] = useState('all')
  const showAll = category === 'all'

  return (
    <List
      searchBarPlaceholder="Search ZUI design tokens…"
      searchBarAccessory={
        <List.Dropdown tooltip="Filter by Category" storeValue onChange={setCategory}>
          <List.Dropdown.Item title="All Categories" value="all" />
          {categories.map((value) => (
            <List.Dropdown.Item key={value} title={categoryLabel(value)} value={value} />
          ))}
        </List.Dropdown>
      }
    >
      {categories
        .filter((value) => showAll || value === category)
        .map((value) => {
          const categoryTokens = tokens.filter((token) => token.category === value)
          return (
            <List.Section
              key={value}
              title={categoryLabel(value)}
              subtitle={`${categoryTokens.length}`}
            >
              {categoryTokens.map((token) => (
                <TokenItem key={token.name} token={token} showCategory={false} />
              ))}
            </List.Section>
          )
        })}
    </List>
  )
}
