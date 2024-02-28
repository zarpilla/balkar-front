<script lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { Api } from '@/service/api'
import { useAuthStore } from '@/stores/auth'
import FileUploadMessage from '@/components/FileUploadMessage.vue'

export default {
  props: {
    channel: {
      type: Number,
      required: true
    },
    parent: {
      type: Number,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  components: {
    FileUploadMessage
  },
  setup(props, { emit }) {
    const message = ref('')
    const textarea = ref(null)

    const authStore = useAuthStore()

    defineEmits<{
      (e: 'post', msg: any): any
    }>()

    const postMessage = async () => {
      // Send the message to the API
      // You can use axios or any other HTTP library to make the request
      // Example using axios:
      if (!message.value) {
        return
      }
      const response = await Api.messages.create({
        channel: props.channel,
        parent: props.parent > 0 ? props.parent : null,
        text: message.value
      })
      const message2 = {
        id: response.data.data.id,
        ...response.data.data.attributes,
        channel: props.channel,
        userId: authStore.userId,
        username: authStore.userName
      }

      emit('post', message2)
      message.value = ''
      resize()
    }
    const resize = () => {
      const textareaEl: any = textarea.value
      textareaEl.style.height = 'auto'
      textareaEl.style.height = `${textareaEl.scrollHeight - 22}px`
    }

    const uploaded = (payload: any) => {
      console.log('uploaded', payload)
      emit('post', {
        id: payload.id,
        ...payload.attributes,
        channel: props.channel,
        userId: authStore.userId,
        username: authStore.userName
      })
    }

    onMounted(() => {
      if (textarea.value) {
        const textareaEl: any = textarea.value
        textareaEl.addEventListener('input', () => {
          resize()
        })
      }
    })

    return {
      message,
      postMessage,
      textarea,
      uploaded
    }
  }
}

const upBack = ref(false)
const disabled = ref(false)
</script>

<template>
  <div class="zposition-relative">
    <div class="d-flex">
      <div class="w-100 position-relative">
        <textarea
          class="w-100"
          v-model="message"
          :placeholder="placeholder"
          ref="textarea"
        ></textarea>
        <span class="position-absolute send" @click="postMessage">
          <svg
            data-v-af8a87d7=""
            width="19"
            height="15"
            viewBox="0 0 19 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              data-v-af8a87d7=""
              d="M1 6.5C0.447715 6.5 9.65645e-08 6.94772 0 7.5C-9.65645e-08 8.05228 0.447715 8.5 1 8.5L1 6.5ZM18.7071 8.20711C19.0976 7.81659 19.0976 7.18342 18.7071 6.7929L12.3431 0.428934C11.9526 0.0384097 11.3195 0.0384096 10.9289 0.428934C10.5384 0.819458 10.5384 1.45262 10.9289 1.84315L16.5858 7.5L10.9289 13.1569C10.5384 13.5474 10.5384 14.1805 10.9289 14.5711C11.3195 14.9616 11.9526 14.9616 12.3431 14.5711L18.7071 8.20711ZM1 8.5L18 8.5L18 6.5L1 6.5L1 8.5Z"
              fill="#020034"
            ></path>
          </svg>
        </span>
      </div>
      <span class="ms-auto">
        <file-upload-message :channel="channel" :parent="parent" @uploaded="uploaded">
        </file-upload-message>
      </span>
    </div>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  border: 1px solid var(--Nabiu, #020034);
  height: 42px;
  border-radius: 20px;
  line-height: 26px;
  padding: 5px 20px;
  resize: none;
  background: #fff;
}
textarea:focus {
  outline: none;
  border: 1px solid var(--Nabiu, #020034);
}
.send {
  right: 20px;
  bottom: 17px;
  cursor: pointer;
  z-index: 100;
}
</style>
