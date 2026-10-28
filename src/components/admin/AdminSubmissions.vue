<script setup lang="ts">
import { siteConfig } from '@/stores/site'
import { Api } from '@/service/api'
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getApiBase } from '@/utils/config'

const props = defineProps<{ uid: string }>()
const { locale } = useI18n()
const base = getApiBase()

const loading = ref(true)
const error = ref(false)
const submissions = ref<any[]>([])
const filter = ref<'pending' | 'all'>('pending')

// Editable copy of feedback/grade per submission id
const drafts = reactive<Record<number, { feedback: string; grade: string }>>({})
const saving = reactive<Record<number, boolean>>({})
const saved = reactive<Record<number, boolean>>({})
const saveError = reactive<Record<number, boolean>>({})

const load = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await Api.learningSpaces.getAdminSubmissions(props.uid, locale.value)
    submissions.value = response.data?.submissions || []
    submissions.value.forEach((s) => {
      drafts[s.id] = { feedback: s.feedback || '', grade: s.grade || '' }
    })
  } catch (e) {
    console.error('Error loading submissions', e)
    error.value = true
  }
  loading.value = false
}
load()

const filtered = computed(() =>
  filter.value === 'pending' ? submissions.value.filter((s) => !s.reviewedAt) : submissions.value
)
const pendingCount = computed(() => submissions.value.filter((s) => !s.reviewedAt).length)

const fileUrl = (url: string) => (url && url.startsWith('http') ? url : base + url)

const formatDate = (date: string | null) => (date ? new Date(date).toLocaleString(locale.value) : '')

const formatSize = (size: number | null | undefined) => {
  // Strapi stores media size in KB
  if (!size && size !== 0) return ''
  return size >= 1024 ? `${(size / 1024).toFixed(1)} MB` : `${Math.round(size)} KB`
}

const save = async (submission: any) => {
  saving[submission.id] = true
  saved[submission.id] = false
  saveError[submission.id] = false
  try {
    const response = await Api.submissions.review(submission.id, {
      feedback: drafts[submission.id].feedback,
      grade: drafts[submission.id].grade
    })
    const updated = response.data?.submission
    if (updated) {
      submission.feedback = updated.feedback
      submission.grade = updated.grade
      submission.reviewedAt = updated.reviewedAt
    }
    saved[submission.id] = true
  } catch (e) {
    console.error('Error saving review', e)
    saveError[submission.id] = true
  }
  saving[submission.id] = false
}
</script>

<template>
  <div class="admin-submissions">
    <div v-if="loading" class="text-muted py-3">{{ $t('admin-loading') }}</div>
    <div v-else-if="error" class="alert alert-danger">{{ $t('admin-error-loading') }}</div>
    <template v-else>
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h4 class="mb-0">{{ $t('admin-submissions') }}</h4>
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-medium"
            :class="filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'"
            @click="filter = 'pending'"
          >
            {{ $t('admin-submissions-pending', { count: pendingCount }) }}
          </button>
          <button
            type="button"
            class="btn btn-medium"
            :class="filter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
            @click="filter = 'all'"
          >
            {{ $t('admin-submissions-all', { count: submissions.length }) }}
          </button>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="alert alert-info">
        {{ filter === 'pending' ? $t('admin-submissions-none-pending') : $t('admin-submissions-empty') }}
      </div>

      <div v-for="submission in filtered" :key="submission.id" class="submission card mb-3">
        <div class="card-body">
          <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
            <div>
              <strong>{{ submission.user?.name }} {{ submission.user?.lastname }}</strong>
              <span class="small text-muted ms-1 text-break">{{ submission.user?.email }}</span>
              <div class="small text-muted">
                {{ $t('admin-module') }}: {{ submission.moduleTitle || submission.moduleUid }}
              </div>
            </div>
            <div class="text-md-end small">
              <div class="text-muted">{{ formatDate(submission.createdAt) }}</div>
              <span v-if="submission.reviewedAt" class="badge bg-success">
                {{ $t('admin-submission-reviewed') }}
              </span>
              <span v-else class="badge bg-warning text-dark">
                {{ $t('admin-submission-pending-review') }}
              </span>
            </div>
          </div>

          <ul class="list-unstyled mb-3">
            <li v-for="file in submission.files || []" :key="file.id" class="text-break">
              <a :href="fileUrl(file.url)" target="_blank" rel="noopener" download>
                <i class="fas fa-download me-1"></i>{{ file.name }}
              </a>
              <span class="small text-muted ms-1">{{ formatSize(file.size) }}</span>
            </li>
          </ul>

          <div class="row g-2">
            <div class="col-12 col-md-9">
              <label class="form-label small fw-bold" :for="`feedback-${submission.id}`">
                {{ $t('admin-submission-feedback') }}
              </label>
              <textarea
                :id="`feedback-${submission.id}`"
                v-model="drafts[submission.id].feedback"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12 col-md-3">
              <label class="form-label small fw-bold" :for="`grade-${submission.id}`">
                {{ $t('admin-submission-grade') }}
              </label>
              <input
                :id="`grade-${submission.id}`"
                v-model="drafts[submission.id].grade"
                type="text"
                class="form-control"
                :placeholder="$t('admin-submission-grade-placeholder')"
              />
            </div>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-3 mt-3">
            <button
              type="button"
              class="btn btn-primary btn-medium"
              :disabled="saving[submission.id]"
              @click="save(submission)"
            >
              {{ saving[submission.id] ? $t('admin-saving') : $t('admin-save-review') }}
            </button>
            <span v-if="saved[submission.id]" class="small text-success">
              {{ $t('admin-submission-saved') }}
            </span>
            <span v-if="saveError[submission.id]" class="small text-danger">
              {{ $t('admin-error-saving') }}
            </span>
            <span v-if="submission.reviewedAt" class="small text-muted">
              {{
                $t('admin-submission-reviewed-by', {
                  name: submission.reviewedBy
                    ? `${submission.reviewedBy.name || ''} ${submission.reviewedBy.lastname || ''}`.trim()
                    : '—',
                  date: formatDate(submission.reviewedAt)
                })
              }}
            </span>
          </div>
          <div v-if="siteConfig.notificationsEnabled" class="small text-muted mt-2">{{ $t('admin-submission-email-note') }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}
.btn {
  width: auto;
}
</style>
