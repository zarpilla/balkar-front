<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed, onMounted } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'

import { useAuthStore } from '@/stores/auth'

import { useI18n } from 'vue-i18n'
import SpaceContent from '@/components/SpaceContent.vue'
import LearningSpaceHeader from '@/components/LearningSpaceHeader.vue'
import LearningSpaceBanner from '@/components/LearningSpaceBanner.vue'
import LearningSpaceEnrollment from '@/components/LearningSpaceEnrollment.vue'
import LearningSpaceModuleMenu from '@/components/LearningSpaceModuleMenu.vue'
import { getApiBase } from '@/utils/config'

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const emit = defineEmits<{
  (e: 'loaded', space: any): { space: any }
}>()

const locale = useI18n().locale
const router = useRouter()
import type { Ref } from 'vue'

const moduleId: Ref<string | null> = ref(
  (router.currentRoute.value.params.moduleId as string) || null
)
const unitId: Ref<string | null> = ref((router.currentRoute.value.params.unitId as string) || null)
const lessonId: Ref<string | null> = ref(
  (router.currentRoute.value.params.lessonId as string) || null
)

const apiBase = getApiBase()

const loaded = ref(false)
const space = ref<any>(null)
const load = async () => {
  const response = await Api.learningSpaces.get(props.uid, locale.value)
  if (response.data) {
    space.value = response.data

    if (!space.value.enrolled && authStore.isAuthenticated()) {
      canPay.value = true
    }

    if (space.value.enrolled) {
      selectContentAfterLoad()
    }
  }
  loaded.value = true
  emit('loaded', space.value)
}

load()

const base = getApiBase()

const toastVisible = ref(false)

// Quiz completion tracking
const quizCompletions = ref<Record<string, { 
  allCorrect: boolean; 
  score: number;
  minToPass?: number;
  correctAnswers?: number;
  totalQuestions?: number;
}>>({})

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
    console.log('moduleId changed:', router.currentRoute.value.params.moduleId)
    moduleId.value = router.currentRoute.value.params.moduleId as string
  }
)

watch(
  () => router.currentRoute.value.params.unitId,
  () => {
    console.log('unitId changed:', router.currentRoute.value.params.unitId)
    unitId.value = router.currentRoute.value.params.unitId as string
    selectContentAfterLoad()
  }
)

watch(
  () => router.currentRoute.value.params.lessonId,
  () => {
    console.log('lessonId changed:', router.currentRoute.value.params.lessonId)
    lessonId.value = router.currentRoute.value.params.lessonId as string
    selectContentAfterLoad()
  }
)

const selectContentAfterLoad = () => {
  if (!moduleId.value) {
    if (space.value.content_modules.length > 0) {
      moduleId.value = space.value.content_modules[0].uid.toString()
    } else {
      return
    }
  }
  const module = space.value.content_modules.find((m: any) => m.uid.toString() === moduleId.value)
  if (module && module.units.length > 0) {
    if (!unitId.value) {
      unitId.value = module.units[0].uid.toString()
    }
    const unit = module.units.find((u: any) => u.uid.toString() === unitId.value)
    if (unit && unit.lessons.length > 0) {
      // If lessonId is not set, select the first lesson
    } else {
      router.push(`/space/${props.uid}/module/${moduleId.value}/unit/${unitId.value}`)
    }
  }
  // window.scrollTo(0, 0)
}

const enroll = async () => {
  await Api.enrollments.enroll({ uid: props.uid })
  toastVisible.value = true
  space.value.enrolled = true
  window.location.reload()
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
    module: moduleId.value,
    unit: unitId.value,
    lesson: lessonId.value
  })
  await load()
}

const notcomplete = async () => {
  await Api.progresses.notcomplete({
    uid: props.uid,
    module: moduleId.value,
    unit: unitId.value,
    lesson: lessonId.value
  })
  await load()
}

const addBookmark = async () => {
  await Api.bookmarks.create({
    uid: props.uid,
    module: moduleId.value,
    unit: unitId.value,
    lesson: lessonId.value
  })
  await load()
}

const removeBookmark = async () => {
  await Api.bookmarks.delete({
    uid: props.uid,
    module: moduleId.value,
    unit: unitId.value,
    lesson: lessonId.value
  })
  await load()
}

const onQuizCompleted = (payload: { 
  quizId: number; 
  allCorrect: boolean; 
  score: number;
  minToPass?: number;
  correctAnswers: number;
  totalQuestions: number;
}) => {
  // Store quiz completion status using a unique key
  const quizKey = `${moduleId.value}-${unitId.value}-${lessonId.value}-${payload.quizId}`
  quizCompletions.value[quizKey] = {
    allCorrect: payload.allCorrect, // This now reflects whether the quiz passes the requirements
    score: payload.score,
    minToPass: payload.minToPass,
    correctAnswers: payload.correctAnswers,
    totalQuestions: payload.totalQuestions
  }
}

const canMarkAsCompleted = computed(() => {
  // Check if current content has any quizzes
  const currentContent = getCurrentContent()
  if (!currentContent) return true

  // Find all quizzes in the current content
  const quizzes = currentContent.filter((item: any) => item.__component === 'content.quiz')
  if (quizzes.length === 0) return true

  // Check if all quizzes are completed correctly
  return quizzes.every((quiz: any) => {
    const quizKey = `${moduleId.value}-${unitId.value}-${lessonId.value}-${quiz.quiz.id}`
    const completion = quizCompletions.value[quizKey]
    return completion && completion.allCorrect
  })
})

