<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, computed } from 'vue'
import CustomToast from '@/components/CustomToast.vue'

import { useAuthStore } from '@/stores/auth'

import { useI18n } from 'vue-i18n'
import LearningSpaceHeader from '@/components/LearningSpaceHeader.vue'
import LearningSpaceBanner from '@/components/LearningSpaceBanner.vue'
import { getApiBase } from '@/utils/config'

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const emit = defineEmits<{
  (e: 'loaded', space: any): { space: any }
}>()

const locale = useI18n().locale

const loaded = ref(false)
const space = ref<any>(null)
const load = async () => {
  const response = await Api.learningSpaces.get(props.uid, locale.value)
  if (response.data) {
    space.value = response.data
  }
  loaded.value = true
  emit('loaded', space.value)
}

load()

const base = getApiBase()

const removeBookmark = async (moduleId: string, unitId: string, lessonId: string) => {
  await Api.bookmarks.delete({
    uid: props.uid,
    module: moduleId,
    unit: unitId,
    lesson: lessonId
  })
  await load()
}

const hasBookmarkedItems = (module: any) => {
  return module.units?.some(
    (unit: any) => unit.bookmarked || unit.lessons?.some((lesson: any) => lesson.bookmarked)
  )
}

const hasBookmarkedLessons = (unit: any) => {
  return unit.lessons?.some((lesson: any) => lesson.bookmarked)
}

const hasAnyBookmarks = () => {
  return space.value?.content_modules?.some((module: any) => hasBookmarkedItems(module))
}

