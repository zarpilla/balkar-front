<script lang="ts">
// @ts-nocheck
import getCaretPosition from 'textarea-caret'
import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  watch,
  nextTick,
  PropType
} from 'vue'

export interface MentionItem {
  searchText?: string
  label?: string
  value: any
}

export default defineComponent({
  inheritAttrs: false,

  props: {
    keys: {
      type: Array as PropType<string[]>,
      required: true
    },

    items: {
      type: Array as PropType<MentionItem[]>,
      default: () => []
    },

    omitKey: {
      type: Boolean,
      default: false
    },

    filteringDisabled: {
      type: Boolean,
      default: false
    },

    insertSpace: {
      type: Boolean,
      default: false
    },

    mapInsert: {
      type: Function as PropType<(item: MentionItem, key: string) => string>,
      default: null
    },

    limit: {
      type: Number,
      default: 8
    },

    theme: {
      type: String,
      default: 'mentionable'
    },

    caretHeight: {
      type: Number,
      default: 0
    },
    emptyText: {
      type: Boolean,
      default: false
    }
  },

  emits: ['search', 'open', 'close', 'apply'],

  setup(props, { emit }) {
    const currentKey = ref<string>(null)
    let currentKeyIndex: number
    const oldKey = ref<string>(null)

    // Items

    const searchText = ref<string>(null)

    watch(searchText, (value, oldValue) => {
      if (value) {
        emit('search', value, oldValue)
      }
    })

    const filteredItems = computed(() => {
      if (!searchText.value || props.filteringDisabled) {
        return props.items
      }

      const finalSearchText = searchText.value.toLowerCase()

      return props.items.filter((item) => {
        let text: string
        if (item.searchText) {
          text = item.searchText
        } else if (item.label) {
          text = item.label
        } else {
          text = ''
          for (const key in item) {
            text += item[key]
          }
        }
        return text.toLowerCase().includes(finalSearchText)
      })
    })

    const displayedItems = computed(() => filteredItems.value.slice(0, props.limit))

    // Selection

    const selectedIndex = ref(0)

    watch(
      displayedItems,
      () => {
        selectedIndex.value = 0
      },
      {
        deep: true
      }
    )

    watch(
      () => props.emptyText,
      (value) => {
        setTimeout(() => {
          resize()
        }, 10)
      }
    )

    // Input element management

    let input: HTMLElement
    const el = ref<HTMLDivElement>(null)

    function getInput() {
      return (
        el.value.querySelector('input') ??
        el.value.querySelector('textarea') ??
        el.value.querySelector('[contenteditable="true"]')
      )
    }

    onMounted(() => {
      input = getInput()
      attach()
    })

    onUpdated(() => {
      const newInput = getInput()
      if (newInput !== input) {
        detach()
        input = newInput
        attach()
      }
    })

    onUnmounted(() => {
      detach()
    })

    // Events

    function attach() {
      if (input) {
        input.addEventListener('input', onInput)
        input.addEventListener('keydown', onKeyDown)
        input.addEventListener('keyup', onKeyUp)
        input.addEventListener('scroll', onScroll)
        input.addEventListener('blur', onBlur)
      }
    }

    function detach() {
      if (input) {
        input.removeEventListener('input', onInput)
        input.removeEventListener('keydown', onKeyDown)
        input.removeEventListener('keyup', onKeyUp)
        input.removeEventListener('scroll', onScroll)
        input.removeEventListener('blur', onBlur)
      }
    }

    function onInput() {
      checkKey()
      resize()
    }

    function onBlur() {
      closeMenu()
    }

    function onKeyDown(e: KeyboardEvent) {
      resize()

      if (currentKey.value) {
        if (e.key === 'ArrowDown') {
          selectedIndex.value++
          if (selectedIndex.value >= displayedItems.value.length) {
            selectedIndex.value = 0
          }
          cancelEvent(e)
        }
        if (e.key === 'ArrowUp') {
          selectedIndex.value--
          if (selectedIndex.value < 0) {
            selectedIndex.value = displayedItems.value.length - 1
          }
          cancelEvent(e)
        }
        if ((e.key === 'Enter' || e.key === 'Tab') && displayedItems.value.length > 0) {
          applyMention(selectedIndex.value)
          cancelEvent(e)
        }
        if (e.key === 'Escape') {
          closeMenu()
          cancelEvent(e)
        }
      }
    }

    let cancelKeyUp = null

    function onKeyUp(e: KeyboardEvent) {
      if (cancelKeyUp && e.key === cancelKeyUp) {
        cancelEvent(e)
      }
      cancelKeyUp = null
    }

    function cancelEvent(e: KeyboardEvent) {
      e.preventDefault()
      e.stopPropagation()
      cancelKeyUp = e.key
    }

    function onScroll() {
      updateCaretPosition()
    }

    function getSelectionStart() {
      return input.isContentEditable
        ? window.getSelection().anchorOffset
        : (input as HTMLInputElement).selectionStart
    }

    function setCaretPosition(index: number) {
      nextTick(() => {
        ;(input as HTMLInputElement).selectionEnd = index
      })
    }

    function getValue() {
      return input.isContentEditable
        ? window.getSelection().anchorNode.textContent
        : (input as HTMLInputElement).value
    }

    function setValue(value) {
      ;(input as HTMLInputElement).value = value
      emitInputEvent('input')
    }

    function emitInputEvent(type: string) {
      input.dispatchEvent(new Event(type))
    }

    let lastSearchText: string = null

    function checkKey() {
      const index = getSelectionStart()
      if (index >= 0) {
        const { key, keyIndex } = getLastKeyBeforeCaret(index)
        const text = (lastSearchText = getLastSearchText(index, keyIndex))
        if (!(keyIndex < 1 || /\s/.test(getValue()[keyIndex - 1]))) {
          return false
        }
        if (text != null) {
          openMenu(key, keyIndex)
          searchText.value = text
          return true
        }
      }
      closeMenu()
      return false
    }

    function getLastKeyBeforeCaret(caretIndex: number) {
      const [keyData] = props.keys
        .map((key) => ({
          key,
          keyIndex: getValue().lastIndexOf(key, caretIndex - 1)
        }))
        .sort((a, b) => b.keyIndex - a.keyIndex)
      return keyData
    }

    function getLastSearchText(caretIndex: number, keyIndex: number) {
      if (keyIndex !== -1) {
        const text = getValue().substring(keyIndex + 1, caretIndex)
        // If there is a space we close the menu
        if (!/\s/.test(text)) {
          return text
        }
      }
      return null
    }

    // Position of the popper

    const caretPosition = ref<{ top: number; left: number; height: number }>(null)

    function updateCaretPosition() {
      if (currentKey.value) {
        if (input.isContentEditable) {
          const rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
          const inputRect = input.getBoundingClientRect()
          caretPosition.value = {
            left: rect.left - inputRect.left,
            top: rect.top - inputRect.top,
            height: rect.height
          }
        } else {
          caretPosition.value = getCaretPosition(input, currentKeyIndex)
        }
        caretPosition.value.top -= input.scrollTop
        if (props.caretHeight) {
          caretPosition.value.height = props.caretHeight
        } else if (isNaN(caretPosition.value.height)) {
          caretPosition.value.height = 16
        }
      }
    }

    // Open/close

    function openMenu(key: string, keyIndex: number) {
      if (currentKey.value !== key) {
        currentKey.value = key
        currentKeyIndex = keyIndex
        updateCaretPosition()
        selectedIndex.value = 0
        emit('open', currentKey.value)
      }
    }

    function closeMenu() {
      if (currentKey.value != null) {
        oldKey.value = currentKey.value
        currentKey.value = null
        emit('close', oldKey.value)
      }
    }

    // Apply
    const parts = ref<any[]>([])

    function applyMention(itemIndex: number) {
      const item = displayedItems.value[itemIndex]
      const value =
        (props.omitKey ? '' : currentKey.value) +
        String(props.mapInsert ? props.mapInsert(item, currentKey.value) : item.value) +
        (props.insertSpace ? ' ' : '')
      if (input.isContentEditable) {
        const range = window.getSelection().getRangeAt(0)
        range.setStart(
          range.startContainer,
          range.startOffset - currentKey.value.length - (lastSearchText ? lastSearchText.length : 0)
        )
        range.deleteContents()
        range.insertNode(document.createTextNode(value))
        range.setStart(range.endContainer, range.endOffset)
        emitInputEvent('input')
      } else {
        setValue(replaceText(getValue(), searchText.value, value, currentKeyIndex))
        setCaretPosition(currentKeyIndex + value.length)
      }
      emit('apply', item, currentKey.value, value)
      closeMenu()
    }

    function replaceText(text: string, searchString: string, newText: string, index: number) {
      return (
        text.slice(0, index) +
        newText +
        text.slice(index + (searchString ? searchString.length : 0) + 1, text.length)
      )
    }

    const resize = () => {
      const textareaEl = getInput()
      if (textareaEl) {
        textareaEl.style.height = '1px'
        textareaEl.style.height = textareaEl.scrollHeight + 0 + 'px'
      }
    }

    return {
      el,
      currentKey,
      oldKey,
      caretPosition,
      displayedItems,
      selectedIndex,
      applyMention,
      parts,
      resize
    }
  }
})
</script>

