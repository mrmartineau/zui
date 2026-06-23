/** @jsxImportSource react */
import { Command } from 'cmdk'
import { useState } from 'react'
import '../../styles/cmdk-zui.css'

export default function CmdkDemo() {
  const [ran, setRan] = useState<string | null>(null)

  return (
    <div style={{ width: '100%' }}>
      <Command label="Command menu">
        <Command.Input placeholder="Type a command or search…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Suggestions">
            <Command.Item onSelect={() => setRan('New file')}>
              <i className="ph ph-file-plus" />
              New file
            </Command.Item>
            <Command.Item onSelect={() => setRan('New folder')}>
              <i className="ph ph-folder-plus" />
              New folder
            </Command.Item>
            <Command.Item onSelect={() => setRan('Search the docs')}>
              <i className="ph ph-magnifying-glass" />
              Search the docs
            </Command.Item>
          </Command.Group>

          <Command.Separator />

          <Command.Group heading="Settings">
            <Command.Item onSelect={() => setRan('Profile')}>
              <i className="ph ph-user" />
              Profile
            </Command.Item>
            <Command.Item onSelect={() => setRan('Appearance')}>
              <i className="ph ph-palette" />
              Appearance
            </Command.Item>
            <Command.Item onSelect={() => setRan('Keyboard shortcuts')}>
              <i className="ph ph-keyboard" />
              Keyboard shortcuts
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>

      {ran && (
        <p
          className="zui-field-description"
          style={{ marginTop: 'var(--space-2xs)' }}
        >
          Ran: <strong>{ran}</strong>
        </p>
      )}
    </div>
  )
}
