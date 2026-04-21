import type {
  TabsContentRegistration,
  TabsTriggerRegistration,
} from './types'

export class TabsRegistry {
  private contents = new Map<string, TabsContentRegistration>()
  private triggers = new Map<string, TabsTriggerRegistration>()

  registerTrigger(registration: TabsTriggerRegistration) {
    this.triggers.set(registration.value, registration)
    return () => {
      const current = this.triggers.get(registration.value)
      if (current === registration) {
        this.triggers.delete(registration.value)
      }
    }
  }

  registerContent(registration: TabsContentRegistration) {
    this.contents.set(registration.value, registration)
    return () => {
      const current = this.contents.get(registration.value)
      if (current === registration) {
        this.contents.delete(registration.value)
      }
    }
  }

  getTrigger(value: string) {
    return this.triggers.get(value)
  }

  getContent(value: string) {
    return this.contents.get(value)
  }

  getTriggers() {
    return [...this.triggers.values()].sort((a, b) => a.order - b.order)
  }

  getEnabledTriggers() {
    return this.getTriggers().filter((trigger) => !trigger.disabled)
  }

  getFirstEnabledValue() {
    return this.getEnabledTriggers()[0]?.value ?? null
  }

  hasTrigger(value: string | null | undefined) {
    if (value == null) return false
    return this.triggers.has(value)
  }

  hasContent(value: string | null | undefined) {
    if (value == null) return false
    return this.contents.has(value)
  }
}
