<template>
  <div class="radio-option" :class="optionClass">
    <label class="radio-option__label">
      <input
        type="radio"
        :name="name"
        :value="value"
        :checked="isSelected"
        @change="emit('change', value)"
        class="radio-option__input"
      />
      <div class="radio-option__custom">
        <div class="radio-option__icon">
          <!-- RadioEmpty SVG -->
          <svg 
            v-if="!isSelected"
            width="20" 
            height="21" 
            viewBox="0 0 20 21" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="mask0_96_425" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
              <rect y="0.348755" width="20" height="20" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_96_425)">
              <path d="M10.0058 18.3488C8.90472 18.3488 7.86806 18.1404 6.89583 17.7238C5.92361 17.3071 5.07292 16.7342 4.34375 16.005C3.61458 15.2758 3.04167 14.4254 2.625 13.4538C2.20833 12.4821 2 11.4439 2 10.3392C2 9.23445 2.20833 8.19945 2.625 7.23417C3.04167 6.26889 3.61458 5.42167 4.34375 4.6925C5.07292 3.96334 5.92333 3.39042 6.895 2.97375C7.86667 2.55709 8.90486 2.34875 10.0096 2.34875C11.1143 2.34875 12.1493 2.55709 13.1146 2.97375C14.0799 3.39042 14.9271 3.96334 15.6562 4.6925C16.3854 5.42167 16.9583 6.27042 17.375 7.23875C17.7917 8.20723 18 9.24195 18 10.3429C18 11.444 17.7917 12.4807 17.375 13.4529C16.9583 14.4251 16.3854 15.2758 15.6562 16.005C14.9271 16.7342 14.0783 17.3071 13.11 17.7238C12.1415 18.1404 11.1068 18.3488 10.0058 18.3488ZM10 16.8488C11.8056 16.8488 13.3403 16.2168 14.6042 14.9529C15.8681 13.689 16.5 12.1543 16.5 10.3488C16.5 8.5432 15.8681 7.00848 14.6042 5.74459C13.3403 4.4807 11.8056 3.84875 10 3.84875C8.19444 3.84875 6.65972 4.4807 5.39583 5.74459C4.13194 7.00848 3.5 8.5432 3.5 10.3488C3.5 12.1543 4.13194 13.689 5.39583 14.9529C6.65972 16.2168 8.19444 16.8488 10 16.8488Z" fill="#1C1B1F"/>
            </g>
          </svg>
          
          <!-- RadioOk SVG -->
          <svg 
            v-else-if="isSelected && isAnswered && isCorrect"
            width="20" 
            height="21" 
            viewBox="0 0 20 21" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="mask0_96_412" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
              <rect y="0.348755" width="20" height="20" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_96_412)">
              <path d="M10.0058 18.3488C8.90472 18.3488 7.86806 18.1404 6.89583 17.7238C5.92361 17.3071 5.07292 16.7342 4.34375 16.005C3.61458 15.2758 3.04167 14.4254 2.625 13.4538C2.20833 12.4821 2 11.4439 2 10.3392C2 9.23445 2.20833 8.19945 2.625 7.23417C3.04167 6.26889 3.61458 5.42167 4.34375 4.6925C5.07292 3.96334 5.92333 3.39042 6.895 2.97375C7.86667 2.55709 8.90486 2.34875 10.0096 2.34875C11.1143 2.34875 12.1493 2.55709 13.1146 2.97375C14.0799 3.39042 14.9271 3.96334 15.6562 4.6925C16.3854 5.42167 16.9583 6.27042 17.375 7.23875C17.7917 8.20723 18 9.24195 18 10.3429C18 11.444 17.7917 12.4807 17.375 13.4529C16.9583 14.4251 16.3854 15.2758 15.6562 16.005C14.9271 16.7342 14.0783 17.3071 13.11 17.7238C12.1415 18.1404 11.1068 18.3488 10.0058 18.3488ZM10 16.8488C11.8056 16.8488 13.3403 16.2168 14.6042 14.9529C15.8681 13.689 16.5 12.1543 16.5 10.3488C16.5 8.5432 15.8681 7.00848 14.6042 5.74459C13.3403 4.4807 11.8056 3.84875 10 3.84875C8.19444 3.84875 6.65972 4.4807 5.39583 5.74459C4.13194 7.00848 3.5 8.5432 3.5 10.3488C3.5 12.1543 4.13194 13.689 5.39583 14.9529C6.65972 16.2168 8.19444 16.8488 10 16.8488Z" fill="#1C1B1F"/>
              <circle cx="10.0001" cy="10.3488" r="3.34875" fill="#44B08E"/>
            </g>
          </svg>
          
          <!-- RadioKo SVG -->
          <svg 
            v-else-if="isSelected && isAnswered && !isCorrect"
            width="20" 
            height="21" 
            viewBox="0 0 20 21" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="mask0_101_616" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
              <rect y="0.953735" width="20" height="20" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_101_616)">
              <path d="M10.0058 18.9537C8.90472 18.9537 7.86806 18.7454 6.89583 18.3287C5.92361 17.9121 5.07292 17.3392 4.34375 16.61C3.61458 15.8808 3.04167 15.0304 2.625 14.0587C2.20833 13.0871 2 12.0489 2 10.9442C2 9.83943 2.20833 8.80443 2.625 7.83915C3.04167 6.87387 3.61458 6.02665 4.34375 5.29749C5.07292 4.56832 5.92333 3.9954 6.895 3.57874C7.86667 3.16207 8.90486 2.95374 10.0096 2.95374C11.1143 2.95374 12.1493 3.16207 13.1146 3.57874C14.0799 3.9954 14.9271 4.56832 15.6562 5.29749C16.3854 6.02665 16.9583 6.8754 17.375 7.84373C17.7917 8.81221 18 9.84693 18 10.9479C18 12.049 17.7917 13.0857 17.375 14.0579C16.9583 15.0301 16.3854 15.8808 15.6562 16.61C14.9271 17.3392 14.0783 17.9121 13.11 18.3287C12.1415 18.7454 11.1068 18.9537 10.0058 18.9537ZM10 17.4537C11.8056 17.4537 13.3403 16.8218 14.6042 15.5579C15.8681 14.294 16.5 12.7593 16.5 10.9537C16.5 9.14818 15.8681 7.61346 14.6042 6.34957C13.3403 5.08568 11.8056 4.45374 10 4.45374C8.19444 4.45374 6.65972 5.08568 5.39583 6.34957C4.13194 7.61346 3.5 9.14818 3.5 10.9537C3.5 12.7593 4.13194 14.294 5.39583 15.5579C6.65972 16.8218 8.19444 17.4537 10 17.4537Z" fill="#1C1B1F"/>
              <circle cx="10.0001" cy="10.9537" r="3.34875" fill="#E3744A"/>
            </g>
          </svg>
          
          <!-- RadioEmpty SVG for selected but not answered -->
          <svg 
            v-else
            width="20" 
            height="21" 
            viewBox="0 0 20 21" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="mask0_101_616" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="21">
              <rect y="0.953735" width="20" height="20" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_101_616)">
              <path d="M10.0058 18.9537C8.90472 18.9537 7.86806 18.7454 6.89583 18.3287C5.92361 17.9121 5.07292 17.3392 4.34375 16.61C3.61458 15.8808 3.04167 15.0304 2.625 14.0587C2.20833 13.0871 2 12.0489 2 10.9442C2 9.83943 2.20833 8.80443 2.625 7.83915C3.04167 6.87387 3.61458 6.02665 4.34375 5.29749C5.07292 4.56832 5.92333 3.9954 6.895 3.57874C7.86667 3.16207 8.90486 2.95374 10.0096 2.95374C11.1143 2.95374 12.1493 3.16207 13.1146 3.57874C14.0799 3.9954 14.9271 4.56832 15.6562 5.29749C16.3854 6.02665 16.9583 6.8754 17.375 7.84373C17.7917 8.81221 18 9.84693 18 10.9479C18 12.049 17.7917 13.0857 17.375 14.0579C16.9583 15.0301 16.3854 15.8808 15.6562 16.61C14.9271 17.3392 14.0783 17.9121 13.11 18.3287C12.1415 18.7454 11.1068 18.9537 10.0058 18.9537ZM10 17.4537C11.8056 17.4537 13.3403 16.8218 14.6042 15.5579C15.8681 14.294 16.5 12.7593 16.5 10.9537C16.5 9.14818 15.8681 7.61346 14.6042 6.34957C13.3403 5.08568 11.8056 4.45374 10 4.45374C8.19444 4.45374 6.65972 5.08568 5.39583 6.34957C4.13194 7.61346 3.5 9.14818 3.5 10.9537C3.5 12.7593 4.13194 14.294 5.39583 15.5579C6.65972 16.8218 8.19444 17.4537 10 17.4537Z" fill="#1C1B1F"/>
              <circle cx="10.0001" cy="10.9537" r="3.34875" fill="#1C1B1F"/>
            </g>
          </svg>
        </div>
        <span class="radio-option__text">{{ text }}</span>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

