<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Object
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'checkbox',
    validator: (value: string) => ['checkbox', 'radio', 'switch'].includes(value)
  },
  label: {
    type: String,
    default: null
  },
  modelValue: {
    type: [Array, String, Number, Boolean],
    default: null
  },
  inputValue: {
    type: [String, Number, Boolean],
    required: true
  },
  readonly: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const inputType = computed(() => (props.type === 'radio' ? 'radio' : 'checkbox'))
</script>

<template>
  <label :class="type">
    <input
      v-model="computedValue"
      :type="inputType"
      :name="name"
      :value="inputValue"
      :readonly="readonly"
      :disabled="readonly"
    />
    <span class="check" />
    <span class="ps-2" v-html="label"></span>
    <div v-if="value">
      <slot name="value"  v-bind="value"></slot>
    </div>
    
  </label>
</template>
<style scoped>
label {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  margin-right: 1.5rem;
}
</style>
