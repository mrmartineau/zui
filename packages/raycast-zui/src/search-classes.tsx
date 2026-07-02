import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { type ClassEntry, classes } from './data'

const isUtility = (entry: ClassEntry) => entry.source.startsWith('utility/')

const sourceLabel = (entry: ClassEntry) =>
  isUtility(entry) ? entry.source.slice('utility/'.length) : entry.source

function ClassItem({ entry }: { entry: ClassEntry }) {
  return (
    <List.Item
      icon={Icon.Code}
      title={entry.name}
      keywords={entry.name.split('-').filter(Boolean)}
      accessories={[{ tag: sourceLabel(entry) }]}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Class Name" content={entry.name} />
          <Action.Paste title="Paste Class Name" content={entry.name} />
          {entry.docsUrl && (
            <Action.OpenInBrowser
              title="Open Documentation"
              url={entry.docsUrl}
              shortcut={{ key: 'd', modifiers: ['cmd'] }}
            />
          )}
        </ActionPanel>
      }
    />
  )
}

export default function SearchClasses() {
  const componentClasses = classes.filter((entry) => !isUtility(entry))
  const utilityClasses = classes.filter(isUtility)

  return (
    <List searchBarPlaceholder="Search ZUI CSS classes…">
      <List.Section title="Components" subtitle={`${componentClasses.length}`}>
        {componentClasses.map((entry) => (
          <ClassItem key={entry.name} entry={entry} />
        ))}
      </List.Section>
      <List.Section title="Utilities" subtitle={`${utilityClasses.length}`}>
        {utilityClasses.map((entry) => (
          <ClassItem key={entry.name} entry={entry} />
        ))}
      </List.Section>
    </List>
  )
}
