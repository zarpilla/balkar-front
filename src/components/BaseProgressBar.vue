<template>
  <div class="progress-bar-wrapper d-flex align-items-center">
    <div class="progress-bar">
      <div
        class="progress-bar-inner"
        :style="{ width: computedPercent + '%' }"
      ></div>
    </div>
    <div class="progress-bar-text" v-if="showText">
      {{ computedPercent.toFixed(0) }}% <slot>Completed</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  completed: { type: Number, required: true },
  total: { type: Number, required: true },
  showText: { type: Boolean, default: true }
})

const computedPercent = computed(() => {
  const total = props.completed + props.total
  if (total === 0) return 0
  return (props.completed / total) * 100
})
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
}
.progress-bar {
  width: 50%;
  height: 10px;
  background-color: var(--progress-bar-bg);
  border-radius: 5px;
  margin-top: 20px;
}
.progress-bar-inner {
  height: 100%;
  background-color: var(--progress-bar-fill);
  border-radius: 5px;
  transition: width 0.3s ease;
}
.progress-bar-text {
  color: var(--Dark-grey, #797979);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-top: 15px;
  margin-left: 15px;
}
</style>