interface Props {
  name: string
  value: number
  text: string
  isSelected: boolean
  isCorrect?: boolean
  isAnswered?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

const optionClass = computed(() => ({
  'radio-option--selected': props.isSelected,
  'radio-option--correct': props.isSelected && props.isCorrect && props.isAnswered,
  'radio-option--incorrect': props.isSelected && !props.isCorrect && props.isAnswered
}))
</script>

<style scoped>
.radio-option {
  /* margin-bottom: 0.75rem; */
  padding: 0.25rem 0;
  /* border-radius: 8px;
  transition: all 0.2s ease; */
  /* border: 2px solid transparent;
  background-color: #fafafa; */
}

/* .radio-option:hover {
  background-color: #f0f0f0;
}

.radio-option--selected {
  background-color: #e8f4fd;
  border-color: #44b08e;
} */

/* .radio-option--correct {
  background-color: #d4edda;
  border-color: #44b08e;
}

.radio-option--incorrect {
  background-color: #f8d7da;
  border-color: #e3744a;
} */

.radio-option__label {
  display: block;
  cursor: pointer;
  width: 100%;
}

.radio-option__input {
  display: none;
}

.radio-option__custom {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.radio-option__icon {
  flex-shrink: 0;
}

.radio-option__text {
  font-family: Inter;
  font-size: 16px;
  line-height: 1.4;
  color: #333;
  font-weight: 400;
}

.radio-option--selected .radio-option__text {
  font-weight: 500;
}
</style>
