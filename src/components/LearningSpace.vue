<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed, onMounted } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'
import FileUpload from '@/components/FileUploadSubmission.vue'
import { useAuthStore } from '@/stores/auth'
import RegisterForm from '@/components/RegisterForm.vue'
import { ca } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const emit = defineEmits<{
  (e: 'loaded', space: any): { space: any }
}>()

const locale = useI18n().locale
const router = useRouter()
const moduleId = ref(router.currentRoute.value.params.moduleId as string)
const topicId = ref(router.currentRoute.value.params.topicId as string)
const apiBase = import.meta.env.VITE_API_BASE

const loaded = ref(false)
const space = ref<any>(null)
const load = async () => {
  const response = await Api.learningSpaces.get(props.uid, locale.value)
  if (response.data) {
    space.value = response.data

    if (!space.value.enrolled && authStore.isAuthenticated()) {
      canPay.value = true
    }
  }
  loaded.value = true
  emit('loaded', space.value)
}

load()

const base = import.meta.env.VITE_API_BASE

const toastVisible = ref(false)

const paymentIsSuccessfully = ref(false)
const paymentIsChecking = ref(false)
const paymentHasResponse = ref(false)
const checkoutSession = ref('')

onMounted(async () => {
  const queryParams = new URLSearchParams(window.location.search)
  if (queryParams.has('success')) {
    try {
      paymentIsChecking.value = true
      const paymentIntentId = queryParams.get('success')
      if (paymentIntentId && paymentIntentId !== 'false') {
        const response = await Api.payment.check(paymentIntentId).then((r) => r.data)
        console.log(response)
        paymentIsSuccessfully.value = response.ok
        paymentHasResponse.value = true
        paymentIsChecking.value = false
        canPayEmail.value = response.email
        canPayName.value = response.name
        canPayLastname.value = response.lastname
        if (paymentIsSuccessfully.value) {
          checkoutSession.value = paymentIntentId
        }
      } else {
        paymentIsSuccessfully.value = false
        paymentHasResponse.value = true
        paymentIsChecking.value = false
      }
    } catch (e) {
      console.log('3')
      paymentHasResponse.value = true
      paymentIsSuccessfully.value = false
      paymentIsChecking.value = false
      console.error(e)
    }
  }
})

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

const pay = async () => {
  if (authStore.isAuthenticated()) {
    canPayEmail.value = authStore.userEmail
  }
  const response = await Api.payment
    .createCheckoutSession(props.uid, {
      email: canPayEmail.value,
      name: canPayName.value,
      lastname: canPayLastname.value,
      locale: locale.value
    })
    .then((r) => r.data)
  location.href = response.url
}

const canPay = ref(false)
const canPayEmail = ref('')
const canPayName = ref('')
const canPayLastname = ref('')

const emailIsValid = (msg: any) => {
  canPay.value = msg.valid
  canPayEmail.value = msg.email
  canPayName.value = msg.name
  canPayLastname.value = msg.lastname
}

