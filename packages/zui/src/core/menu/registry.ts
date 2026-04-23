import type {
  MenuContentRegistration,
  MenuItemRegistration,
  MenuTriggerRegistration,
} from './types'

export class MenuRegistry {
  private content?: MenuContentRegistration
  private items = new Map<string, MenuItemRegistration>()
  private trigger?: MenuTriggerRegistration

  registerTrigger(registration: MenuTriggerRegistration) {
    this.trigger = registration
    return () => {
      if (this.trigger === registration) {
        this.trigger = undefined
      }
    }
  }

  registerContent(registration: MenuContentRegistration) {
    this.content = registration
    return () => {
      if (this.content === registration) {
        this.content = undefined
      }
    }
  }

  registerItem(registration: MenuItemRegistration) {
    this.items.set(registration.id, registration)
    return () => {
      const current = this.items.get(registration.id)
      if (current === registration) {
        this.items.delete(registration.id)
      }
    }
  }

  getTrigger() {
    return this.trigger
  }

  getContent() {
    return this.content
  }

  getItem(id: string | null | undefined) {
    if (id == null) return undefined
    return this.items.get(id)
  }

  getItems() {
    return [...this.items.values()].sort((a, b) => a.order - b.order)
  }

  getEnabledItems() {
    return this.getItems().filter((item) => !item.disabled)
  }

  getFirstEnabledItem() {
    return this.getEnabledItems()[0]
  }

  getLastEnabledItem() {
    return this.getEnabledItems().at(-1)
  }
}
