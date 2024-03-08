<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import FormControlIcon from '@/components/FormControlIcon.vue'

const props = defineProps({
  name: {
    type: String,
    default: null
  },
  id: {
    type: String,
    default: null
  },
  autocomplete: {
    type: String,
    default: null
  },
  maxlength: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  placeholderEffect: {
    type: Boolean,
    default: false
  },
  inputmode: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  options: {
    type: Array<any>,
    default: null
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: ''
  },
  validation: {
    type: Boolean,
    default: false
  },
  validationError: {
    type: Boolean,
    default: false
  },
  required: Boolean,
  borderless: Boolean,
  marginess: Boolean,
  transparent: Boolean,
  handleEnterKeypress: Boolean,
  readonly: Boolean,
  resizeWithContent: Boolean,
  tabindex: Number,
  minDate: Boolean
})

const emit = defineEmits(['update:modelValue', 'setRef', 'blur', 'enter-pressed'])

const computedValue = computed({
  get: () => props.modelValue as any,
  set: (value) => {
    if (value.id) {
      emit('update:modelValue', value.id)  
    } else {
      emit('update:modelValue', value)
    }    
  }
})

const inputElClass = computed(() => {
  const base = [
    'b2b-form-control zpx-1 zpy-1 w-100 focus:ring focus:outline-none border-gray-700 rounded w-full',
    'dark:placeholder-gray-400',
    computedType.value === 'textarea' ? 'h-24' : 'h-12',
    props.borderless ? 'border-0' : 'border',
    props.marginess ? 'px-0 py-0' : 'z',
    props.transparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800',
    props.validationError ? 'border-error' : ''
  ]

  if (props.icon) {
    base.push('pl-10')
  }

  return base
})

const computedType = computed(() => (props.options ? 'select' : props.type))

const controlIconH = computed(() => (props.type === 'textarea' ? 'h-full' : 'h-12'))

const selectEl = ref(null)

const textareaEl = ref<any>(null)

const inputEl = ref(null)

onMounted(() => {
  if (selectEl.value) {
    emit('setRef', selectEl.value)
  } else if (textareaEl.value) {
    emit('setRef', textareaEl.value)
  } else {
    emit('setRef', inputEl.value)

    // if (inputEl && inputEl.value) {
    //   inputEl.value.setAttribute('autocomplete', 'doNotAutoComplete');
    //   inputEl.value.setAttribute('autocorrect', 'off');
    //   inputEl.value.setAttribute('autocapitalize', 'none');
    //   inputEl.value.setAttribute('spellcheck', 'false');
    // }
  }

  if (props.type === 'date' && inputEl && inputEl.value && props.minDate) {
    ;(inputEl.value as any).min = new Date().toISOString().split('T')[0]
  }
})

const onBlur = () => {
  emit('blur', props.modelValue as any)
}

const keypress = (e: any) => {
  if (!props.handleEnterKeypress) {
    return
  }
  if (e.keyCode === 13) {
    e.preventDefault()
    emit('blur', props.modelValue as any)
    emit('enter-pressed', props.modelValue as any)
  }
}

const resize = () => {
  if (props.resizeWithContent && textareaEl && textareaEl.value) {
    textareaEl.value.style.height = '1px'
    textareaEl.value.style.height = textareaEl.value.scrollHeight + 0 + 'px'
  }
}

const placeholderDefault = computed(() => (props.placeholderEffect ? '' : props.placeholder))

// max='2000-01-01'
</script>

<template>
  <div class="position-relative" :class="validation ? 'with-validation' : ''">
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass"
      :disabled="readonly"
      :tabindex="tabindex"
    >
      <option v-if="placeholderDefault !== ''" value="0" disabled selected>{{placeholderDefault}}</option>
      <option v-for="option in options" :key="option.id ?? option" :value="option.id ?? option">
        {{ option.name ?? (option.attributes ? option.attributes.name : option) }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      ref="textareaEl"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :maxlength="maxlength"
      :placeholder="placeholderDefault"
      :required="required || placeholderEffect"
      @focus="resize"
      @keyup="resize"
      :disabled="readonly"
      :tabindex="tabindex"
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :maxlength="maxlength"
      :inputmode="(inputmode as any)"
      :autocomplete="autocomplete"
      :required="required || placeholderEffect"
      :placeholder="placeholderDefault"
      :type="computedType"
      :class="inputElClass"
      @blur="onBlur"
      @keypress="keypress"
      :disabled="readonly"
      :tabindex="tabindex"
    />
    <span v-if="placeholderEffect && placeholder" class="floating-label">{{ placeholder }}</span>

    <FormControlIcon v-if="icon" :icon="icon" :h="controlIconH" />
  </div>
</template>

<style scoped>
.with-validation input[type='email'],
.with-validation input[type='text'],
.with-validation input[type='number'],
.with-validation input[type='password'] {
  margin-bottom: 0.5rem !important;
}

select.border-error,
input[type='email'].border-error,
input[type='number'].border-error,
input[type='text'].border-error,
input[type='password'].border-error,
input[type='email'].border-error:focus,
input[type='text'].border-error:focus,
input[type='number'].border-error:focus,
input[type='text'].border-error:focus-visible,
input[type='date'].border-error:focus-visible,
input[type='password'].border-error:focus {
  /* border:1px solid #ff6666 !important; 
  color:#ff6666; */
  outline: 0 !important;
  border: 1px solid var(--status-pending-task-default, #f57356) !important;
  scroll-margin-top: 30px;
}

input[type='text']:focus-visible,
input[type='date']:focus-visible,
input[type='number']:focus-visible,
input[type='password']:focus-visible,
textarea:focus-visible {
  outline: 0 !important;
}

input:focus ~ .floating-label,
input:not(:focus):valid ~ .floating-label,
input:not(:focus):disabled ~ .floating-label,
textarea:focus ~ .floating-label,
textarea:not(:focus):valid ~ .floating-label,
textarea:not(:focus):disabled ~ .floating-label {
  color: var(--text-subdued-500, #8891a0);
  /* Text/Headline Semibold */
  font-family: Athletics;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 125% */

  top: 2px;
  bottom: 11px;
  left: 17px;
  font-size: 10px;
  opacity: 1;
}

.floating-label {
  color: var(--text-subdued-500, #8891a0);
  /* Text/Headline Semibold */
  font-family: Athletics;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 125% */

  position: absolute;
  pointer-events: none;
  left: 20px;
  top: 14px;
  transition: 0.2s ease all;
}
</style>