const authenticated = computed(() => {
  return authStore.isAuthenticated()
})
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <LearningSpaceBanner :space="space" :base="base" :authenticated="!!authenticated" template="small" />

    <LearningSpaceHeader
      :space="space"
      :uid="uid"
      :authenticated="!!authenticated"
      selected="bookmarks"
    />

    <div class="enrolled">
      <div class="container bg-white mt-5">
        <div class="row">
          <div class="col-12 col-lg-8 col-offset-lg-2">
            <h2 class="mb-4">{{ $t('bookmarks') }}</h2>

            <div v-if="space.content_modules?.length > 0">
              <template
                v-for="module in space.content_modules"
                :key="`bookmark-module-${module.uid}`"
              >
                <div v-if="hasBookmarkedItems(module)" class="module-bookmarks mb-4">
                  <h3 class="module-title">{{ module.title }}</h3>

                  <template v-for="unit in module.units" :key="`bookmark-unit-${unit.uid}`">
                    <div
                      v-if="unit.bookmarked || hasBookmarkedLessons(unit)"
                      class="unit-bookmarks ms-3 mb-3"
                    >
                      <!-- Show unit if it's bookmarked -->
                      <div
                        v-if="unit.bookmarked"
                        class="bookmark-item d-flex align-items-center mb-2"
                      >
                        <svg
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="me-2"
                        >
                          <mask
                            id="mask0_bookmark_unit"
                            style="mask-type: alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="18"
                            height="19"
                          >
                            <rect y="0.848785" width="18" height="18" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_bookmark_unit)">
                            <path
                              d="M3.75 16.5988V4.59879C3.75 4.18629 3.89688 3.83316 4.19063 3.53941C4.48438 3.24566 4.8375 3.09879 5.25 3.09879H12.75C13.1625 3.09879 13.5156 3.24566 13.8094 3.53941C14.1031 3.83316 14.25 4.18629 14.25 4.59879V16.5988L9 14.3488L3.75 16.5988Z"
                              fill="#44B08E"
                            />
                          </g>
                        </svg>
                        <RouterLink
                          :to="`/space/${uid}/module/${module.uid}/unit/${unit.uid}`"
                          class="bookmark-link"
                        >
                          {{ unit.title }}
                        </RouterLink>
                        <button
                          @click="removeBookmark(module.id.toString(), unit.id.toString(), '')"
                          class="btn btn-medium btn-outline-secondary ms-auto"
                          :title="$t('remove-bookmark')"
                        >
                          {{ $t('remove-bookmark') }}
                        </button>
                      </div>

                      <!-- Show bookmarked lessons -->
                      <template
                        v-for="lesson in unit.lessons"
                        :key="`bookmark-lesson-${lesson.id}`"
                      >
                        <div
                          v-if="lesson.bookmarked"
                          class="bookmark-item d-flex align-items-center mb-2 ms-3"
                        >
                          <svg
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="me-2"
                          >
                            <mask
                              id="mask0_bookmark_lesson"
                              style="mask-type: alpha"
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="18"
                              height="19"
                            >
                              <rect y="0.848785" width="18" height="18" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_bookmark_lesson)">
                              <path
                                d="M3.75 16.5988V4.59879C3.75 4.18629 3.89688 3.83316 4.19063 3.53941C4.48438 3.24566 4.8375 3.09879 5.25 3.09879H12.75C13.1625 3.09879 13.5156 3.24566 13.8094 3.53941C14.1031 3.83316 14.25 4.18629 14.25 4.59879V16.5988L9 14.3488L3.75 16.5988Z"
                                fill="#44B08E"
                              />
                            </g>
                          </svg>
                          <RouterLink
                            :to="`/space/${uid}/module/${module.uid}/unit/${unit.uid}/lesson/${lesson.uid}`"
                            class="bookmark-link"
                          >
                            {{ lesson.title }}
                          </RouterLink>
                          <button
                            @click="
                              removeBookmark(
                                module.id.toString(),
                                unit.id.toString(),
                                lesson.id.toString()
                              )
                            "
                            class="btn btn-medium btn-outline-secondary ms-auto"
                            :title="$t('remove-bookmark')"
                          >
                            {{ $t('remove-bookmark') }}
                          </button>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </template>

              <div v-if="!hasAnyBookmarks()" class="text-left py-5">
                <p class="text-muted">{{ $t('no-bookmarks-found') }}</p>
                <p class="text-muted">
                  {{ $t('add-bookmarks-from-the-learning-content-to-see-them-here') }}
                </p>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <p class="text-muted">{{ $t('no-content-available') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-item-block {
  border-bottom: 1px solid #898989;
}

.quick-access {
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--Nabiu, #000000);
}
.quick-access-name {
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--Nabiu, #000000);
}
.arrow-down {
  vertical-align: -4px;
  margin-left: 0.5rem;
}
.enrolled img {
  max-width: 100%;
}
.module-type-monitoring {
  background: var(--Canya, #f5d634);
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.module-selected .module-type-monitoring {
  margin-top: 0rem;
}
.module-upload {
  margin-top: 5rem;
  background-color: #bbdff7;

  color: var(--Nabiu, #000000);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: normal;
  line-height: 28px; /* 140% */

  padding: 2rem 4rem;
}
.completed-check {
  margin-top: 8px;
}
.completed-pct {
  font-size: 14px;
  line-height: 20px;
  margin-top: 6px;
  border: 2px solid #000000;
  border-radius: 16px;
  line-height: 30px;
  height: 30px;
  padding: 0 1rem;
  display: inline-block;
  font-weight: 700;
}
.completed-pct-space {
  line-height: 28px;
  margin-top: 0px;
  vertical-align: 5px;
}
.quick-access-button {
  line-height: 20px;
}
.uploaded-file {
  border-bottom: 1px solid #eee;
}
.uploaded-file:last-child {
  border-bottom: none !important;
}
.remove-file {
  cursor: pointer;
}
.module-type-forum {
  background: var(--Canya, #a5dda3);
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.module-type-forum .description {
  font-size: 14px;
  line-height: 20px;
  margin-top: 6px;
  color: var(--Nabiu, #000000);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 28px; /* 140% */
}
.module-progress-icon {
  vertical-align: -7px;
}
@media (min-width: 1024px) {
  .module-menu {
    position: sticky;
    top: 0;
    height: calc(100vh - 180px);
    overflow-y: auto;
    padding-right: 15px;
  }
}

.module-header h2 {
  color: var(--Green, #44b08e);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 25px; /* 110% */
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-bottom: 0;
}
.mt-module-item {
  margin-top: 3px;
}
.lesson-list-item {
  border-bottom: 1px solid var(--Dark-grey, #797979);
  padding-top: 20px;
  padding-bottom: 20px;

  color: var(--Black, #000);

  /* Subtitle H4 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  letter-spacing: 0.2px;
}
.bookmark {
  color: var(--Dark-grey, #797979);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  margin-top: 20px;
}
.bookmark svg {
  margin-top: -2px;
}

.module-bookmarks {
  border-left: 3px solid #44b08e;
  padding-left: 1rem;
  margin-bottom: 2rem;
}

.module-title {
  color: var(--Green, #44b08e);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 16.5px */
  letter-spacing: 0.45px;
  text-transform: uppercase;
}

.bookmark-item {
  padding: 0.75rem;
  border: 0px solid #e9ecef;
  border-radius: 10px;
  background: var(--Blue-Grey, #cfe0fc);
  transition: background-color 0.2s ease;
}

.zbookmark-item:hover {
  background-color: #e9ecef;
}

.bookmark-link {
  color: #000;
  text-decoration: none;
  flex-grow: 1;

  color: var(--Black, #000);
  color: var(--Negre, #000);

  /* Subtitle H4 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  letter-spacing: 0.2px;
}

.bookmark-link:hover {
  text-decoration: underline;
}
</style>
