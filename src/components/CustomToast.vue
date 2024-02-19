<script setup lang="ts">
import { watch } from 'vue'
import { Toast } from 'bootstrap'
import router from '@/router';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  autoHide: {
    type: Boolean,
    required: false,
    default: true
  },
  url: {
    type: String,
    required: false
  }
})


const goTo = () => {
  if (props.url) {
    router.push(props.url)
    const toastOrganization = document.getElementById(props.id)
    const toast = new Toast(toastOrganization as any)
    toast.hide()
  }
}

watch(
  () => props.show,
  () => {
    showToast()
  }
)

const showToast = () => {
  const toastOrganization = document.getElementById(props.id)
  const toast = new Toast(toastOrganization as any)
  toast.show()
}
</script>
<template>
  <div class="toast-container position-fixed top-0 end-0 ztranslate-middle-x ztranslate-middle p-3">
    <div
      :id="id"
      class="toast"
      :class="`toast-${type}`"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :data-bs-autohide="autoHide"
    >
      <div class="toast-body d-flex" :class="url ? 'clickable' : 'z'" v-on:click="goTo()">

        <button v-if="!autoHide" type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>

        <div class="me-3 type" :class="type">
          <svg
            v-if="type === 'success'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.7 7.1999C18.3 6.7999 17.7 6.7999 17.3 7.1999L9.8 14.6999L6.7 11.5999C6.3 11.1999 5.7 11.1999 5.3 11.5999C4.9 11.9999 4.9 12.5999 5.3 12.9999L9.1 16.7999C9.3 16.9999 9.5 17.0999 9.8 17.0999C10.1 17.0999 10.3 16.9999 10.5 16.7999L18.7 8.5999C19.1 8.1999 19.1 7.5999 18.7 7.1999Z"
              fill="#00AB82"
            />
          </svg>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              v-if="type === 'error'"
              d="M13.4099 11.9999L17.7099 7.70994C17.8982 7.52164 18.004 7.26624 18.004 6.99994C18.004 6.73364 17.8982 6.47825 17.7099 6.28994C17.5216 6.10164 17.2662 5.99585 16.9999 5.99585C16.7336 5.99585 16.4782 6.10164 16.2899 6.28994L11.9999 10.5899L7.70994 6.28994C7.52164 6.10164 7.26624 5.99585 6.99994 5.99585C6.73364 5.99585 6.47824 6.10164 6.28994 6.28994C6.10164 6.47825 5.99585 6.73364 5.99585 6.99994C5.99585 7.26624 6.10164 7.52164 6.28994 7.70994L10.5899 11.9999L6.28994 16.2899C6.19621 16.3829 6.12182 16.4935 6.07105 16.6154C6.02028 16.7372 5.99414 16.8679 5.99414 16.9999C5.99414 17.132 6.02028 17.2627 6.07105 17.3845C6.12182 17.5064 6.19621 17.617 6.28994 17.7099C6.3829 17.8037 6.4935 17.8781 6.61536 17.9288C6.73722 17.9796 6.86793 18.0057 6.99994 18.0057C7.13195 18.0057 7.26266 17.9796 7.38452 17.9288C7.50638 17.8781 7.61698 17.8037 7.70994 17.7099L11.9999 13.4099L16.2899 17.7099C16.3829 17.8037 16.4935 17.8781 16.6154 17.9288C16.7372 17.9796 16.8679 18.0057 16.9999 18.0057C17.132 18.0057 17.2627 17.9796 17.3845 17.9288C17.5064 17.8781 17.617 17.8037 17.7099 17.7099C17.8037 17.617 17.8781 17.5064 17.9288 17.3845C17.9796 17.2627 18.0057 17.132 18.0057 16.9999C18.0057 16.8679 17.9796 16.7372 17.9288 16.6154C17.8781 16.4935 17.8037 16.3829 17.7099 16.2899L13.4099 11.9999Z"
              fill="#EC4260"
            />
          </svg>
        </div>
        <div class="texts">
          <div class="title pb-1">
            {{ title }}
          </div>
          <div class="description">
            {{ description }}
          </div>
        </div>
      </div>
      <div class="hr"></div>
    </div>
  </div>
</template>
<style scoped>
.type {
  width: 32px;
  height: 32px;
  background: #defcf3;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
}

.success {
  background: #defcf3;
}

.error {
  background: #ffece8;
}

.toast-success .hr {
  border-bottom: 2px solid #00ab82;
  width: 60px;
}

.toast-error .hr {
  border-bottom: 2px solid #f57356;
  width: 60px;
}

.toast-body {
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid var(--secondary-100, #edeef3);
  background: var(--neutral-ligth, #fff);
  box-shadow: 0px 6px 16px 0px rgba(2, 40, 103, 0.15);
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
.btn-close{
  position: absolute;
  right: 22px;
  top: 22px;
  outline: none;
  box-shadow: none;
}
.clickable{
  cursor: pointer;
}
</style>
