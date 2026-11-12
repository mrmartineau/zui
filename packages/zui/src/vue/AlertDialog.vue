<template>
  <Dialog
    :id="baseId"
    role="alertdialog"
    :aria-labelledby="`${baseId}-title`"
    :aria-describedby="description ? `${baseId}-description` : undefined"
    :class="classes"
    :open="open"
    :shape="shape"
    :closedby="closedby"
    v-bind="$attrs"
    @close="$emit('close')"
  >
    <DialogHeader>
      <DialogTitle :id="`${baseId}-title`">{{ title }}</DialogTitle>
      <DialogDescription v-if="description" :id="`${baseId}-description`">
        {{ description }}
      </DialogDescription>
    </DialogHeader>
    <slot />
  </Dialog>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import Dialog from './Dialog.vue'
import DialogDescription from './DialogDescription.vue'
import DialogHeader from './DialogHeader.vue'
import DialogTitle from './DialogTitle.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: string
    id?: string
    open?: boolean
    shape?: 'default' | 'hard' | 'squircle'
    /** Names the dialog for assistive tech. Keep it short, such as "Delete this project?" */
    title: string
    /** Says what happens next. Read out when the dialog opens */
    description?: string
    /** Defaults to `"closerequest"`: Esc closes it, a click outside does not. */
    closedby?: 'any' | 'closerequest' | 'none'
  }>(),
  {
    closedby: 'closerequest',
  },
)

defineEmits<{
  close: []
}>()

// Vue < 3.5 has no useId(), and the instance uid is the same on server and client
const uid = getCurrentInstance()?.uid ?? 0
const baseId = computed(() => props.id ?? `zui-alert-dialog-${uid}`)
const classes = computed(() =>
  ['zui-alert-dialog', props.class].filter(Boolean).join(' '),
)
</script>
