<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, computed, onMounted, nextTick } from 'vue'
import { Modal } from 'bootstrap'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
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

    const adminUsersProgress = await Api.learningSpaces.getAdminUsersProgress(props.uid)
    if (adminUsersProgress.data) {
      space.value.adminUsersProgress = adminUsersProgress.data
    }

    const adminContentProgress = await Api.learningSpaces.getAdminContentProgress(props.uid)
    if (adminContentProgress.data) {
      space.value.adminContentProgress = adminContentProgress.data
    }
  }
  loaded.value = true
  emit('loaded', space.value)
}

load()

const base = getApiBase()

const toastVisible = ref(false)

// Modal state
const userDetailsModal = ref<Modal | null>(null)
const contentDetailsModal = ref<Modal | null>(null)
const selectedUser = ref<any>(null)
const selectedContentModule = ref<any>(null)

onMounted(async () => {
  // Component mounted
})

const authenticated = computed(() => {
  return authStore.isAuthenticated()
})

// Helper functions for progress calculations
const calculateUserOverallProgress = (user: any) => {
  if (!user.contentModules || user.contentModules.length === 0) return 0
  const totalProgress = user.contentModules.reduce(
    (sum: number, module: any) => sum + module.completedPct,
    0
  )
  return totalProgress / user.contentModules.length
}

const calculateModuleAverageCompletion = (module: any) => {
  if (!module.units || module.units.length === 0) return 0
  const totalCompletion = module.units.reduce(
    (sum: number, unit: any) => sum + (unit.completionRate || 0),
    0
  )
  return totalCompletion / module.units.length
}

// Modal functions
const openUserDetailsModal = async (user: any) => {
  selectedUser.value = user
  await nextTick()
  const el = document.getElementById('user-details-modal')
  if (el) {
    userDetailsModal.value = new Modal(el, { keyboard: false })
    userDetailsModal.value.show()
  }
}

const openContentDetailsModal = async (module: any) => {
  selectedContentModule.value = module
  await nextTick()
  const el = document.getElementById('content-details-modal')
  if (el) {
    contentDetailsModal.value = new Modal(el, { keyboard: false })
    contentDetailsModal.value.show()
  }
}

const closeUserDetailsModal = () => {
  userDetailsModal.value?.hide()
}

const closeContentDetailsModal = () => {
  contentDetailsModal.value?.hide()
}
</script>

