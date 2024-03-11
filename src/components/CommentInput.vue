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
    },
    modal: {
      type: Boolean,
      default: false
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
      setTimeout(() => {
        resize()
      }, 10)
    }
    const resize = () => {
      const textareaEl: any = textarea.value
      textareaEl.style.height = 'auto'
      textareaEl.style.height = `${textareaEl.scrollHeight - 30}px`
    }

    const uploaded = (payload: any) => {
      console.log('uploaded', payload)
      emit('post', {
        id: payload.id,
        file: payload.file,
        channel: props.channel,
        userId: authStore.userId,
        username: authStore.userName,
        parent: props.parent
      })
    }

    onMounted(() => {
      if (textarea.value) {
        const textareaEl: any = textarea.value
        textareaEl.addEventListener('input', () => {
          resize()
        })
        textareaEl.addEventListener('keydown', (event: any) => {
          if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            postMessage()
          }
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
</script>

<template>
  <div class="zposition-relative">
    <div class="d-flex">
      <div class="w-100 position-relative zmt-5" :class="{ 'mt-3': true, 'zmt-2': !modal }">
        <textarea
          class="w-100"
          v-model="message"
          :placeholder="placeholder"
          ref="textarea"
        ></textarea>
        <span class="position-absolute send" @click="postMessage">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path
              d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"
            />
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
  line-height: 30px;
  padding: 5px 20px;
  resize: none;
  background: #fff;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
textarea:focus {
  outline: none;
  border: 1px solid var(--Nabiu, #020034);
}
.send {
  right: 20px;
  bottom: 18px;
  cursor: pointer;
  z-index: 100;
}
</style>
