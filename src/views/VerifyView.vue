<script setup lang="ts">
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { Api } from '@/service/api'
import { ref } from 'vue'

// Public page linked from certificates (link and QR code): anyone can check that a
// certificate is genuine with its code, without logging in.

const route = useRoute()
const { locale } = useI18n()
const authStore = useAuthStore()

const code = String(route.params.code || '')
const loading = ref(true)
const certificate = ref<any>(null)

const formatDate = (date: string) => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  try {
    return d.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return d.toLocaleDateString()
  }
}

const load = async () => {
  try {
    const response = await Api.certificates.verify(code, locale.value)
    certificate.value = response.data?.valid ? response.data : null
  } catch {
    certificate.value = null
  }
  loading.value = false
}

load()
</script>

<template>
  <component
    :is="authStore.isAuthenticated() ? LayoutAuthenticated : LayoutGuest"
    css="bg-white"
    :loaded="true"
  >
    <div class="container verify py-5">
      <div class="row">
        <div class="col-12 col-lg-8 offset-lg-2">
          <h1 class="mb-4">{{ $t('verify-title') }}</h1>

          <p v-if="loading">{{ $t('verify-loading') }}</p>

          <div v-else-if="certificate" class="verify-card verify-card--valid">
            <p class="verify-card__status">✓ {{ $t('verify-valid') }}</p>
            <dl class="verify-card__data">
              <dt>{{ $t('verify-issued-to') }}</dt>
              <dd>{{ certificate.issuedTo }}</dd>
              <dt>{{ $t('verify-course') }}</dt>
              <dd>{{ certificate.course }}</dd>
              <template v-if="certificate.hours">
                <dt>{{ $t('verify-hours') }}</dt>
                <dd>{{ certificate.hours }}</dd>
              </template>
              <dt>{{ $t('verify-issued-on') }}</dt>
              <dd>{{ formatDate(certificate.issuedAt) }}</dd>
              <template v-if="certificate.siteName">
                <dt>{{ $t('verify-issued-by') }}</dt>
                <dd>{{ certificate.siteName }}</dd>
              </template>
              <dt>{{ $t('verify-code') }}</dt>
              <dd class="verify-card__code">{{ certificate.code }}</dd>
            </dl>
          </div>

          <div v-else class="verify-card verify-card--invalid">
            <p class="verify-card__status">{{ $t('verify-not-found') }}</p>
            <p class="mb-0">{{ $t('verify-not-found-explanation', { code }) }}</p>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>

<style scoped>
.verify-card {
  padding: 1.5rem;
  border-radius: 10px;
  overflow-wrap: anywhere;
}
.verify-card--valid {
  background: var(--theme-success-bg, #d4edda);
}
.verify-card--invalid {
  background: var(--theme-secondary-light, #fdf3c4);
}
.verify-card__status {
  font-size: 20px;
  font-weight: 600;
}
.verify-card__data {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1.5rem;
  margin: 0;
}
.verify-card__data dt {
  font-weight: 600;
}
.verify-card__data dd {
  margin: 0;
}
.verify-card__code {
  font-family: monospace;
}
@media (max-width: 575px) {
  .verify-card__data {
    grid-template-columns: 1fr;
    gap: 0.15rem;
  }
  .verify-card__data dd {
    margin-bottom: 0.5rem;
  }
}
</style>