<template>
  <div class="learning-space mb-5" v-if="loaded && space">
    <LearningSpaceBanner
      :space="space"
      :base="base"
      :authenticated="!!authenticated"
      template="small"
    />

    <div class="enrolled mt-5" v-if="authenticated">
      <div class="container zbg-balkar zmt-5">
        <div class="row">
          <div class="col-12">
            <!-- Users Progress Section -->
            <h4 class="mb-3">Users Progress ({{ space.adminUsersProgress?.meta.totalUsers }} users)</h4>
            <div class="table-responsive mb-5">
              <table class="table ztable-striped ztable-hover">
                <thead class="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Overall Progress</th>
                    <th>Content Modules</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in space.adminUsersProgress?.users || []" :key="user.id">
                    <td>
                      <strong>{{ user.name }} {{ user.lastname }}</strong>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                      <div class="progress mt-4" style="height: 20px">
                        <div
                          class="progress-bar bg-progress"
                          :style="{ width: calculateUserOverallProgress(user) * 100 + '%' }"
                        >
                          {{ Math.round(calculateUserOverallProgress(user) * 100) }}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div v-for="module in user.contentModules" :key="module.uid" class="mb-2">
                        <small class="text-muted">Module: {{ module.title }}</small>
                        <div class="progress" style="height: 15px">
                          <div
                            class="progress-bar bg-progress"
                            :style="{ width: module.completedPct * 100 + '%' }"
                          >
                            {{ Math.round(module.completedPct * 100) }}%
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        class="btn btn-medium btn-outline-primary"
                        @click="openUserDetailsModal(user)"
                      >
                        <i class="fas fa-eye"></i> Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Content Progress Section -->
            <h4 class="mb-3 mt-5">
              Content Progress
            </h4>
            <div class="table-responsive">
              <table class="table ztable-striped ztable-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Module</th>
                    <th>Units</th>
                    <th>Average Completion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="module in space.adminContentProgress?.content?.contentModules || []"
                    :key="module.uid"
                  >
                    <td>
                      <strong>{{ module.title }}</strong>
                    </td>
                    <td>{{ module.units?.length || 0 }} units</td>
                    <td>
                      <div class="progress" style="height: 20px">
                        <div
                          class="progress-bar bg-progress"
                          :style="{ width: calculateModuleAverageCompletion(module) * 100 + '%' }"
                        >
                          {{ Math.round(calculateModuleAverageCompletion(module) * 100) }}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        class="btn btn-medium btn-outline-secondary"
                        @click="openContentDetailsModal(module)"
                      >
                        <i class="fas fa-eye"></i> Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- User Details Modal -->
  <Teleport to="body">
    <div
      class="modal fade"
      id="user-details-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="user-details-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="user-details-modal-label">
              {{ selectedUser?.name }} {{ selectedUser?.lastname }} - Detailed Progress
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeUserDetailsModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedUser" class="user-progress-details">
              <div class="mb-4">
                <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                <p>
                  <strong>Overall Progress:</strong>
                  {{ Math.round(calculateUserOverallProgress(selectedUser) * 100) }}%
                </p>
              </div>

              <div v-for="module in selectedUser.contentModules" :key="module.uid" class="mb-4">
                <h6 class="text-secondary border-bottom pb-2">Module: {{ module.title }}</h6>
                <div class="row">
                  <div class="col-md-12">
                    <div
                      v-for="unit in module.units"
                      :key="unit.uid"
                      class="border p-3 mb-3 rounded"
                    >
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>
                          <strong>Unit:</strong> {{ unit.title }}
                          <span v-if="unit.completed" class="badge bg-success ms-2">Completed</span>
                          <span v-else class="badge bg-warning ms-2">In Progress</span>
                        </span>
                        <span class="fw-bold text-primary"
                          >{{ Math.round(unit.completedPct * 100) }}%</span
                        >
                      </div>
                      <div v-if="unit.completedAt" class="small text-muted mb-2">
                        <i class="fas fa-calendar-check me-1"></i>
                        Completed: {{ new Date(unit.completedAt).toLocaleDateString() }}
                      </div>
                      <div v-if="unit.lessons && unit.lessons.length > 0" class="mt-3">
                        <small class="text-muted fw-bold">Lessons:</small>
                        <div class="ms-3 mt-2">
                          <div
                            v-for="lesson in unit.lessons"
                            :key="lesson.uid"
                            class="d-flex align-items-center mb-1"
                          >
                            <i
                              :class="
                                lesson.completed
                                  ? 'fas fa-check-circle text-success me-2'
                                  : 'far fa-circle text-muted me-2'
                              "
                            ></i>
                            <span class="flex-grow-1">{{ lesson.title }}</span>
                            <span v-if="lesson.completedAt" class="text-muted small">
                              {{ new Date(lesson.completedAt).toLocaleDateString() }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Content Details Modal -->
  <Teleport to="body">
    <div
      class="modal fade"
      id="content-details-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="content-details-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="content-details-modal-label">
              Content Module: {{ selectedContentModule?.title }} - Unit Details
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="closeContentDetailsModal"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedContentModule" class="content-progress-details">
              <div class="mb-4">
                <p>
                  <strong>Average Completion:</strong>
                  {{ Math.round(calculateModuleAverageCompletion(selectedContentModule) * 100) }}%
                </p>
                <p><strong>Total Units:</strong> {{ selectedContentModule.units?.length || 0 }}</p>
              </div>

              <div v-for="unit in selectedContentModule.units" :key="unit.uid" class="mb-4">
                <div class="border p-3 rounded">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-secondary mb-0">{{ unit.title }}</h6>
                    <span class="badge bg-info fs-6"
                      >{{ Math.round(unit.completionRate * 100) }}% completion rate</span
                    >
                  </div>

                  <div v-if="unit.completedBy && unit.completedBy.length > 0" class="mb-3">
                    <small class="text-muted fw-bold"
                      >Completed by {{ unit.completedBy.length }} users:</small
                    >
                    <div class="mt-2">
                      <span
                        v-for="completion in unit.completedBy"
                        :key="completion.id + '-' + completion.completedAt"
                        class="badge bg-success me-2 mb-1 p-2"
                      >
                        {{ completion.username.split('@')[0] }}
                        <small class="ms-1"
                          >({{ new Date(completion.completedAt).toLocaleDateString() }})</small
                        >
                      </span>
                    </div>
                  </div>

                  <div v-if="unit.lessons && unit.lessons.length > 0" class="mt-3">
                    <small class="text-muted fw-bold">Lessons:</small>
                    <div class="ms-3 border-start border-3 ps-3 mt-2">
                      <div
                        v-for="lesson in unit.lessons"
                        :key="lesson.uid"
                        class="mb-3 p-2 bg-light rounded"
                      >
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <span class="fw-bold">{{ lesson.title }}</span>
                          <span class="badge bg-secondary"
                            >{{ Math.round(lesson.completionRate * 100) }}%</span
                          >
                        </div>
                        <div
                          v-if="lesson.completedBy && lesson.completedBy.length > 0"
                          class="mt-2"
                        >
                          <small class="text-muted">Completed by:</small>
                          <div class="mt-1">
                            <span
                              v-for="completion in lesson.completedBy"
                              :key="completion.id + '-lesson-' + completion.completedAt"
                              class="badge bg-light text-dark me-1 small"
                            >
                              {{ completion.username.split('@')[0] }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

/* Admin Progress Tables */
.table {
  border-radius: 0.5rem;
  overflow: hidden;
}

.table th {
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.progress {
  background-color: #e9ecef;
  border-radius: 0.25rem;
  background-color: rgba(240, 192, 90, 0.5)!important;  
  border-radius: 10px;  
  height: 20px!important;
}

.progress-bar {
  transition: width 0.3s ease;
  background-color: rgba(240, 192, 90, 0.5)!important;  
  color: #000;
}

.bg-progress {
  background-color: rgba(240, 192, 90, 1)!important;
}

.badge {
  font-size: 0.75em;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.text-primary {
  color: #0d6efd !important;
}

.text-secondary {
  color: #6c757d !important;
}

.border-start {
  border-left: 3px solid #dee2e6 !important;
}

.small {
  font-size: 0.875em;
}

/* Modal Styles */
.modal-xl {
  max-width: 90%;
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  color: #000000;
  font-family: Inter;
  font-size: 20px;
  font-weight: 600;
}

.user-progress-details .border-bottom {
  border-color: #dee2e6 !important;
}

.content-progress-details .border {
  border-color: #dee2e6 !important;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.badge.fs-6 {
  font-size: 0.9rem !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>