<template>
  <div ref="el" class="mentionable ps-1" :class="$attrs.class" style="position: relative">
    <slot />

    <div class="involved-users-placeholder">
      <div
        v-if="displayedItems.length"
        v-show="!!currentKey"
        ref="popper"
        v-bind="{ ...$attrs, class: undefined }"
        class="involved-users"
        :class="!displayedItems.length ? 'zzd-none' : 'z'"
      >
        <div
          v-for="(item, index) of displayedItems"
          :key="index"
          class="mention-item"
          :class="{
            'mention-selected': selectedIndex === index
          }"
          @mouseover="selectedIndex = index"
          @mousedown="applyMention(index)"
        >
          <slot :name="`item-thekey`" :item="item" :index="index">
            <slot name="item" :item="item" :index="index">
              {{ item.label || item.value }}
            </slot>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.involved-users-placeholder{
  position: relative;
  width: 100%;
}
.involved-users {
  position: absolute;
  top: 20px;
  box-shadow: 0px 2px 8px 2px rgba(215, 221, 229, 0.5);
  padding: 20px 10px;
  width: 90%;
  z-index: 10;
  background: #fff;
}

.involved-users .involved-user {
  margin: 0px 0;
  font-weight: normal;
  padding: 5px 10px;
  cursor: pointer;
}

.involved-users .involved-user:hover {
  background: var(--secondary-100, #edeef3);
  border-radius: 4px;
}

.fake-mentionable {
  position: relative;
  width: 100%;
}

.fake-mentionable textarea {
  color: #633;
  border: 0;
  width: 100%;
  height: 40px;
  z-index: 10;
}

.fake-mentionable-text {
  pointer-events: none;
  margin-bottom: 0;
  color: var(--text-default-800, #0e0f11);
  font-family: SF Pro Rounded;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  z-index: 5;
}
</style>
<style lang="scss">
.modal-body .involved-users {
  position: relative;
  bottom: inherit;
}
</style>
