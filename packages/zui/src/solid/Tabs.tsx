import type { JSX } from 'solid-js'
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
} from 'solid-js'
import { createTabsController } from '../core/tabs'
import type {
  TabsActivationMode,
  TabsDirection,
  TabsOrientation,
} from '../core/tabs'
import { tabsVariants } from '../shared/tabsVariants'
import { TabsContext } from './tabsContext'

export type TabsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  activationMode?: TabsActivationMode
  defaultValue?: string
  dir?: TabsDirection
  disabled?: boolean
  id?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  value?: string
}

export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, [
    'activationMode',
    'children',
    'class',
    'defaultValue',
    'dir',
    'disabled',
    'id',
    'onValueChange',
    'orientation',
    'value',
  ])

  const controller = createTabsController({
    activationMode: local.activationMode,
    defaultValue: local.defaultValue,
    dir: local.dir,
    disabled: local.disabled,
    id: local.id,
    onValueChange: local.onValueChange,
    orientation: local.orientation,
    value: local.value,
  })

  const [rootRef, setRootRef] = createSignal<HTMLDivElement>()
  const [snapshot, setSnapshot] = createSignal(controller.getSnapshot())

  const unsubscribe = controller.subscribe(setSnapshot)
  onCleanup(unsubscribe)

  createEffect(() => {
    controller.setOptions({
      activationMode: local.activationMode,
      defaultValue: local.defaultValue,
      dir: local.dir,
      disabled: local.disabled,
      id: local.id,
      onValueChange: local.onValueChange,
      orientation: local.orientation,
      value: local.value,
    })
  })

  const classes = createMemo(() => tabsVariants({ className: local.class }))
  const contextValue = {
    controller,
    rootRef,
    snapshot,
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={setRootRef}
        class={classes()}
        data-disabled={snapshot().disabled ? 'true' : undefined}
        data-orientation={snapshot().orientation}
        data-zui-tabs-root=""
        id={snapshot().rootId}
      >
        {local.children}
      </div>
    </TabsContext.Provider>
  )
}
