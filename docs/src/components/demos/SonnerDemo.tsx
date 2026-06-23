/** @jsxImportSource react */
import { Button, useColorScheme } from '@mrmartineau/zui/react'
import { Toaster, toast } from 'sonner'
import '../../styles/sonner-zui.css'

function fakeSave() {
  return new Promise((resolve) => setTimeout(resolve, 1500))
}

export default function SonnerDemo() {
  // Keep Sonner's theme in sync with ZUI's light/dark/system toggle.
  const { scheme } = useColorScheme()

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xs)' }}>
      <Toaster theme={scheme} closeButton />

      <Button onClick={() => toast('Settings saved')}>Default</Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.success('Profile updated', {
            description: 'Your changes are live.',
          })
        }
      >
        Success
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.error('Could not save', {
            description: 'Check your connection and try again.',
          })
        }
      >
        Error
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast('New message from Alice', {
            action: {
              label: 'Reply',
              onClick: () => toast('Opening reply…'),
            },
          })
        }
      >
        With action
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.promise(fakeSave(), {
            loading: 'Saving…',
            success: 'Saved!',
            error: 'Save failed',
          })
        }
      >
        Promise
      </Button>
    </div>
  )
}