const quizCompletionMessage = computed(() => {
  const currentContent = getCurrentContent()
  if (!currentContent) return { key: '', params: {} }

  // Find all quizzes in the current content
  const quizzes = currentContent.filter((item: any) => item.__component === 'content.quiz')
  
  // Check if any quiz has minToPass configured (as percentage)
  const quizWithMinToPass = quizzes.find((quiz: any) => {
    const minToPass = quiz.quiz.minToPass
    return minToPass && minToPass > 0 && minToPass < 100
  })
  
  if (quizWithMinToPass) {
    const minToPassPercentage = quizWithMinToPass.quiz.minToPass
    const totalQuestions = quizWithMinToPass.quiz.questions?.length || 0
    const requiredCorrectAnswers = Math.ceil((minToPassPercentage / 100) * totalQuestions)
    
    return {
      key: 'please-complete-minimum-quizzes-correctly-before-marking-this-lesson-as-completed',
      params: { 
        percentage: minToPassPercentage,
        requiredAnswers: requiredCorrectAnswers,
        totalQuestions
      }
    }
  }
  
  // Default message for traditional all-correct requirement (100%)
  return {
    key: 'please-complete-all-quizzes-correctly-before-marking-this-lesson-as-completed',
    params: {}
  }
})

const getCurrentContent = () => {
  if (lessonId.value) {
    const module = space.value?.content_modules?.find(
      (m: any) => m.uid.toString() === moduleId.value
    )
    if (module) {
      const unit = module.units?.find((u: any) => u.uid.toString() === unitId.value)
      if (unit) {
        const lesson = unit.lessons?.find((l: any) => l.uid.toString() === lessonId.value)
        return lesson?.content || []
      }
    }
  } else if (unitId.value) {
    const module = space.value?.content_modules?.find(
      (m: any) => m.uid.toString() === moduleId.value
    )
    if (module) {
      const unit = module.units?.find((u: any) => u.uid.toString() === unitId.value)
      return unit?.content || []
    }
  }
  return []
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

const getAllNavigationItems = () => {
  const items: Array<{
    type: 'unit' | 'lesson'
    moduleId: string
    unitId: string
    lessonId?: string
    url: string
    title: string
  }> = []

  space.value.content_modules.forEach((module: any) => {
    module.units.forEach((unit: any, unitIndex: number) => {
      // Add unit
      items.push({
        type: 'unit',
        moduleId: module.uid.toString(),
        unitId: unit.uid.toString(),
        url: `/space/${props.uid}/module/${module.uid}/unit/${unit.uid}`,
        title: `${unitIndex + 1}. ${unit.title}`
      })

      unit.lessons.forEach((lesson: any) => {
        // Add lesson
        items.push({
          type: 'lesson',
          moduleId: module.uid.toString(),
          unitId: unit.uid.toString(),
          lessonId: lesson.uid.toString(),
          url: `/space/${props.uid}/module/${module.uid}/unit/${unit.uid}/lesson/${lesson.uid}`,
          title: lesson.title
        })
      })
    })
  })

  return items
}

const getCurrentNavigationIndex = () => {
  const items = getAllNavigationItems()

  return items.findIndex((item) => {
    if (lessonId.value) {
      return (
        item.type === 'lesson' &&
        item.moduleId === moduleId.value &&
        item.unitId === unitId.value &&
        item.lessonId === lessonId.value
      )
    } else if (unitId.value) {
      return (
        item.type === 'unit' && item.moduleId === moduleId.value && item.unitId === unitId.value
      )
    }
    return false
  })
}

const previousNavigationItem = computed(() => {
  const items = getAllNavigationItems()
  const currentIndex = getCurrentNavigationIndex()

  if (currentIndex > 0) {
    return items[currentIndex - 1]
  }
  return null
})

const nextNavigationItem = computed(() => {
  const items = getAllNavigationItems()
  const currentIndex = getCurrentNavigationIndex()

  if (currentIndex >= 0 && currentIndex < items.length - 1) {
    return items[currentIndex + 1]
  }
  return null
})

const selectedUnit = computed(() => {
  if (unitId.value) {
    const module = space.value.content_modules.find((m: any) => m.uid.toString() === moduleId.value)
    if (module) {
      return module.units.find((u: any) => u.uid.toString() === unitId.value)
    }
  }
  return null
})

const selectedLesson = computed(() => {
  if (lessonId.value) {
    const module = space.value.content_modules.find((m: any) => m.uid.toString() === moduleId.value)
    if (module) {
      const unit = module.units.find((u: any) => u.uid.toString() === unitId.value)
      if (unit) {
        return unit.lessons.find((l: any) => l.uid.toString() === lessonId.value)
      }
    }
  }
  return null
})
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <LearningSpaceBanner
      :space="space"
      :base="base"
      :authenticated="!!authenticated"
      @enroll="enroll"
      template="small"
      :space-needs-payment="spaceNeedsPayment"
    />

    <LearningSpaceHeader
      :space="space"
      :uid="uid"
      :authenticated="!!authenticated"
      selected="space"
    />

    <LearningSpaceEnrollment
      v-if="paymentHasResponse"
      :space="space"
      :authenticated="!!authenticated"
      :uid="uid"
      :payment-is-checking="paymentIsChecking"
      :payment-has-response="paymentHasResponse"
      :payment-is-successfully="paymentIsSuccessfully"
      :space-needs-payment="spaceNeedsPayment"
      :can-pay="canPay"
      :can-pay-email="canPayEmail"
      :can-pay-name="canPayName"
      :can-pay-lastname="canPayLastname"
      :checkout-session="checkoutSession"
      @enroll="enroll"
      @pay="pay"
      @email-valid="emailIsValid"
    />

    <div class="enrolled" v-if="space.enrolled === true && !paymentHasResponse" :class="{ 'module-selected': moduleId }">
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
          <div class="col-12 col-md-4 mb-5 pe-0 pe-md-5">
            <LearningSpaceModuleMenu
              :space="space"
              :uid="uid"
              :module-id="moduleId"
              :unit-id="unitId"
            />
          </div>
          <div class="col-12 col-md-8">
            <template v-if="moduleId">
              <template v-for="module in space.content_modules" :key="`module.uid-${module.uid}`">
                <div
                  v-if="module.uid.toString() === moduleId.toString()"
                  class="module module-bordered"
                >
                  <div class="module-header">
                    <div class="d-flex flex-wrap">
                      <h2>{{ module.shortTitle }}</h2>
                      <h2 v-if="lessonId" class="ms-2">
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_91_6626"
                            style="mask-type: alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="24"
                            height="25"
                          >
                            <rect
                              y="24.3488"
                              width="24"
                              height="24"
                              transform="rotate(-90 0 24.3488)"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_91_6626)">
                            <path
                              d="M15.4 12.3488L9.4 18.3488L8 16.9488L12.6 12.3488L8 7.74875L9.4 6.34875L15.4 12.3488Z"
                              fill="#44B08E"
                            />
                          </g>
                        </svg>
                        {{ selectedUnit.shortTitle }}
                      </h2>
                      <div
                        class="bookmark ms-auto clickable"
                        @click="addBookmark"
                        v-if="
                          (!selectedLesson && !selectedUnit.bookmarked) ||
                          (selectedLesson && !selectedLesson.bookmarked)
                        "
                      >
                        <svg
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_71_4374"
                            style="mask-type: alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="18"
                            height="19"
                          >
                            <rect y="0.848785" width="18" height="18" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_71_4374)">
                            <path
                              d="M3.75 16.5988V4.59879C3.75 4.18629 3.89688 3.83316 4.19063 3.53941C4.48438 3.24566 4.8375 3.09879 5.25 3.09879H12.75C13.1625 3.09879 13.5156 3.24566 13.8094 3.53941C14.1031 3.83316 14.25 4.18629 14.25 4.59879V16.5988L9 14.3488L3.75 16.5988ZM5.25 14.3113L9 12.6988L12.75 14.3113V4.59879H5.25V14.3113Z"
                              fill="#797979"
                            />
                          </g>
                        </svg>
                        {{ $t('bookmark-this-page') }}
                      </div>
                      <div
                        class="bookmark ms-auto clickable"
                        @click="removeBookmark"
                        v-if="
                          (!selectedLesson && selectedUnit.bookmarked) || selectedLesson?.bookmarked
                        "
                      >
                        <svg
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_71_4374_filled"
                            style="mask-type: alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="18"
                            height="19"
                          >
                            <rect y="0.848785" width="18" height="18" fill="#D9D9D9" />
                          </mask>
                          <g mask="url(#mask0_71_4374_filled)">
                            <path
                              d="M3.75 16.5988V4.59879C3.75 4.18629 3.89688 3.83316 4.19063 3.53941C4.48438 3.24566 4.8375 3.09879 5.25 3.09879H12.75C13.1625 3.09879 13.5156 3.24566 13.8094 3.53941C14.1031 3.83316 14.25 4.18629 14.25 4.59879V16.5988L9 14.3488L3.75 16.5988Z"
                              fill="#44B08E"
                            />
                          </g>
                        </svg>
                        {{ $t('unbookmark-this-page') }}
                      </div>
                    </div>
                  </div>
                  <template v-if="module.description">
                    <vue-markdown
                      class="mt-4 mb-4"
                      :options="{ html: true }"
                      :linkify="true"
                      :source="module.description"
                    ></vue-markdown>
                  </template>
                  <template v-if="unitId">
                    <template
                      v-for="(unit, ui) in module.units"
                      :key="`module.id-${module.uid}-unit-${unit.uid}`"
                    >
                      <div
                        v-if="unit.uid.toString() === unitId.toString() && !lessonId"
                        class="module-unit"
                      >
                        <h1 class="mt-4 mb-4">{{ ui + 1 }}. {{ unit.title }}</h1>

                        <div class="mb-4">
                          <SpaceContent
                            :content="unit.content"
                            title-as="h2"
                            :space-title="space.name"
                            :space-sub-title="unit.title"
                            :is-completed="unit.completed"
                            @quiz-completed="onQuizCompleted"
                          />
                        </div>
                        <div
                          v-for="lesson in unit.lessons"
                          :key="`unit.id-${unit.uid}-lesson-${lesson.uid}`"
                        >
                          <div class="d-block">
                            <RouterLink
                              :to="`/space/${uid}/module/${module.uid}/unit/${unit.uid}/lesson/${lesson.uid}`"
                              class="d-flex lesson lesson-list-item"
                            >
                              <span class="lesson-name me-auto">{{ lesson.title }}</span>
                              <svg
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_91_7134"
                                  style="mask-type: alpha"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="24"
                                  height="25"
                                >
                                  <rect
                                    x="0.498047"
                                    y="0.597595"
                                    width="23.5024"
                                    height="23.5024"
                                    fill="#D9D9D9"
                                  />
                                </mask>
                                <g mask="url(#mask0_91_7134)">
                                  <path
                                    d="M12.9107 12.3488L9.89944 15.36L11.2704 16.7555L15.6771 12.3488L11.2704 7.94211L9.89944 9.33756L12.9107 12.3488ZM12.2497 22.1414C10.895 22.1414 9.62198 21.8844 8.43055 21.3703C7.23911 20.8562 6.20272 20.1584 5.32138 19.2771C4.44004 18.3958 3.74232 17.3594 3.2282 16.1679C2.71409 14.9765 2.45703 13.7034 2.45703 12.3488C2.45703 10.9941 2.71409 9.72111 3.2282 8.52967C3.74232 7.33823 4.44004 6.30184 5.32138 5.4205C6.20272 4.53916 7.23911 3.84144 8.43055 3.32732C9.62198 2.81321 10.895 2.55615 12.2497 2.55615C13.6043 2.55615 14.8774 2.81321 16.0688 3.32732C17.2602 3.84144 18.2966 4.53916 19.178 5.4205C20.0593 6.30184 20.757 7.33823 21.2712 8.52967C21.7853 9.72111 22.0423 10.9941 22.0423 12.3488C22.0423 13.7034 21.7853 14.9765 21.2712 16.1679C20.757 17.3594 20.0593 18.3958 19.178 19.2771C18.2966 20.1584 17.2602 20.8562 16.0688 21.3703C14.8774 21.8844 13.6043 22.1414 12.2497 22.1414ZM12.2497 20.1829C14.4367 20.1829 16.2891 19.424 17.807 17.9061C19.3249 16.3883 20.0838 14.5358 20.0838 12.3488C20.0838 10.1618 19.3249 8.30933 17.807 6.79147C16.2891 5.27361 14.4367 4.51468 12.2497 4.51468C10.0627 4.51468 8.21021 5.27361 6.69235 6.79147C5.17449 8.30933 4.41556 10.1618 4.41556 12.3488C4.41556 14.5358 5.17449 16.3883 6.69235 17.9061C8.21021 19.424 10.0627 20.1829 12.2497 20.1829Z"
                                    fill="black"
                                  />
                                </g>
                              </svg>
                            </RouterLink>
                          </div>
                        </div>

                        <!-- <div
                          v-if="!unit.completed && unit.lessons.length === 0 && !canMarkAsCompleted"
                          class="alert alert-info mt-3"
                        >
                          <span class="fw-bold">{{ $t('quiz-required') }}</span>
                            {{ $t(quizCompletionMessage.key, quizCompletionMessage.params) }}
                        </div> -->


                          

                        <div class="the-buttons d-flex w-100 mt-5 mb-5 justify-content-between">
                          <RouterLink
                            v-if="previousNavigationItem"
                            :to="previousNavigationItem.url"
                            :title="previousNavigationItem.title"
                            class="btn btn-tertiary"
                          >
                            <svg
                            class="rotate-180"
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_91_6230"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="25"
                                height="25"
                              >
                                <rect
                                  x="0.749023"
                                  y="0.961426"
                                  width="23.5024"
                                  height="23.5024"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask="url(#mask0_91_6230)">
                                <path
                                  d="M13.1612 12.7126L10.1499 15.7238L11.5209 17.1193L15.9276 12.7126L11.5209 8.30588L10.1499 9.70133L13.1612 12.7126ZM12.5002 22.5052C11.1455 22.5052 9.87247 22.2482 8.68103 21.734C7.48959 21.2199 6.45321 20.5222 5.57187 19.6409C4.69053 18.7595 3.9928 17.7231 3.47869 16.5317C2.96458 15.3403 2.70752 14.0672 2.70752 12.7126C2.70752 11.3579 2.96458 10.0849 3.47869 8.89344C3.9928 7.702 4.69053 6.66561 5.57187 5.78427C6.45321 4.90293 7.48959 4.20521 8.68103 3.69109C9.87247 3.17698 11.1455 2.91992 12.5002 2.91992C13.8548 2.91992 15.1279 3.17698 16.3193 3.69109C17.5107 4.20521 18.5471 4.90293 19.4285 5.78427C20.3098 6.66561 21.0075 7.702 21.5216 8.89344C22.0358 10.0849 22.2928 11.3579 22.2928 12.7126C22.2928 14.0672 22.0358 15.3403 21.5216 16.5317C21.0075 17.7231 20.3098 18.7595 19.4285 19.6409C18.5471 20.5222 17.5107 21.2199 16.3193 21.734C15.1279 22.2482 13.8548 22.5052 12.5002 22.5052ZM12.5002 20.5467C14.6872 20.5467 16.5396 19.7878 18.0575 18.2699C19.5754 16.752 20.3343 14.8996 20.3343 12.7126C20.3343 10.5255 19.5754 8.6731 18.0575 7.15524C16.5396 5.63738 14.6872 4.87845 12.5002 4.87845C10.3131 4.87845 8.4607 5.63738 6.94284 7.15524C5.42498 8.6731 4.66605 10.5255 4.66605 12.7126C4.66605 14.8996 5.42498 16.752 6.94284 18.2699C8.4607 19.7878 10.3131 20.5467 12.5002 20.5467Z"
                                  fill="black"
                                />
                              </g>
                            </svg>
                            {{ $t('previous') }}
                          </RouterLink>

                          <button
                            class="btn btn-primary-outlined"
                            @click="complete()"
                            v-if="
                              !unit.completed && unit.lessons.length === 0 && canMarkAsCompleted
                            "
                          >
                            <svg
                              width="24"
                              height="25"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_91_6223"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="24"
                                height="25"
                              >
                                <rect y="0.712646" width="24" height="24" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_91_6223)">
                                <path
                                  d="M10.6 17.3126L17.65 10.2626L16.25 8.86265L10.6 14.5126L7.75 11.6626L6.35 13.0626L10.6 17.3126ZM12 22.7126C10.6167 22.7126 9.31667 22.4501 8.1 21.9251C6.88333 21.4001 5.825 20.6876 4.925 19.7876C4.025 18.8876 3.3125 17.8293 2.7875 16.6126C2.2625 15.396 2 14.096 2 12.7126C2 11.3293 2.2625 10.0293 2.7875 8.81265C3.3125 7.59598 4.025 6.53765 4.925 5.63765C5.825 4.73765 6.88333 4.02515 8.1 3.50015C9.31667 2.97515 10.6167 2.71265 12 2.71265C13.3833 2.71265 14.6833 2.97515 15.9 3.50015C17.1167 4.02515 18.175 4.73765 19.075 5.63765C19.975 6.53765 20.6875 7.59598 21.2125 8.81265C21.7375 10.0293 22 11.3293 22 12.7126C22 14.096 21.7375 15.396 21.2125 16.6126C20.6875 17.8293 19.975 18.8876 19.075 19.7876C18.175 20.6876 17.1167 21.4001 15.9 21.9251C14.6833 22.4501 13.3833 22.7126 12 22.7126ZM12 20.7126C14.2333 20.7126 16.125 19.9376 17.675 18.3876C19.225 16.8376 20 14.946 20 12.7126C20 10.4793 19.225 8.58765 17.675 7.03765C16.125 5.48765 14.2333 4.71265 12 4.71265C9.76667 4.71265 7.875 5.48765 6.325 7.03765C4.775 8.58765 4 10.4793 4 12.7126C4 14.946 4.775 16.8376 6.325 18.3876C7.875 19.9376 9.76667 20.7126 12 20.7126Z"
                                  fill="black"
                                />
                              </g>
                            </svg>
                            {{ $t('mark-as-completed') }}
                          </button>
                          <button
                            v-if="unit.completed && unit.lessons.length === 0"
                            class="btn btn-primary btn-primary-hover-green"
                            @click="notcomplete()"
                          >
                            <svg
                              width="24"
                              height="25"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_91_6223"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="24"
                                height="25"
                              >
                                <rect y="0.712646" width="24" height="24" fill="white" />
                              </mask>
                              <g mask="url(#mask0_91_6223)">
                                <path
                                  d="M10.6 17.3126L17.65 10.2626L16.25 8.86265L10.6 14.5126L7.75 11.6626L6.35 13.0626L10.6 17.3126ZM12 22.7126C10.6167 22.7126 9.31667 22.4501 8.1 21.9251C6.88333 21.4001 5.825 20.6876 4.925 19.7876C4.025 18.8876 3.3125 17.8293 2.7875 16.6126C2.2625 15.396 2 14.096 2 12.7126C2 11.3293 2.2625 10.0293 2.7875 8.81265C3.3125 7.59598 4.025 6.53765 4.925 5.63765C5.825 4.73765 6.88333 4.02515 8.1 3.50015C9.31667 2.97515 10.6167 2.71265 12 2.71265C13.3833 2.71265 14.6833 2.97515 15.9 3.50015C17.1167 4.02515 18.175 4.73765 19.075 5.63765C19.975 6.53765 20.6875 7.59598 21.2125 8.81265C21.7375 10.0293 22 11.3293 22 12.7126C22 14.096 21.7375 15.396 21.2125 16.6126C20.6875 17.8293 19.975 18.8876 19.075 19.7876C18.175 20.6876 17.1167 21.4001 15.9 21.9251C14.6833 22.4501 13.3833 22.7126 12 22.7126ZM12 20.7126C14.2333 20.7126 16.125 19.9376 17.675 18.3876C19.225 16.8376 20 14.946 20 12.7126C20 10.4793 19.225 8.58765 17.675 7.03765C16.125 5.48765 14.2333 4.71265 12 4.71265C9.76667 4.71265 7.875 5.48765 6.325 7.03765C4.775 8.58765 4 10.4793 4 12.7126C4 14.946 4.775 16.8376 6.325 18.3876C7.875 19.9376 9.76667 20.7126 12 20.7126Z"
                                  fill="white"                                  
                                />
                              </g>
                            </svg>
                            {{ $t('mark-as-not-completed') }}
                          </button>

                          <RouterLink
                            v-if="nextNavigationItem"
                            :to="nextNavigationItem.url"
                            class="btn btn-secondary"
                            :title="nextNavigationItem.title"
                          >
                            {{ $t('next') }}
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_91_6230"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="25"
                                height="25"
                              >
                                <rect
                                  x="0.749023"
                                  y="0.961426"
                                  width="23.5024"
                                  height="23.5024"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask="url(#mask0_91_6230)">
                                <path
                                  d="M13.1612 12.7126L10.1499 15.7238L11.5209 17.1193L15.9276 12.7126L11.5209 8.30588L10.1499 9.70133L13.1612 12.7126ZM12.5002 22.5052C11.1455 22.5052 9.87247 22.2482 8.68103 21.734C7.48959 21.2199 6.45321 20.5222 5.57187 19.6409C4.69053 18.7595 3.9928 17.7231 3.47869 16.5317C2.96458 15.3403 2.70752 14.0672 2.70752 12.7126C2.70752 11.3579 2.96458 10.0849 3.47869 8.89344C3.9928 7.702 4.69053 6.66561 5.57187 5.78427C6.45321 4.90293 7.48959 4.20521 8.68103 3.69109C9.87247 3.17698 11.1455 2.91992 12.5002 2.91992C13.8548 2.91992 15.1279 3.17698 16.3193 3.69109C17.5107 4.20521 18.5471 4.90293 19.4285 5.78427C20.3098 6.66561 21.0075 7.702 21.5216 8.89344C22.0358 10.0849 22.2928 11.3579 22.2928 12.7126C22.2928 14.0672 22.0358 15.3403 21.5216 16.5317C21.0075 17.7231 20.3098 18.7595 19.4285 19.6409C18.5471 20.5222 17.5107 21.2199 16.3193 21.734C15.1279 22.2482 13.8548 22.5052 12.5002 22.5052ZM12.5002 20.5467C14.6872 20.5467 16.5396 19.7878 18.0575 18.2699C19.5754 16.752 20.3343 14.8996 20.3343 12.7126C20.3343 10.5255 19.5754 8.6731 18.0575 7.15524C16.5396 5.63738 14.6872 4.87845 12.5002 4.87845C10.3131 4.87845 8.4607 5.63738 6.94284 7.15524C5.42498 8.6731 4.66605 10.5255 4.66605 12.7126C4.66605 14.8996 5.42498 16.752 6.94284 18.2699C8.4607 19.7878 10.3131 20.5467 12.5002 20.5467Z"
                                  fill="black"
                                />
                              </g>
                            </svg>
                          </RouterLink>
                        </div>
                      </div>
                      <div
                        v-if="unit.uid.toString() === unitId.toString() && lessonId"
                        class="module-unit"
                      >
                        <template
                          v-for="lesson in unit.lessons"
                          :key="`unit.id-${unit.uid}-lesson-${lesson.uid}`"
                        >
                          <div v-if="lesson.uid.toString() === lessonId.toString()">
                            <h1>{{ lesson.title }}</h1>

                            <SpaceContent
                              :content="lesson.content"
                              title-as="h2"
                              :is-completed="lesson.completed"
                              :space-title="space.name"
                              @quiz-completed="onQuizCompleted"
                            />
                          </div>

                          <!-- Quiz completion message for lessons -->
                          <div
                            v-if="!lesson.completed && !canMarkAsCompleted"
                            class="alert alert-info mt-3"
                          >
                            <span class="fw-bold">{{ $t('quiz-required') }}</span>
                            {{ $t(quizCompletionMessage.key, quizCompletionMessage.params) }}
                          </div>


                          <div
                            class="the-buttons d-flex justify-content-between mt-4 pt-4 zborder-top"
                            v-if="lesson.uid.toString() === lessonId.toString()"
                          >
                            <RouterLink
                              v-if="previousNavigationItem"
                              :to="previousNavigationItem.url"
                              :title="previousNavigationItem.title"
                              class="btn btn-tertiary"
                            >
                              <svg
                              class="rotate-180"
                              width="25"
                              height="25"
                              viewBox="0 0 25 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_91_6230"
                                style="mask-type: alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="25"
                                height="25"
                              >
                                <rect
                                  x="0.749023"
                                  y="0.961426"
                                  width="23.5024"
                                  height="23.5024"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask="url(#mask0_91_6230)">
                                <path
                                  d="M13.1612 12.7126L10.1499 15.7238L11.5209 17.1193L15.9276 12.7126L11.5209 8.30588L10.1499 9.70133L13.1612 12.7126ZM12.5002 22.5052C11.1455 22.5052 9.87247 22.2482 8.68103 21.734C7.48959 21.2199 6.45321 20.5222 5.57187 19.6409C4.69053 18.7595 3.9928 17.7231 3.47869 16.5317C2.96458 15.3403 2.70752 14.0672 2.70752 12.7126C2.70752 11.3579 2.96458 10.0849 3.47869 8.89344C3.9928 7.702 4.69053 6.66561 5.57187 5.78427C6.45321 4.90293 7.48959 4.20521 8.68103 3.69109C9.87247 3.17698 11.1455 2.91992 12.5002 2.91992C13.8548 2.91992 15.1279 3.17698 16.3193 3.69109C17.5107 4.20521 18.5471 4.90293 19.4285 5.78427C20.3098 6.66561 21.0075 7.702 21.5216 8.89344C22.0358 10.0849 22.2928 11.3579 22.2928 12.7126C22.2928 14.0672 22.0358 15.3403 21.5216 16.5317C21.0075 17.7231 20.3098 18.7595 19.4285 19.6409C18.5471 20.5222 17.5107 21.2199 16.3193 21.734C15.1279 22.2482 13.8548 22.5052 12.5002 22.5052ZM12.5002 20.5467C14.6872 20.5467 16.5396 19.7878 18.0575 18.2699C19.5754 16.752 20.3343 14.8996 20.3343 12.7126C20.3343 10.5255 19.5754 8.6731 18.0575 7.15524C16.5396 5.63738 14.6872 4.87845 12.5002 4.87845C10.3131 4.87845 8.4607 5.63738 6.94284 7.15524C5.42498 8.6731 4.66605 10.5255 4.66605 12.7126C4.66605 14.8996 5.42498 16.752 6.94284 18.2699C8.4607 19.7878 10.3131 20.5467 12.5002 20.5467Z"
                                  fill="black"
                                />
                              </g>
                            </svg>
                              {{ $t('previous') }}
                            </RouterLink>

                            <button
                              v-if="!lesson.completed && canMarkAsCompleted"
                              class="btn btn-primary-outlined"
                              @click="complete()"
                            >
                              <svg
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_91_6223"
                                  style="mask-type: alpha"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="24"
                                  height="25"
                                >
                                  <rect y="0.712646" width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_91_6223)">
                                  <path
                                    d="M10.6 17.3126L17.65 10.2626L16.25 8.86265L10.6 14.5126L7.75 11.6626L6.35 13.0626L10.6 17.3126ZM12 22.7126C10.6167 22.7126 9.31667 22.4501 8.1 21.9251C6.88333 21.4001 5.825 20.6876 4.925 19.7876C4.025 18.8876 3.3125 17.8293 2.7875 16.6126C2.2625 15.396 2 14.096 2 12.7126C2 11.3293 2.2625 10.0293 2.7875 8.81265C3.3125 7.59598 4.025 6.53765 4.925 5.63765C5.825 4.73765 6.88333 4.02515 8.1 3.50015C9.31667 2.97515 10.6167 2.71265 12 2.71265C13.3833 2.71265 14.6833 2.97515 15.9 3.50015C17.1167 4.02515 18.175 4.73765 19.075 5.63765C19.975 6.53765 20.6875 7.59598 21.2125 8.81265C21.7375 10.0293 22 11.3293 22 12.7126C22 14.096 21.7375 15.396 21.2125 16.6126C20.6875 17.8293 19.975 18.8876 19.075 19.7876C18.175 20.6876 17.1167 21.4001 15.9 21.9251C14.6833 22.4501 13.3833 22.7126 12 22.7126ZM12 20.7126C14.2333 20.7126 16.125 19.9376 17.675 18.3876C19.225 16.8376 20 14.946 20 12.7126C20 10.4793 19.225 8.58765 17.675 7.03765C16.125 5.48765 14.2333 4.71265 12 4.71265C9.76667 4.71265 7.875 5.48765 6.325 7.03765C4.775 8.58765 4 10.4793 4 12.7126C4 14.946 4.775 16.8376 6.325 18.3876C7.875 19.9376 9.76667 20.7126 12 20.7126Z"
                                    fill="black"
                                  />
                                </g>
                              </svg>
                              {{ $t('mark-as-completed') }}
                            </button>
                            <button
                              v-if="lesson.completed"
                              class="btn btn-primary btn-primary-hover-green"
                              @click="notcomplete()"
                            >
                              <svg
                                width="24"
                                height="25"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_91_6223"
                                  style="mask-type: alpha"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="24"
                                  height="25"
                                >
                                  <rect y="0.712646" width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_91_6223)">
                                  <path
                                    d="M10.6 17.3126L17.65 10.2626L16.25 8.86265L10.6 14.5126L7.75 11.6626L6.35 13.0626L10.6 17.3126ZM12 22.7126C10.6167 22.7126 9.31667 22.4501 8.1 21.9251C6.88333 21.4001 5.825 20.6876 4.925 19.7876C4.025 18.8876 3.3125 17.8293 2.7875 16.6126C2.2625 15.396 2 14.096 2 12.7126C2 11.3293 2.2625 10.0293 2.7875 8.81265C3.3125 7.59598 4.025 6.53765 4.925 5.63765C5.825 4.73765 6.88333 4.02515 8.1 3.50015C9.31667 2.97515 10.6167 2.71265 12 2.71265C13.3833 2.71265 14.6833 2.97515 15.9 3.50015C17.1167 4.02515 18.175 4.73765 19.075 5.63765C19.975 6.53765 20.6875 7.59598 21.2125 8.81265C21.7375 10.0293 22 11.3293 22 12.7126C22 14.096 21.7375 15.396 21.2125 16.6126C20.6875 17.8293 19.975 18.8876 19.075 19.7876C18.175 20.6876 17.1167 21.4001 15.9 21.9251C14.6833 22.4501 13.3833 22.7126 12 22.7126ZM12 20.7126C14.2333 20.7126 16.125 19.9376 17.675 18.3876C19.225 16.8376 20 14.946 20 12.7126C20 10.4793 19.225 8.58765 17.675 7.03765C16.125 5.48765 14.2333 4.71265 12 4.71265C9.76667 4.71265 7.875 5.48765 6.325 7.03765C4.775 8.58765 4 10.4793 4 12.7126C4 14.946 4.775 16.8376 6.325 18.3876C7.875 19.9376 9.76667 20.7126 12 20.7126Z"
                                    fill="white"
                                  />
                                </g>
                              </svg>
                              {{ $t('mark-as-not-completed') }}
                            </button>

                            <RouterLink
                              v-if="nextNavigationItem"
                              :to="nextNavigationItem.url"
                              class="btn btn-secondary"
                              :title="nextNavigationItem.title"
                            >
                              {{ $t('next') }}
                              <svg
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_91_6230"
                                  style="mask-type: alpha"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="25"
                                  height="25"
                                >
                                  <rect
                                    x="0.749023"
                                    y="0.961426"
                                    width="23.5024"
                                    height="23.5024"
                                    fill="#D9D9D9"
                                  />
                                </mask>
                                <g mask="url(#mask0_91_6230)">
                                  <path
                                    d="M13.1612 12.7126L10.1499 15.7238L11.5209 17.1193L15.9276 12.7126L11.5209 8.30588L10.1499 9.70133L13.1612 12.7126ZM12.5002 22.5052C11.1455 22.5052 9.87247 22.2482 8.68103 21.734C7.48959 21.2199 6.45321 20.5222 5.57187 19.6409C4.69053 18.7595 3.9928 17.7231 3.47869 16.5317C2.96458 15.3403 2.70752 14.0672 2.70752 12.7126C2.70752 11.3579 2.96458 10.0849 3.47869 8.89344C3.9928 7.702 4.69053 6.66561 5.57187 5.78427C6.45321 4.90293 7.48959 4.20521 8.68103 3.69109C9.87247 3.17698 11.1455 2.91992 12.5002 2.91992C13.8548 2.91992 15.1279 3.17698 16.3193 3.69109C17.5107 4.20521 18.5471 4.90293 19.4285 5.78427C20.3098 6.66561 21.0075 7.702 21.5216 8.89344C22.0358 10.0849 22.2928 11.3579 22.2928 12.7126C22.2928 14.0672 22.0358 15.3403 21.5216 16.5317C21.0075 17.7231 20.3098 18.7595 19.4285 19.6409C18.5471 20.5222 17.5107 21.2199 16.3193 21.734C15.1279 22.2482 13.8548 22.5052 12.5002 22.5052ZM12.5002 20.5467C14.6872 20.5467 16.5396 19.7878 18.0575 18.2699C19.5754 16.752 20.3343 14.8996 20.3343 12.7126C20.3343 10.5255 19.5754 8.6731 18.0575 7.15524C16.5396 5.63738 14.6872 4.87845 12.5002 4.87845C10.3131 4.87845 8.4607 5.63738 6.94284 7.15524C5.42498 8.6731 4.66605 10.5255 4.66605 12.7126C4.66605 14.8996 5.42498 16.752 6.94284 18.2699C8.4607 19.7878 10.3131 20.5467 12.5002 20.5467Z"
                                    fill="black"
                                  />
                                </g>
                              </svg>
                            </RouterLink>
                          </div>
                        </template>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </template>

            <div
              v-for="module in pageModules"
              :key="`module.uid-${module.moduleId}`"
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
                  :key="`module.uid-${module.moduleId}-content-${content.id}`"
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
                  v-for="(unit, j) in module.units"
                  :key="`module.uid-${module.moduleId}-unit-${unit.uid}`"
                >
                  <div class="d-block mt-3 mb-3 ms-3 ms-md-5">
                    <RouterLink
                      :to="`/space/${uid}/module/${module.moduleId}/unit/${unit.uid}`"
                      class="d-flex unit"
                    >
                      <span class="pe-1">{{ j + 1 }}.</span>
                      <span class="unit-name">{{ unit.title }}</span>

                      <svg
                        v-if="unit.completed"
                        class="completed-check ms-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                      >
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                      </svg>
                    </RouterLink>

                    <div v-if="unitId === unit.uid">
                      <div
                        v-for="content in unit.contents"
                        :key="`module.uid-${module.moduleId}-unit-${unit.uid}-content-${content.id}`"
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
                        v-if="!unit.completed && module.moduleType !== 'Monitoring'"
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
                        v-if="unit.completed && module.moduleType !== 'Monitoring'"
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
                  v-if="module.units.length === 0 && module.moduleType !== 'Monitoring'"
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
              </div>
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

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-info {
  border-radius: 10px;
  background: var(--Blue-Grey, #cfe0fc);
  border: 0;

  color: var(--Black, #000);

  /* Text */
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 25.5px */
}

.fw-bold {
  font-weight: bold !important;
}

.the-buttons {
  @media screen and (max-width: 768px) {
    flex-direction: column;    
  }

  .btn {
    margin-bottom: 1rem;
  }
}
.rotate-180 {
  transform: rotate(180deg);
}

</style>
