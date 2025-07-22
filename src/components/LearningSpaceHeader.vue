<template>
  <div :class="{ 'bg-balkar': authenticated }" v-if="authenticated && space.enrolled">
    <div class="content-info mt-5" :class="{ container: authenticated }">
      <div class="row">
        <div class="col-12 col-lg-4">
          <div class="d-flex">
            <div class="progress-bar w-50">
              <div
                class="progress-bar-inner"
                :style="{
                  width:
                    (space.contentCompleted /
                      (space.contentCompleted + space.contentNotCompleted)) *
                      100 +
                    '%'
                }"
              ></div>
            </div>

            <div class="progress-bar-text">
              {{
                (
                  (space.contentCompleted /
                    (space.contentCompleted + space.contentNotCompleted)) *
                  100
                ).toFixed(0)
              }}% {{ $t('completed') }}
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-8 content-menu" v-if="space.forum">
          <div class="d-flex">
            <RouterLink :to="`/space/${uid}`" class="d-flex" :class="{ active: selected === 'space' }">
              {{ $t('content') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/progress`" class="d-flex" :class="{ active: selected === 'progress' }">
              {{ $t('progress') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/bookmarks`" class="d-flex" :class="{ active: selected === 'bookmarks' }">
              {{ $t('bookmarks') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/forum`" class="d-flex " :class="{ active: selected === 'community' }">
              {{ $t('community') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Space {
  enrolled: boolean
  forum?: any
  contentCompleted: number
  contentNotCompleted: number
}

interface Props {
  space: Space
  uid: string
  authenticated: boolean
  selected: 'space' | 'progress' | 'bookmarks' | 'community'
}

defineProps<Props>()
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(240, 192, 90, 0.5);
  border-radius: 5px;
  margin-top: 20px;
}

.progress-bar-inner {
  height: 100%;
  background-color: rgba(240, 192, 90, 1);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-bar-text {
  color: var(--Dark-grey, #797979);

  /* Footnotes */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  margin-top: 15px;
  margin-left: 15px;
}

.content-info .row {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(81, 81, 81, 0.5);
}

.content-menu a {
    
  margin-top: 16px;
  color: var(--Dark-grey, #797979);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 16.5px */
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-right: 30px;
}

.content-menu a.active {
  
  color: var(--Dark-grey, #000);
}
</style>
