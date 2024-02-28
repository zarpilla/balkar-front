<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'
import FileUpload from '@/components/FileUploadSubmission.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import CommentInput from '@/components/CommentInput.vue'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'

const authStore = useAuthStore()

const props = defineProps<{
  message: any
  channel: number
  detail: boolean
}>()

const emit = defineEmits<{
  (e: 'message-detail', msg: any): any
  (e: 'post', msg: any): any
}>()

const messageDetail = (message: any) => {
  console.log('messageDetail', message)

  emit('message-detail', message)
}
const apiBase = import.meta.env.VITE_API_BASE
</script>

<template>
  <div class="d-flex">
    <svg
      data-v-31e5adc9=""
      class="user-logo me-2"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!--v-if-->
      <g clip-path="url(#clip0_76_8029)" data-v-31e5adc9="">
        <path
          d="M16.0001 15.1667C17.841 15.1667 19.3334 13.6743 19.3334 11.8333C19.3334 9.99238 17.841 8.5 16.0001 8.5C14.1591 8.5 12.6667 9.99238 12.6667 11.8333C12.6667 13.6743 14.1591 15.1667 16.0001 15.1667Z"
          stroke="#8891A0"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-31e5adc9=""
        ></path>
        <path
          d="M11 23.5V21.8333C11 20.9493 11.3512 20.1014 11.9763 19.4763C12.6014 18.8512 13.4493 18.5 14.3333 18.5H17.6667C18.5507 18.5 19.3986 18.8512 20.0237 19.4763C20.6488 20.1014 21 20.9493 21 21.8333V23.5"
          stroke="#8891A0"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-31e5adc9=""
        ></path>
      </g>
      <defs data-v-31e5adc9="">
        <clipPath id="clip0_76_8029" data-v-31e5adc9="">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(6 6)"
            data-v-31e5adc9=""
          ></rect>
        </clipPath>
      </defs>
    </svg>
    <div class="w-75">
      <div class="mt-1">
        <span class="bold pe-2">{{ message.username }}</span>
        {{ format(message.createdAt || new Date(), 'HH:mm dd/MM/yyyy') }}
      </div>
      <div class="d-flex w-100 zmt-3" v-if="message.text">
        <div class="message">
          <vue-markdown class="mt-1 mb-0" :source="message.text"></vue-markdown>
        </div>
      </div>
      <div class="d-flex w-100 mt-2 mb-2" v-if="message.file && message.file.url">
        <div class="message">
          <img :src="apiBase + message.file.url" alt="file" class="forum-image" />
        </div>
      </div>

      <div
        v-if="message.children && message.children.length && !detail"
        class="mt-0 clickable linkable"
        @click="messageDetail(message)"
        data-bs-toggle="modal"
        data-bs-target="#confirm-modal-children-messages"
      >
        {{ $t('hi ha ') + ' ' + message.children.length + ' ' + $t('respostes') }}
      </div>

      <div v-if="message.children && message.children.length === 0" class="mt-1">
        <CommentInput
          :channel="channel"
          :parent="message.id"
          @post="emit('post', $event)"
          :placeholder="$t('Enviar una resposta')"
        />
      </div>
    </div>
  </div>
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
.side-topic .topic-name {
  text-decoration: none;
  font-weight: 300;
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
.linkable {
  text-decoration: underline;
  font-weight: 700;
}
.bold {
  font-weight: 700;
}
.user-logo {
  height: 56px;
  width: 56px;
  background: var(--secondary-100, #edeef3);
  border-radius: 4px;
  margin-top: 3px;
}
.forum-image{
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 6px;
}
@media (min-width: 1024px) {
}
</style>
