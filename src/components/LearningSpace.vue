<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'
import FileUpload from '@/components/FileUploadSubmission.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const router = useRouter()
const moduleId = ref(router.currentRoute.value.params.moduleId as string)
const topicId = ref(router.currentRoute.value.params.topicId as string)
const apiBase = import.meta.env.VITE_API_BASE

const loaded = ref(false)
const space = ref<any>(null)
const load = async () => {
  const response = await Api.learningSpaces.get(props.uid)
  if (response.data) {
    space.value = response.data
  }
  loaded.value = true
}

load()

const base = import.meta.env.VITE_API_BASE

const toastVisible = ref(false)

watch(
  () => router.currentRoute.value.params.moduleId,
  () => {
    moduleId.value = router.currentRoute.value.params.moduleId as string
    const module = space.value.modules.find((m: any) => m.id.toString() === moduleId.value)
    if (module && module.topics.length === 1) {
      topicId.value = module.topics[0].id.toString()
      router.push(`/space/${props.uid}/module/${moduleId.value}/topic/${topicId.value}`)
    }
    // window.scrollTo(0, 0)
  }
)

watch(
  () => router.currentRoute.value.params.topicId,
  () => {
    topicId.value = router.currentRoute.value.params.topicId as string
    // window.scrollTo(0, 0)
  }
)

const enroll = async () => {
  await Api.enrollments.enroll({ uid: props.uid })
  toastVisible.value = true
  space.value.enrolled = true
}

const pageModules = computed(() => {
  return moduleId.value
    ? space.value.modules.filter((m: any) => m.id.toString() === moduleId.value)
    : space.value.modules
})

const complete = async () => {
  await Api.progresses.complete({
    uid: props.uid,
    moduleId: moduleId.value,
    topicId: topicId.value
  })
  await load()
}

const notcomplete = async () => {
  await Api.progresses.notcomplete({
    uid: props.uid,
    moduleId: moduleId.value,
    topicId: topicId.value
  })
  await load()
}

const uploaded = async () => {
  console.log('uploaded')
  await load()
}

const authenticated = computed(() => {
  return authStore.isAuthenticated()
})

