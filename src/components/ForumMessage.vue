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
import { timeAgo } from '@/utils/helper'
import AvatarImage from '@/components/AvatarImage.vue'

const authStore = useAuthStore()

const props = defineProps<{
  message: any
  channel: number
  detail: boolean
}>()

const emit = defineEmits<{
  (e: 'message-detail', msg: any): any
  (e: 'post', msg: any): any
  (e: 'edit', msg: any): any
  (e: 'delete', msg: any): any
}>()

const messageDetail = (message: any) => {
  emit('message-detail', message)
}
const apiBase = import.meta.env.VITE_API_BASE

const open = (url: string) => {
  window.open(url, '_blank')
}

const edit = (message: any) => {
  emit('edit', message)
}
const del = (message: any) => {
  emit('delete', message)
}
const hasOptions = computed(() => {
  return (
    props.message.userId === authStore.userId &&
    (props.message.file === null ||
      (props.message.file !== null &&
        props.message.children &&
        props.message.children.length === 0) ||
      (props.message.file !== null && !props.message.children))
  )
})

const hasChildren = computed(() => {
  return props.message.children && props.message.children.length
})
</script>

<template>
  <div class="d-flex">
    <AvatarImage
      class="me-2 mt-1"
      :size="56"
      :url="message.avatar"
      :name="message.name || message.username"
    ></AvatarImage>

    <div class="w-75">
      <div class="mt-1 d-flex">
        <span class="bold pe-2">{{ message.username }}</span>
        {{ format(message.updatedAt || new Date(), 'HH:mm dd/MM/yyyy') }}
        <span v-if="message.updatedAt !== message.createdAt" class="ms-2 edited">
          {{ $t('Edited') }}
        </span>

        <div class="dropdown" v-if="hasOptions">
          <svg
            class="clickable ms-2 options"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
            />
          </svg>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li v-if="message.file === null">
              <a class="dropdown-item" @click="edit(message)">{{ $t('Edit') }}</a>
            </li>
            <li v-if="!hasChildren">
              <a class="dropdown-item" @click="del(message)">{{ $t('Delete') }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="d-flex w-100 zmt-3" v-if="message.text">
        <div class="message">
          <div
            class="mt-1 mb-0"
            v-if="message.text"
            v-linkify:options="{
              target: '_blank'
            }"
            v-html="message.text.split('\n').join('<br>')"
          ></div>
        </div>
      </div>
      <div class="d-flex w-100 mt-2 mb-2" v-if="message.file && message.file.url">
        <div class="message">
          <img
            v-if="message.file.mime.startsWith('image')"
            :src="apiBase + message.file.url"
            alt="file"
            class="forum-image"
          />
          <div v-else class="file">
            <a href="javascript:void(0)" @click="open(apiBase + message.file.url)">
              <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg> -->
              {{ message.file.name }}
            </a>
          </div>
        </div>
      </div>

      <div class="d-block d-md-flex">
        <div
          v-if="message.children && message.children.length && !detail"
          class="mt-1 clickable linkable"
          @click="messageDetail(message)"
          data-bs-toggle="modal"
          data-bs-target="#confirm-modal-children-messages"
        >
          <span v-if="message.children.length > 1">{{
            $t('hi-ha-respostes', { n: message.children.length })
          }}</span>
          <span v-else>{{ $t('hi-ha-resposta', { n: message.children.length }) }}</span>
        </div>
        <span
          class="mt-1 ps-0 ps-md-3"
          v-if="!detail && message.children && message.children.length"
          >{{ timeAgo(message.children[message.children.length - 1].createdAt) }}</span
        >
      </div>
      <div
        v-if="message.children && message.children.length === 0 && !detail"
        class="mt-1 clickable linkable"
        @click="messageDetail(message)"
        data-bs-toggle="modal"
        data-bs-target="#confirm-modal-children-messages"
      >
        <!-- <CommentInput
          :channel="channel"
          :parent="message.id"
          @post="emit('post', $event)"
          :placeholder="$t('enviar-una-resposta')"
        /> -->
        {{ $t('enviar-una-resposta') }}
      </div>
      <!-- <pre>{{ message }}</pre> -->
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
.forum-image {
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 6px;
  max-width: 100%;
}
.file a,
.message a {
  color: rgb(27, 117, 208);
}
.options {
  margin-top: -6px;
}
@media (min-width: 1024px) {
}
.edited {
  color: #666;
}
</style>
<style>
.file a,
.message a {
  color: rgb(27, 117, 208);
}
</style>
