<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, computed } from 'vue'
import CustomToast from '@/components/CustomToast.vue'

import { useAuthStore } from '@/stores/auth'

import { useI18n } from 'vue-i18n'
import LearningSpaceHeader from '@/components/LearningSpaceHeader.vue'
import LearningSpaceBanner from '@/components/LearningSpaceBanner.vue'

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

const base = import.meta.env.VITE_API_BASE

const toastVisible = ref(false)

const authenticated = computed(() => {
  return authStore.isAuthenticated()
})
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <LearningSpaceBanner :space="space" :base="base" :authenticated="!!authenticated" />

    <LearningSpaceHeader
      :space="space"
      :uid="uid"
      :authenticated="!!authenticated"
      selected="progress"
    />

    <div class="enrolled">
      <div class="container bg-white mt-5">
        <div class="row">
          <div class="col-12 col-lg-8 col-offset-lg-2">
            <h2 class="mb-4">{{ $t('progress') }}</h2>

            <div v-if="space.content_modules?.length > 0">
              <template
                v-for="module in space.content_modules"
                :key="`bookmark-module-${module.id}`"
              >
                <div class="module-bookmarks mb-4">
                  <h3 class="module-title">{{ module.title }}</h3>

                  <template v-for="unit in module.units" :key="`bookmark-unit-${unit.id}`">
                    <div class="unit-bookmarks ms-3 mb-3">
                      <div class="bookmark-item d-flex align-items-center mb-2">
                        <RouterLink
                          :to="`/space/${uid}/module/${module.id}/unit/${unit.id}`"
                          class="bookmark-link"
                        >
                          {{ unit.title }}
                        </RouterLink>
                        <span class="completed-pct-space ms-2">
                            <svg
                              v-if="unit.completed"
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_71_4297"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="18"
                                height="19"
                              >
                                <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_71_4297)">
                                <path
                                  d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488Z"
                                  fill="#44B08E"
                                />
                              </g>
                            </svg>
                            <svg
                              v-else
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_71_4302"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="18"
                                height="19"
                              >
                                <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_71_4302)">
                                <path
                                  d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488ZM9 15.8488C10.675 15.8488 12.0938 15.2675 13.2563 14.105C14.4187 12.9425 15 11.5238 15 9.84875C15 8.17375 14.4187 6.75501 13.2563 5.5925C12.0938 4.43001 10.675 3.84875 9 3.84875C7.325 3.84875 5.90625 4.43001 4.74375 5.5925C3.58125 6.75501 3 8.17375 3 9.84875C3 11.5238 3.58125 12.9425 4.74375 14.105C5.90625 15.2675 7.325 15.8488 9 15.8488Z"
                                  fill="#44B08E"
                                />
                              </g>
                            </svg>
                          </span>
                      </div>

                      <template
                        v-for="lesson in unit.lessons"
                        :key="`bookmark-lesson-${lesson.id}`"
                      >
                        <div class="bookmark-item d-flex align-items-center mb-2 ms-3">
                          <RouterLink
                            :to="`/space/${uid}/module/${module.id}/unit/${unit.id}/lesson/${lesson.id}`"
                            class="bookmark-link"
                          >
                            {{ lesson.title }}
                          </RouterLink>
                          <span class="completed-pct-space ms-2">
                            <svg
                              v-if="lesson.completed"
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_71_4297"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="18"
                                height="19"
                              >
                                <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_71_4297)">
                                <path
                                  d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488Z"
                                  fill="#44B08E"
                                />
                              </g>
                            </svg>
                            <svg
                              v-else
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_71_4302"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="18"
                                height="19"
                              >
                                <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_71_4302)">
                                <path
                                  d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488ZM9 15.8488C10.675 15.8488 12.0938 15.2675 13.2563 14.105C14.4187 12.9425 15 11.5238 15 9.84875C15 8.17375 14.4187 6.75501 13.2563 5.5925C12.0938 4.43001 10.675 3.84875 9 3.84875C7.325 3.84875 5.90625 4.43001 4.74375 5.5925C3.58125 6.75501 3 8.17375 3 9.84875C3 11.5238 3.58125 12.9425 4.74375 14.105C5.90625 15.2675 7.325 15.8488 9 15.8488Z"
                                  fill="#44B08E"
                                />
                              </g>
                            </svg>
                          </span>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
            </div>

            <div v-else class="text-center py-5">
              <p class="text-muted">{{ $t('No content available') }}</p>
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
.completed-pct-space {
  color: var(--Dark-grey, #797979);

  /* Sidebar - Sections L1 */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
}
</style>
