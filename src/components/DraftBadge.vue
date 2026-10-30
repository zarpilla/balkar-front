<template>
  <!-- Draft modules, units, lessons and quizzes are only sent to course managers. -->
  <span class="draft-badge" :class="{ 'draft-badge-block': block }" :title="$t('draft-badge-help')">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        fill="currentColor"
      />
      <path d="M3 3l18 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
    </svg>
    {{ $t('draft-badge') }}
    <span v-if="block" class="draft-badge-help">{{ $t('draft-badge-help') }}</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{ block?: boolean }>()
</script>

<style scoped>
.draft-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding: 1px 8px;
  border: 1px dashed #b58105;
  border-radius: 999px;
  background: #fff4d6;
  color: #6b4a00;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  vertical-align: middle;
  align-self: center;
  flex: none;
  height: auto;
}
.draft-badge-block {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 16px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: normal;
}
.draft-badge-help {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}
</style>
