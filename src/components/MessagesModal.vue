<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  },  
  text: {
    type: String,
    required: false
  },
  buttonText: {
    type: String,
    required: false
  },
  disclaimer: {
    type: String,
    required: false
  }
})

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>
<template>
  <div
    class="modal fade"
    :id="`confirm-modal-${id}`"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="edit-kpi-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog zmodal-dialog-centered modal-lg zmodal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-hr">
            <h5 class="modal-title" id="edit-kpi-modal-label">
              {{ title }}
            </h5>
          </div>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="cancel"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text" v-if="text" v-html="text"></div>

          <slot />
          
        </div>
        <!-- <div class="modal-footer justify-content-start">
                   <button
            type="button"
            class="btn btn-primary"
            :class="`btn-${type}`"
            @click="confirm"
            data-bs-dismiss="modal"
          >
            {{ buttonText || 'Ok' }}
          </button>

          <button type="button" class="btn btn-tertiary" data-bs-dismiss="modal" @click="cancel">
            Cancel
          </button>


        </div>
        <div class="modal-footer disclaimer justify-content-start" v-if="disclaimer">
          <div class="subddued" v-html="disclaimer"></div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.success {
  width: 32px;
  height: 32px;
  background: #defcf3;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
}

.hr {
  border-bottom: 2px solid #00ab82;
  width: 60px;
}

.toast-body {
  background-color: #fff;
  border-radius: 6px;
  border: 0px solid var(--secondary-100, #edeef3) !important;
  background: var(--neutral-ligth, #fff);
  box-shadow: 0px 6px 16px 0px rgba(2, 40, 103, 0.15);
  box-shadow: none !important;
}

.texts .title {
  color: var(--text-default-800, #0e0f11);

  /* Text/Body Bold */
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  /* 128.571% */
}

.texts .description {
  color: var(--text-subdued-500, #8891a0);

  /* Text/Body Regular */
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  /* 128.571% */
}
.disclaimer {
  padding: 8px 0px 48px;
  margin: 0 48px;

  color: var(--text-subdued-500, #8891a0);

  /* Text/Mini Bold */
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 14px;
  border-top: 1px solid var(--text-subdued-500, #eee);
}

.btn{
  width: auto;
}
</style>