const pageModules = computed(() => {
  return moduleId.value
    ? space.value.modules.filter((m: any) => m.moduleId.toString() === moduleId.value)
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
  await Api.submissions.remove(id)
  await load()
}

const spaceNeedsPayment = computed(() => {
  return (
    space.value &&
    space.value.product !== null &&
    !space.value.enrolled &&
    !paymentIsSuccessfully.value
  )
})
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <div
      v-if="space.bannerIntro && space.bannerIntro.url && space.enrolled === false"
      class="mt-5"
      :class="{ container: authenticated }"
    >
      <div class="banner-full d-flex flex-column align-items-center">
        <div class="overlay"></div>
        <img :src="base + space.bannerIntro.url" class="w-100" />
        <h1 class="mt-3 mb-0">
          <div class="free">{{ space.free ? $t('free-course') : $t('paid-course') }}</div>
          {{ space.name }}
        </h1>
      </div>
    </div>

    <div
      v-if="space.banner && space.banner.url && space.enrolled === true"
      class="mt-5"
      :class="{ container: authenticated }"
    >
      <div class="banner-small d-flex flex-column align-items-center">
        <div class="overlay"></div>
        <img :src="base + space.banner.url" class="w-100" />
        <h1 class="mt-3 mb-0">
          {{ space.name }}
        </h1>
      </div>
    </div>

    <div :class="{ 'bg-balkar': authenticated }" v-if="authenticated && space.enrolled">
      <div class="content-info" :class="{ container: authenticated }">
        <div class="row">
          <div class="col-12 col-lg-4">
            <div class="d-flex">
              <div class="progress-bar w-50">
                <div
                  class="progress-bar-inner"
                  :style="{ width: space.completedPct * 100 + '%' }"
                ></div>
              </div>

              <div class="progress-bar-text">
                {{ (space.completedPct * 100).toFixed(0) }}% {{ $t('completed') }}
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-8 content-menu" v-if="space.forum">
            <div class="d-flex">
              <RouterLink :to="`/space/${uid}`" class="d-flex">
                {{ $t('content') }}
              </RouterLink>
              <RouterLink :to="`/forum/${uid}`" class="d-flex">
                {{ $t('community') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="not-enrolled" v-if="authenticated && space.enrolled === false">
      <div class="container bg-white mt-5">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <vue-markdown
              v-if="space.publicDescription"
              :options="{ html: true }"
              :linkify="true"
              class="mt-4 mb-4"
              :source="space.publicDescription"
            ></vue-markdown>

            <div
              v-if="!paymentIsChecking && paymentHasResponse && paymentIsSuccessfully"
              class="alert alert-success mt-4 mb-4"
            >
              {{ $t('payment-successful') }}
            </div>
            <div
              v-else-if="!paymentIsChecking && paymentHasResponse && !paymentIsSuccessfully"
              class="alert alert-danger mt-4 mb-4"
            >
              {{ $t('payment-error') }}
            </div>

            <button
              class="btn btn-primary mt-4 mb-4"
              @click="pay"
              v-if="spaceNeedsPayment"
              :disabled="!canPay"
            >
              {{ $t('pay') }}
              <svg
                width="37"
                height="16"
                viewBox="0 0 37 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.10156 7.20868C0.549278 7.20868 0.101563 7.65639 0.101562 8.20868C0.101562 8.76096 0.549278 9.20868 1.10156 9.20868L1.10156 7.20868ZM36.2985 8.91579C36.6891 8.52527 36.6891 7.8921 36.2985 7.50158L29.9346 1.13762C29.5441 0.747091 28.9109 0.747091 28.5204 1.13762C28.1298 1.52814 28.1298 2.1613 28.5204 2.55183L34.1772 8.20868L28.5204 13.8655C28.1298 14.2561 28.1298 14.8892 28.5204 15.2798C28.9109 15.6703 29.5441 15.6703 29.9346 15.2798L36.2985 8.91579ZM1.10156 9.20868L35.5914 9.20868L35.5914 7.20868L1.10156 7.20868L1.10156 9.20868Z"
                  fill="#fff"
                />
              </svg>
            </button>

            <div class="w-100 text-center" v-else>
              <button class="btn btn-secondary mt-4 mb-4" @click="enroll">
                {{ $t('apuntar-se') }}
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_64_2203"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="25"
                  >
                    <rect y="0.312622" width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_64_2203)">
                    <path
                      d="M12 21.3126C10.75 21.3126 9.57917 21.0751 8.4875 20.6001C7.39583 20.1251 6.44583 19.4835 5.6375 18.6751C4.82917 17.8668 4.1875 16.9168 3.7125 15.8251C3.2375 14.7335 3 13.5626 3 12.3126C3 11.0626 3.2375 9.89179 3.7125 8.80012C4.1875 7.70846 4.82917 6.75846 5.6375 5.95012C6.44583 5.14179 7.39583 4.50012 8.4875 4.02512C9.57917 3.55012 10.75 3.31262 12 3.31262V5.31262C10.05 5.31262 8.39583 5.99179 7.0375 7.35012C5.67917 8.70846 5 10.3626 5 12.3126C5 14.2626 5.67917 15.9168 7.0375 17.2751C8.39583 18.6335 10.05 19.3126 12 19.3126V21.3126ZM16 17.3126L14.6 15.8876L17.175 13.3126H9V11.3126H17.175L14.6 8.71262L16 7.31262L21 12.3126L16 17.3126Z"
                      fill="black"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
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

        <div
          v-if="!paymentIsChecking && paymentHasResponse && paymentIsSuccessfully"
          class="alert alert-success mt-4 mb-4"
        >
          {{ $t('payment-successful') }}
        </div>
        <div
          v-else-if="!paymentIsChecking && paymentHasResponse && !paymentIsSuccessfully"
          class="alert alert-danger mt-4 mb-4"
        >
          {{ $t('payment-error') }}
        </div>

        <div class="row mt-4 mb-3">
          <div class="col-lg-6 zoffset-lg-3">
            <RegisterForm
              button-text="apuntar-se"
              :enroll="uid"
              :disabled="spaceNeedsPayment"
              @email-valid="emailIsValid"
              :force-email="canPayEmail && paymentIsSuccessfully ? canPayEmail : ''"
              :force-name="canPayName && paymentIsSuccessfully ? canPayName : ''"
              :force-lastname="canPayLastname && paymentIsSuccessfully ? canPayLastname : ''"
              :checkout-session="checkoutSession"
            ></RegisterForm>
          </div>
        </div>

        <button
          class="btn btn-primary zmt-4 mb-4"
          @click="pay"
          v-if="spaceNeedsPayment"
          :disabled="!canPay"
        >
          {{ $t('pay') }}

          <svg
            width="37"
            height="16"
            viewBox="0 0 37 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.10156 7.20868C0.549278 7.20868 0.101563 7.65639 0.101562 8.20868C0.101562 8.76096 0.549278 9.20868 1.10156 9.20868L1.10156 7.20868ZM36.2985 8.91579C36.6891 8.52527 36.6891 7.8921 36.2985 7.50158L29.9346 1.13762C29.5441 0.747091 28.9109 0.747091 28.5204 1.13762C28.1298 1.52814 28.1298 2.1613 28.5204 2.55183L34.1772 8.20868L28.5204 13.8655C28.1298 14.2561 28.1298 14.8892 28.5204 15.2798C28.9109 15.6703 29.5441 15.6703 29.9346 15.2798L36.2985 8.91579ZM1.10156 9.20868L35.5914 9.20868L35.5914 7.20868L1.10156 7.20868L1.10156 9.20868Z"
              fill="#fff"
            />
          </svg>
        </button>

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
            <div
              v-for="module in pageModules"
              :key="`module.id-${module.moduleId}`"
              class="d-block mb-3"
            >
              <RouterLink
                :to="`/space/${uid}/module/${module.moduleId}`"
                class="d-flex module"
                :class="'module-type-' + module.moduleType.toLowerCase()"
              >
                {{ module.name }}
                <span
                  class="ms-auto completed-pct"
                  v-if="module.moduleType.toLowerCase() !== 'monitoring'"
                >
                  {{ (module.completedPct * 100).toFixed(0) }}%
                </span>
              </RouterLink>

              <div v-if="moduleId === module.moduleId">
                <div
                  v-for="content in module.contents"
                  :key="`module.id-${module.moduleId}-content-${content.id}`"
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
                  :key="`module.id-${module.moduleId}-topic-${topic.topicId}`"
                >
                  <div class="d-block mt-3 mb-3 ms-3 ms-md-5">
                    <RouterLink
                      :to="`/space/${uid}/module/${module.moduleId}/topic/${topic.topicId}`"
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

                    <div v-if="topicId === topic.topicId">
                      <div
                        v-for="content in topic.contents"
                        :key="`module.id-${module.moduleId}-topic-${topic.topicId}-content-${content.id}`"
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

                      <div
                        class="d-flex w-100"
                        v-if="!topic.completed && module.moduleType !== 'Monitoring'"
                      >
                        <button
                          class="btn btn-tertiary btn-medium mb-2 ms-auto"
                          @click="complete()"
                        >
                          {{ $t('mark-as-completed') }}
                        </button>
                      </div>
                      <div
                        class="d-flex w-100"
                        v-if="topic.completed && module.moduleType !== 'Monitoring'"
                      >
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

                <div
                  v-if="module.topics.length === 0 && module.moduleType !== 'Monitoring'"
                  class="mt-4 mb-4"
                >
                  <div class="d-flex w-100" v-if="!module.completed">
                    <button class="btn btn-tertiary btn-medium mb-2 ms-auto" @click="complete()">
                      {{ $t('mark-as-completed') }}
                    </button>
                  </div>
                  <div
                    class="d-flex w-100"
                    v-if="module.completed && module.moduleType !== 'Monitoring'"
                  >
                    <button class="btn btn-tertiary btn-medium mb-2 ms-auto" @click="notcomplete()">
                      {{ $t('mark-as-not-completed') }}
                    </button>
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
              <div class="d-flex w-100 zmt-3">
                <RouterLink :to="`/forum/${uid}`" class="d-flex">
                  {{ space.forum.name }}
                </RouterLink>
                <!-- <div class="description">
                {{ space.forum.description }}
              </div> -->

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
                :key="`side.module.id-${module.moduleId}`"
                class="d-block mb-1"
              >
                <RouterLink
                  :to="`/space/${uid}/module/${module.moduleId}`"
                  class="d-block module-item"
                >
                  <svg
                    class="module-progress-icon"
                    v-if="module.moduleType !== 'Monitoring' && module.completedPct == 1"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path fill="green" d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </svg>
                  {{ module.name }}
                </RouterLink>

                <div v-if="moduleId === module.moduleId.toString()">
                  <div
                    v-for="(topic, j) in module.topics"
                    :key="`side.module.id-${module.moduleId}-topic-${topic.topicId}`"
                  >
                    <div class="d-block mt-1 mb-1 ms-1">
                      <RouterLink
                        :to="`/space/${uid}/module/${module.moduleId}/topic/${topic.topicId}`"
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
  color: var(--Nabiu, #000000);
  font-family: Inter;
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
  font-family: Inter;
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
  font-family: Inter;
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
}
.banner-full {
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(68, 176, 142, 0.9) 42.31%, rgba(68, 176, 142, 0) 100%);
  overflow: hidden;
  position: relative;
  text-align: center;

  h1 {
    width: 40%;
    position: absolute;
    top: 120px;
    color: #fff;
    font-size: 36px;
    font-weight: bold;
    margin: auto;

    color: #fff;
    text-align: center;
    font-family: 'DM Sans';
    font-size: 50px;
    font-style: normal;
    font-weight: 900;
    line-height: 100%; /* 50px */
    letter-spacing: -0.5px;

    .free {
      color: var(--White, #fff);
      text-align: center;
      font-family: 'DM Sans';
      font-size: 16.971px;
      font-style: normal;
      font-weight: 800;
      line-height: 110%; /* 18.669px */
      letter-spacing: 1.697px;
      text-transform: uppercase;

      margin-bottom: 8px;
    }
  }
  img {
    border-radius: 20px;
    width: 100%;
    height: 650px;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1200px;
    background: linear-gradient(180deg, #44b08e 0%, rgba(68, 176, 142, 0) 100%);
    overflow: hidden;
    pointer-events: none;
  }
}

.banner-small {
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(68, 176, 142, 0.9) 42.31%, rgba(68, 176, 142, 0) 100%);
  overflow: hidden;
  position: relative;
  text-align: left;

  h1 {
    width: 40%;
    position: absolute;
    top: 34px;
    color: #fff;
    font-size: 36px;
    font-weight: bold;
    margin: 0;
    left: 0;
    padding-left: 45px;

    color: var(--White, #fff);

    /* Title H1 */
    font-family: Inter;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 36px */
    letter-spacing: 0.3px;
  }
  img {
    border-radius: 20px;
    width: 100%;
    height: 165px;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1200px;
    background: linear-gradient(90deg, #44b08e 0%, rgba(68, 176, 142, 0) 100%);
    overflow: hidden;
    pointer-events: none;
  }
}
.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(240, 192, 90, 0.5);
  border-radius: 5px;
  margin-top: 20px;

  .progress-bar-inner {
    height: 100%;
    background-color: rgba(240, 192, 90, 1);
    border-radius: 5px;
    transition: width 0.3s ease;
  }
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
.content-info .row{
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(81, 81, 81, 0.50);
}
.content-menu a {
  margin-top: 16px;
  color: var(--Dark-grey, #000);

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
</style>
