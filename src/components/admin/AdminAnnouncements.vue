<script setup lang="ts">
import { Api } from '@/service/api'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ uid: string }>()
const { t, locale } = useI18n()

const loading = ref(true)
const error = ref(false)
const announcements = ref<any[]>([])

const subject = ref('')
const text = ref('')
const confirming = ref(false)
const sending = ref(false)
const sendError = ref(false)
const sentOk = ref(false)
const cancelling = ref<Record<number, boolean>>({})

const load = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await Api.learningSpaces.getAdminAnnouncements(props.uid, locale.value)
    announcements.value = response.data?.announcements || []
  } catch (e) {
    console.error('Error loading announcements', e)
    error.value = true
  }
  loading.value = false
}
load()

const canSend = () => subject.value.trim() !== '' && text.value.trim() !== ''

const askConfirm = () => {
  sentOk.value = false
  sendError.value = false
  if (canSend()) confirming.value = true
}

const send = async () => {
  sending.value = true
  sendError.value = false
  try {
    await Api.learningSpaces.createAdminAnnouncement(props.uid, {
      subject: subject.value.trim(),
      text: text.value.trim()
    })
    subject.value = ''
    text.value = ''
    confirming.value = false
    sentOk.value = true
    await load()
  } catch (e) {
    console.error('Error sending announcement', e)
    sendError.value = true
  }
  sending.value = false
}

const cancel = async (announcement: any) => {
  if (!window.confirm(t('admin-announcement-cancel-confirm'))) return
  cancelling.value[announcement.id] = true
  try {
    await Api.learningSpaces.cancelAdminAnnouncement(props.uid, announcement.id)
    await load()
  } catch (e) {
    console.error('Error cancelling announcement', e)
    window.alert(t('admin-error-saving'))
  }
  cancelling.value[announcement.id] = false
}

const formatDate = (date: string | null) => (date ? new Date(date).toLocaleString(locale.value) : '')
</script>

<template>
  <div class="admin-announcements">
    <h4 class="mb-3">{{ $t('admin-announcement-new') }}</h4>
    <div class="card mb-5">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label fw-bold" for="announcement-subject">
            {{ $t('admin-announcement-subject') }}
          </label>
          <input
            id="announcement-subject"
            v-model="subject"
            type="text"
            class="form-control"
            maxlength="200"
            :disabled="confirming || sending"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" for="announcement-text">
            {{ $t('admin-announcement-text') }}
          </label>
          <textarea
            id="announcement-text"
            v-model="text"
            class="form-control"
            rows="6"
            :disabled="confirming || sending"
          ></textarea>
        </div>

        <div v-if="!confirming">
          <button
            type="button"
            class="btn btn-primary btn-medium"
            :disabled="!canSend()"
            @click="askConfirm"
          >
            {{ $t('admin-announcement-send') }}
          </button>
          <span v-if="sentOk" class="small text-success ms-3">
            {{ $t('admin-announcement-queued') }}
          </span>
        </div>
        <div v-else class="alert alert-warning mb-0">
          <p class="mb-3">{{ $t('admin-announcement-confirm-text') }}</p>
          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-primary btn-medium" :disabled="sending" @click="send">
              {{ sending ? $t('admin-sending') : $t('admin-announcement-confirm-send') }}
            </button>
            <button
              type="button"
              class="btn btn-tertiary btn-medium"
              :disabled="sending"
              @click="confirming = false"
            >
              {{ $t('admin-cancel') }}
            </button>
          </div>
        </div>
        <div v-if="sendError" class="small text-danger mt-2">{{ $t('admin-error-saving') }}</div>
      </div>
    </div>

    <h4 class="mb-3">{{ $t('admin-announcements-sent') }}</h4>
    <div v-if="loading" class="text-muted py-3">{{ $t('admin-loading') }}</div>
    <div v-else-if="error" class="alert alert-danger">{{ $t('admin-error-loading') }}</div>
    <div v-else-if="announcements.length === 0" class="alert alert-info">
      {{ $t('admin-announcements-empty') }}
    </div>
    <div v-for="announcement in announcements" :key="announcement.id" class="card mb-3">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between gap-2">
          <div>
            <h5 class="mb-1">{{ announcement.subject }}</h5>
            <div class="small text-muted">
              {{ formatDate(announcement.createdAt) }}
              <template v-if="announcement.author">
                · {{ announcement.author.name }} {{ announcement.author.lastname }}
              </template>
            </div>
          </div>
          <div class="small text-md-end">
            <div>
              {{
                $t('admin-announcement-stats', {
                  recipients: announcement.recipients,
                  sent: announcement.sent,
                  pending: announcement.pending
                })
              }}
            </div>
            <div v-if="announcement.cancelled" class="text-muted">
              {{ $t('admin-announcement-cancelled-count', { count: announcement.cancelled }) }}
            </div>
            <button
              v-if="announcement.cancellable"
              type="button"
              class="btn btn-outline-danger btn-medium mt-2"
              :disabled="cancelling[announcement.id]"
              @click="cancel(announcement)"
            >
              {{ $t('admin-announcement-cancel') }}
            </button>
          </div>
        </div>
        <p class="announcement-text mt-3 mb-0">{{ announcement.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}
.announcement-text {
  white-space: pre-line;
  overflow-wrap: anywhere;
}
.btn {
  width: auto;
}
</style>