const removeSubmission = async (id: string) => {
  console.log('removeSubmission')
  await Api.submissions.remove(id)
  await load()
}
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <div :class="{ 'bg-balkar': authenticated }">
      <div class="zcontainer" :class="{ container: authenticated }">
        <RouterLink class="btn btn-primary mb-3" :to="`/space/${space.uid}`">
          {{ space.name }}
        </RouterLink>

        <span v-if="authenticated && space.enrolled" class="ms-3 completed-pct completed-pct-space">
          {{ (space.completedPct * 100).toFixed(0) }}%
        </span>
      </div>
    </div>

    <div v-if="space.banner && space.banner.url" class="mt-5" :class="{ container: authenticated }">
      <img :src="base + space.banner.url" class="w-100" />
    </div>

    <div class="not-enrolled" v-if="authenticated && space.enrolled === false">
      <div class="container bg-white mt-5">
        <vue-markdown
          v-if="space.publicDescription"
          :options="{ html: true }"
          :linkify="true"
          class="mt-4 mb-4"
          :source="space.publicDescription"
        ></vue-markdown>

        <button class="btn btn-primary mt-4 mb-4" @click="enroll">
          {{ $t('apuntar-se') }}
        </button>
      </div>
    </div>

    <div class="not-enrolled" v-if="!authenticated">
      <div class="zcontainer zbg-balkar zmt-5">
        <vue-markdown
          v-if="space.publicDescription"
          :linkify="true"
          :options="{ html: true }"
          class="mt-4 mb-4"
          :source="space.publicDescription"
        ></vue-markdown>

        <!-- <RouterLink to="/login" class="btn btn-primary mt-4 mb-4">
          {{ $t('apuntar-se') }}
        </RouterLink> -->
      </div>
    </div>

    <div class="enrolled" v-if="space.enrolled === true" :class="{ 'module-selected': moduleId }">
      <div class="container bg-white mt-5" v-if="!moduleId">
        <vue-markdown
          v-if="space.privateDescription"
          class="mt-4 mb-4"
          :options="{ html: true }"
          :linkify="true"
          :source="space.privateDescription"
        ></vue-markdown>
      </div>
      <div class="container bg-white mt-5">
        <div class="row">
          <div class="col-12 order-1 order-md-0" :class="{ 'col-md-9': moduleId, z: !moduleId }">
            <div v-for="module in pageModules" :key="`module.id-${module.id}`" class="d-block mb-3">
              <RouterLink
                :to="`/space/${uid}/module/${module.id}`"
                class="d-flex module"
                :class="'module-type-' + module.moduleType.toLowerCase()"
              >
                {{ module.name }}
                <span class="ms-auto completed-pct">
                  {{ (module.completedPct * 100).toFixed(0) }}%
                </span>
              </RouterLink>

              <div v-if="moduleId === module.id.toString()">
                <div
                  v-for="content in module.contents"
                  :key="`module.id-${module.id}-content-${content.id}`"
                >
                  <div v-if="content.text" class="mt-4 mb-4">
                    <vue-markdown                    
                      class="mt-4 mb-4"
                      :options="{ html: true }"
                      :linkify="true"
                      :source="content.text"
                    ></vue-markdown>                    
                  </div>
                  <div v-if="content.media" class="mt-4 mb-4">
                    <div v-if="content.media.mime.startsWith('image')">
                      <img :src="base + content.media.url" class="zw-100" />
                    </div>
                  </div>
                </div>

                <div
                  v-for="(topic, j) in module.topics"
                  :key="`module.id-${module.id}-topic-${topic.id}`"
                >
                  <div class="d-block mt-3 mb-3 ms-3 ms-md-5">
                    <RouterLink
                      :to="`/space/${uid}/module/${module.id}/topic/${topic.id}`"
                      class="d-flex topic"
                    >
                      <span class="pe-1">{{ j + 1 }}.</span>
                      <span class="topic-name">{{ topic.name }}</span>

                      <svg
                        v-if="topic.completed"
                        class="completed-check ms-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                    </RouterLink>

                    <div v-if="topicId === topic.id.toString()">
                      <div
                        v-for="content in topic.contents"
                        :key="`module.id-${module.id}-topic-${topic.id}-content-${content.id}`"
                      >
                        <div v-if="content.text" class="mt-4 mb-4">
                          <vue-markdown
                            class="mt-4 mb-4"
                            :linkify="true"
                            :options="{ html: true }"
                            :source="content.text"
                          ></vue-markdown>
                        </div>
                        <div v-if="content.media" class="mt-4 mb-4">
                          <div v-if="content.media.mime.startsWith('image')">
                            <img :src="base + content.media.url" class="zw-100" />
                          </div>
                        </div>
                      </div>

                      <div class="d-flex w-100" v-if="!topic.completed">
                        <button
                          class="btn btn-tertiary btn-medium mb-2 ms-auto"
                          @click="complete()"
                        >
                          {{ $t('mark-as-completed') }}
                        </button>
                      </div>
                      <div class="d-flex w-100" v-if="topic.completed">
                        <button
                          class="btn btn-tertiary btn-medium mb-2 ms-auto"
                          @click="notcomplete()"
                        >
                          {{ $t('mark-as-not-completed') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="module.uploadFiles" class="module module-upload zmt-6">
                  <!-- <div class="upload-text">{{ $t('upload-your-files-here') }}</div> -->

                  <file-upload
                    :multiple="false"
                    :learningSpace="space.id"
                    :moduleId="moduleId"
                    users_permissions_user="1"
                    :field="'file'"
                    :accept="'*/*'"
                    @uploaded="uploaded"
                  >
                  </file-upload>
                </div>

                <div v-if="module.submissions">
                  <div v-for="sub in module.submissions" :key="sub.id" class="uploaded-file">
                    <div v-if="sub.file && sub.file.length" class="d-flex zuploaded-file px-2 py-4">
                      <a :href="apiBase + sub.file[0].url" target="_blank">
                        {{ sub.file[0].name }}
                      </a>
                      <svg
                        @click="removeSubmission(sub.id)"
                        class="remove-file ms-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                      >
                        <path
                          d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <!-- <pre>{{ module.submissions }}</pre> -->
                </div>
              </div>
            </div>

            <div
              v-if="!moduleId && space.forum && space.enrolled"
              class="forum module module-type-forum"
            >
              <RouterLink :to="`/forum/${uid}`" class="d-flex">
                {{ space.forum.name }}
              </RouterLink>
              <div class="description">
                {{ space.forum.description }}
              </div>

              <div class="d-flex w-100 mt-3">
                <RouterLink :to="`/forum/${uid}`" class="ms-auto btn btn-white">
                  {{ $t('FORUM ACCESS') }}
                </RouterLink>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-3 order-0 order-md-1 mb-5" v-if="moduleId">
            <div class="module module-bordered">
              <h4 class="text-uppercase quick-access-name">
                <RouterLink
                  :to="`/space/${uid}`"
                  class="btn btn-tertiary w-100 bg-white quick-access-button"
                >
                  {{ space.name }}
                  <!-- <img src="@/assets/images/fletxa-down.svg" alt="arrow-down" class="arrow-down" /> -->
                </RouterLink>
              </h4>
              <div
                v-for="module in space.modules"
                :key="`side.module.id-${module.id}`"
                class="d-block mb-1"
              >
                <RouterLink :to="`/space/${uid}/module/${module.id}`" class="d-block module-item">
                  {{ module.name }}
                </RouterLink>

                <div v-if="moduleId === module.id.toString()">
                  <div
                    v-for="(topic, j) in module.topics"
                    :key="`side.module.id-${module.id}-topic-${topic.id}`"
                  >
                    <div class="d-block mt-1 mb-1 ms-1">
                      <RouterLink
                        :to="`/space/${uid}/module/${module.id}/topic/${topic.id}`"
                        class="d-block topic side-topic"
                      >
                        <span class="topic-name pe-1">{{ j + 1 }}.</span>
                        <span class="topic-name">{{ topic.name }}</span>
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="space.forum" class="zmodule zmodule-bordered mt-3 zmodule-type-forum">
              <RouterLink :to="`/forum/${uid}`" class="ms-auto btn btn-secondary w-100">
                {{ $t('FORUM ACCESS') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <CustomToast
      :show="toastVisible"
      type="success"
      title="Enrolled"
      description="Enrolled to space successfully!"
      id="account-contact-ok-toast"
    ></CustomToast>
  </Teleport>
</template>

<style scoped>
.module {
  background: rgba(242, 90, 1, 0.8);
  background: #efdda2;
  padding: 0.8rem 1rem;
  color: var(--Nabiu, #020034);
  font-family: Athletics;
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px; /* 100% */
  cursor: pointer;
  text-decoration: none;
}
.module-bordered {
  border-radius: 25px;
}

.topic {
  padding: 0.5rem 1rem;
  background: var(--Canya, #efdda2);
  font-family: Athletics;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px; /* 100% */
  cursor: pointer;
  text-decoration: none;
}
.topic-name {
  text-decoration: underline;
}

.module-item {
  padding: 0.3rem 0.5rem;
  font-family: Athletics;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
  text-decoration: none;
}

.module-item.router-link-exact-active {
  text-decoration: underline;
}

.side-topic {
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  padding: 0.3rem 2rem;
  text-decoration: none;
  line-height: 24px;
}
.side-topic .topic-name {
  text-decoration: none;
  font-weight: 400;
  line-height: 24px;
}
.side-topic.router-link-exact-active {
  text-decoration: underline;
}
.quick-access {
  font-family: Athletics;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--Nabiu, #020034);
}
.quick-access-name {
  font-family: Athletics;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--Nabiu, #020034);
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

  color: var(--Nabiu, #020034);
  font-family: Athletics;
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
  border: 2px solid #020034;
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
  color: var(--Nabiu, #020034);
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 28px; /* 140% */
}
@media (min-width: 1024px) {
}
</style>
