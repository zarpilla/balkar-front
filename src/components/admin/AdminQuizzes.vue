<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ uid: string }>()
const { locale } = useI18n()

const loading = ref(true)
const error = ref(false)
const quizzes = ref<any[]>([])
const rows = ref<any[]>([])
const selectedQuiz = ref<string>('')

const load = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await Api.learningSpaces.getAdminQuizAttempts(props.uid, locale.value)
    quizzes.value = response.data?.quizzes || []
    rows.value = response.data?.rows || []
  } catch (e) {
    console.error('Error loading quiz attempts', e)
    error.value = true
  }
  loading.value = false
}
load()

const quizTitle = (quizUid: string) => {
  const quiz = quizzes.value.find((q) => q.quizUid === quizUid)
  return quiz ? quiz.pageTitle || quiz.title : quizUid
}

const filteredRows = computed(() =>
  selectedQuiz.value ? rows.value.filter((r) => r.quizUid === selectedQuiz.value) : rows.value
)

const pct = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : `${Math.round(value)}%`

const formatDate = (date: string | null) => (date ? new Date(date).toLocaleString(locale.value) : '—')
</script>

<template>
  <div class="admin-quizzes">
    <div v-if="loading" class="text-muted py-3">{{ $t('admin-loading') }}</div>
    <div v-else-if="error" class="alert alert-danger">{{ $t('admin-error-loading') }}</div>
    <div v-else-if="quizzes.length === 0" class="alert alert-info">
      {{ $t('admin-quizzes-empty') }}
    </div>
    <template v-else>
      <h4 class="mb-3">{{ $t('admin-quizzes-summary') }}</h4>
      <div class="table-responsive mb-5">
        <table class="table">
          <thead class="table-dark">
            <tr>
              <th>{{ $t('admin-quiz') }}</th>
              <th>{{ $t('admin-quiz-min-to-pass') }}</th>
              <th>{{ $t('admin-quiz-learners') }}</th>
              <th>{{ $t('admin-quiz-passed') }}</th>
              <th>{{ $t('admin-quiz-avg-best-score') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.quizUid">
              <td>
                <strong>{{ quiz.pageTitle || quiz.title }}</strong>
                <div v-if="quiz.path" class="small text-muted">{{ quiz.path }}</div>
              </td>
              <td class="text-nowrap">{{ quiz.minToPass ? `${quiz.minToPass}%` : '100%' }}</td>
              <td>{{ quiz.learners }}</td>
              <td>{{ quiz.passed }}</td>
              <td>{{ pct(quiz.avgBestScore) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h4 class="mb-0">{{ $t('admin-quizzes-by-learner') }}</h4>
        <select v-model="selectedQuiz" class="form-select w-auto mw-100">
          <option value="">{{ $t('admin-quiz-all') }}</option>
          <option v-for="quiz in quizzes" :key="quiz.quizUid" :value="quiz.quizUid">
            {{ quiz.pageTitle || quiz.title }}
          </option>
        </select>
      </div>
      <div v-if="filteredRows.length === 0" class="alert alert-info">
        {{ $t('admin-quizzes-no-attempts') }}
      </div>
      <div v-else class="table-responsive">
        <table class="table">
          <thead class="table-dark">
            <tr>
              <th>{{ $t('admin-learner') }}</th>
              <th>{{ $t('admin-quiz') }}</th>
              <th>{{ $t('admin-quiz-attempts') }}</th>
              <th>{{ $t('admin-quiz-best-score') }}</th>
              <th>{{ $t('admin-quiz-last-score') }}</th>
              <th>{{ $t('admin-quiz-passed') }}</th>
              <th>{{ $t('admin-quiz-last-attempt') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="`${row.user?.id}-${row.quizUid}`">
              <td>
                <strong>{{ row.user?.name }} {{ row.user?.lastname }}</strong>
                <div class="small text-muted">{{ row.user?.email }}</div>
              </td>
              <td>{{ quizTitle(row.quizUid) }}</td>
              <td>{{ row.attempts }}</td>
              <td>{{ pct(row.bestScore) }}</td>
              <td>{{ pct(row.lastScore) }}</td>
              <td>
                <span v-if="row.passed" class="badge bg-success">{{ $t('admin-yes') }}</span>
                <span v-else class="badge bg-warning text-dark">{{ $t('admin-no') }}</span>
              </td>
              <td class="text-nowrap">{{ formatDate(row.lastAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.table th {
  font-weight: 600;
  white-space: nowrap;
}
</style>
