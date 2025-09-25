<template>
  <div :class="{ 'bg-balkar': authenticated }" v-if="authenticated && space.enrolled">
    <div class="content-info mt-5" :class="{ container: authenticated }">
      <div class="row">
        <div class="col-12 col-lg-4">
          <BaseProgressBar
            :completed="space.contentCompleted"
            :total="space.contentNotCompleted"
          >{{ $t('completed') }}</BaseProgressBar>
        </div>
        <div class="col-12 col-lg-8 content-menu" v-if="space.forum">
          <div class="d-flex">
            <RouterLink :to="`/space/${uid}`" class="d-flex me-1 me-md-4" :class="{ active: selected === 'space' }">
              {{ $t('content') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/progress`" class="d-flex me-1 me-md-4" :class="{ active: selected === 'progress' }">
              {{ $t('progress') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/bookmarks`" class="d-flex me-1 me-md-4" :class="{ active: selected === 'bookmarks' }">
              {{ $t('bookmarks') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/forum`" class="d-flex me-1 me-md-4" :class="{ active: selected === 'community' }">
              {{ $t('community') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/certificate`" class="d-flex me-1 me-md-4" :class="{ active: selected === 'certificate' }">
              {{ $t('certificate') }}
            </RouterLink>
            <RouterLink :to="`/space/${uid}/admin`" class="d-flex me-1 me-md-4" :class="{ active: selected === 'admin' }" v-if="space.manager">
              {{ $t('admin') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BaseProgressBar from './BaseProgressBar.vue'

interface Space {
  enrolled: boolean
  forum?: any
  contentCompleted: number
  contentNotCompleted: number
  manager?: boolean
}

interface Props {
  space: Space
  uid: string
  authenticated: boolean
  selected: 'space' | 'progress' | 'bookmarks' | 'community' | 'certificate' | 'admin'
}

defineProps<Props>()
</script>


<style scoped>


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
  /* margin-right: 30px; */
}

.content-menu a.active {  
  color: var(--Dark-grey, #000);
}

.content-menu .d-flex {
  @media screen and (max-width: 768px) {
    flex-direction: column;
    
  }
}
</style>
