<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed, onMounted } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'
import FileUpload from '@/components/FileUploadSubmission.vue'
import MessagesModal from '@/components/MessagesModal.vue'
import CommentInput from '@/components/CommentInput.vue'
import ForumMessage from '@/components/ForumMessage.vue'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import { onUnmounted } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import { Modal } from 'bootstrap'
import { replaceMentionValues } from '@/utils/mentions'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()

const locale = useI18n().locale

const props = defineProps<{
  uid: string
}>()

const router = useRouter()
const channelId = ref(router.currentRoute.value.params.channelId as string)
const userId = ref(router.currentRoute.value.params.userId as string)

const apiBase = import.meta.env.VITE_API_BASE
const showChildrenMessages = ref(false)
const showChildrenMessagesParent = ref(null)
const childrenMessages = ref([])

const loaded = ref(false)
const space = ref<any>(null)
const forum = ref<any>(null)
const forumBackground = ref<any>(null)
const messagesPerChannelHome = 5
const messagesPerChannelChannel = 8

const start = ref<number>(0)

const messagesPerChannel = ref(channelId.value ? messagesPerChannelChannel : messagesPerChannelHome)

const load = async () => {
  loaded.value = false
  const { data: forumData } = await Api.forums.get(props.uid)

  if (forumData) {
    for await (const channel of forumData.channels) {
      if (!channel.messages) {
        channel.messages = []
      }

      if (channel.id.toString() === channelId.value) {
        const { data: messages } = await Api.channels.messages(
          channel.id,
          messagesPerChannelChannel,
          start.value
        )
        if (messages && messages.data) {
          messages.data.forEach((message: any) => {
            channel.messages.push(message)
          })
        }
      } else {
        const { data: messages } = await Api.channels.messages(
          channel.id,
          messagesPerChannelHome,
          0
        )
        if (messages && messages.data) {
          channel.messages = messages.data
        }
      }
    }

    forum.value = forumData
  }

  const { data: spaceData } = await Api.learningSpaces.get(props.uid, locale.value)
  if (spaceData) {
    space.value = spaceData
  }
  loaded.value = true
}

const awaitUntilLoaded = async () => {
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (loaded.value) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

const loadChannel = async (cid: number) => {
  // await until loaded.value is true
  await awaitUntilLoaded()

  // const { data: forumData } = await Api.forums.get(props.uid)

  for await (const channel of forum.value.channels) {
    if (channel.id.toString() === cid.toString()) {
      const { data: messages } = await Api.channels.messages(
        cid.toString(),
        messagesPerChannelChannel,
        start.value
      )

      if (messages && messages.data) {
        const more = [...channel.messages, ...messages.data]
        channel.messages = more
        if (!messages.data.length) {
          start.value = start.value - messagesPerChannelChannel
        }
      }
    }
  }
}

load()

const base = import.meta.env.VITE_API_BASE

const toastVisible = ref(false)
const channelConfigVisible = ref(false)
const channelConfig = ref(null)

watch(
  () => router.currentRoute.value.params,
  async () => {
    channelId.value = router.currentRoute.value.params.channelId as string
    userId.value = router.currentRoute.value.params.userId as string

    console.log('channelId', channelId.value)
    console.log('userId', userId.value)

    start.value = 0
    if (channelId.value) {
      messagesPerChannel.value = messagesPerChannelChannel
    } else {
      messagesPerChannel.value = messagesPerChannelHome
    }

    await load()
  }
)

// watch(
//   () => router.currentRoute.value.params.userId,
//   async () => {
//     userId.value = router.currentRoute.value.params.userId as string

//     console.log('userId', userId.value)
//     // start.value = 0
//     // if (channelId.value) {
//     //   messagesPerChannel.value = messagesPerChannelChannel
//     // } else {
//     //   messagesPerChannel.value = messagesPerChannelHome
//     // }

//     // await load()
//   }
// )

const uploaded = async () => {
  console.log('uploaded')
  await load()
}

const messageDetail = async (message: any) => {
  childrenMessages.value = message.children
  showChildrenMessagesParent.value = message
  showChildrenMessages.value = true
}

const loadDetail = async (message: any) => {

  await getChildrenMessages(message)  
}

const getChildrenMessages = async (message: any) => {
  if (showChildrenMessagesParent.value) {
    const { data } = await Api.messages.getChildren((showChildrenMessagesParent.value as any).id)
    childrenMessages.value = data.data.children
    forum.value.channels.find((channel: any) => {
      if (
        channel.id.toString() === (showChildrenMessagesParent.value as any).channelId.toString()
      ) {
        channel.messages.find((m: any) => {
          if (m.id.toString() === (showChildrenMessagesParent.value as any).id.toString()) {
            m.children = data.data.children
          }
        })
      }
    })
  }
}

const loadMessage = async (message: any) => {
  forum.value.channels.find((channel: any) => {
    if (channel.id.toString() === message.channel.toString()) {
      channel.messages.push(message)
    }
  })
  await load()
}

const getLasMessageIdFromChannels = computed(() => {
  const ids = []
  if (forum.value && forum.value.channels) {
    for (const channel of forum.value.channels) {
      if (channel.messages && channel.messages.length) {
        ids.push(channel.messages[channel.messages.length - 1].id)
      }
    }
  }
  return ids
})

const getLasMessageIdFromBackgroundChannels = computed(() => {
  const ids = []
  if (forumBackground.value && forumBackground.value.channels) {
    for (const channel of forumBackground.value.channels) {
      if (channel.messages && channel.messages.length) {
        ids.push(channel.messages[channel.messages.length - 1].id)
      }
    }
  }
  return ids
})

const messagesAndBackgroundMessagesAreEqualArray = computed(() => {
  if (!forumBackground.value) {
    return true
  }
  const ids = getLasMessageIdFromChannels.value
  const idsBg = getLasMessageIdFromBackgroundChannels.value

  return ids.map((id, i) => {
    if (id !== idsBg[i]) {
      return false
    }
    return true
  })
})

const messagesAndBackgroundMessagesAreEqual = computed(() => {
  if (!forumBackground.value) {
    return true
  }
  const ids = getLasMessageIdFromChannels.value
  const idsBg = getLasMessageIdFromBackgroundChannels.value
  return JSON.stringify(ids) === JSON.stringify(idsBg)
})

const loadBackground = async () => {
  console.log('loadBackground')
  const { data: forumData } = await Api.forums.get(props.uid)

  if (forumData) {
    for await (const channel of forumData.channels) {
      if (!channel.messages) {
        channel.messages = []
      }

      if (channel.id.toString() === channelId.value) {
        const { data: messages } = await Api.channels.messages(
          channel.id,
          messagesPerChannelChannel,
          start.value
        )
        if (messages && messages.data) {
          messages.data.forEach((message: any) => {
            channel.messages.push(message)
          })
        }
      } else {
        const { data: messages } = await Api.channels.messages(
          channel.id,
          messagesPerChannelHome,
          0
        )
        if (messages && messages.data) {
          channel.messages = messages.data
        }
      }
    }

    forumBackground.value = forumData
  }
}

const interval = ref<any>(null)

const publicChannels = computed(() => {
  if (forum.value && forum.value.channels) {
    return forum.value.channels.filter(
      (channel: any) => channel.users_permissions_users.length === 0
    )
  }
  return []
})

const privateChannels = computed(() => {
  if (forum.value && forum.value.channels) {
    return forum.value.channels.filter((channel: any) => channel.users_permissions_users.length > 0)
  }
  return []
})

const showConfig = () => {
  channelConfig.value = forum.value.channels.find(
    (channel: any) => channel.id.toString() === channelId.value
  )
  channelConfigVisible.value = true
}

onMounted(() => {
  window.addEventListener('scroll', async () => {
    const scrollPosition = window.innerHeight + window.scrollY
    const documentHeight = document.documentElement.offsetHeight
    // console.log('scrollPosition', scrollPosition, documentHeight)
    if (scrollPosition >= documentHeight) {
      // Scroll is at the end of the page
      console.log('Scroll is at the end of the page')
      if (channelId.value) {
        await awaitUntilLoaded()
        start.value = start.value + messagesPerChannelChannel
        messagesPerChannel.value = start.value + messagesPerChannelChannel
        await loadChannel(parseInt(channelId.value))
      }
    }
  })

  // interval.value = setInterval(() => {
  //   loadBackground()
  // }, 5000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

watch(
  () => props.uid,
  async (newUid, oldUid) => {
    await load()
  }
)

const editingMessage = ref<any>(null)
const showEditingMessage = ref(false)

const deleteMessage = async (message: any) => {
  await Api.messages.remove(message.id)

  editMessageModal.value?.hide()
  showEditingMessage.value = false

  const index = childrenMessages.value.findIndex((m: any) => m.id === message.id)
  if (index > -1) {
    childrenMessages.value.splice(index, 1)
  }
  if (
    showChildrenMessagesParent &&
    showChildrenMessagesParent.value &&
    (showChildrenMessagesParent.value as any).id === message.id
  ) {
    ;(showChildrenMessagesParent.value as any).text = message.text
  } else {
    const index = forum.value.channels
      .find((channel: any) => channel.id.toString() === message.channelId.toString())
      .messages.findIndex((m: any) => m.id === message.id)
    if (index > -1) {
      forum.value.channels
        .find((channel: any) => channel.id.toString() === message.channelId.toString())
        .messages.splice(index, 1)
    }
  }
}

const editMessageModal = ref<Modal | null>(null)
const editMessage = async (message: any) => {
  // message.updatedAt = new Date()

  const body = replaceMentionValues(message.text.split('\n').join('<br>'), ({ name }: any) => `@${name}`)

  message.text = body

  editingMessage.value = message
  showEditingMessage.value = true

  const el = document.getElementById('confirm-modal-edit-message')
  editMessageModal.value = new Modal(el as any, { keyboard: false })
  editMessageModal.value.show()
}

const loadAfterEdit = async (message: any) => {

  message.updatedAt = new Date()
  editMessageModal.value?.hide()
  showEditingMessage.value = false

  const index = childrenMessages.value.findIndex((m: any) => m.id === message.id)
  if (index > -1) {
    ;(childrenMessages.value[index] as any).text = message.text
  }
  if (
    showChildrenMessagesParent &&
    showChildrenMessagesParent.value &&
    (showChildrenMessagesParent.value as any).id === message.id
  ) {
    ;(showChildrenMessagesParent.value as any).text = message.text
  } else {
    const index = forum.value.channels
      .find((channel: any) => channel.id.toString() === message.channel.toString())
      .messages.findIndex((m: any) => m.id === message.id)
    if (index > -1) {
      forum.value.channels
        .find((channel: any) => channel.id.toString() === message.channel.toString())
        .messages[index].text = message.text //splice(index, 1, message)
    }
  }

  // await load()
}
</script>

<template>
  <div class="learning-space mb-5" v-if="forum && space">
    <div class="bg-balkar">
      <div class="container">
        <RouterLink
          v-if="space && !space.global"
          class="btn btn-secondary mb-3 me-3"
          :to="`/space/${uid}`"
        >
          {{ space.name }}
        </RouterLink>

        <RouterLink class="btn btn-primary mb-3" :to="`/forum/${uid}`">
          {{ forum.name }}
        </RouterLink>
      </div>
    </div>

    <div class="container mt-5">
      <h1 class="ztext-uppercase">{{ forum.name }}</h1>
    </div>

    <div v-if="space.banner && space.banner.url" class="container mt-5">
      <img :src="base + space.banner.url" class="w-100" />
    </div>

    <div class="enrolled" v-if="forum.description">
      <div class="container bg-white mt-5">
        <vue-markdown
          :linkify="true"
          :options="{ html: true, linkTarget: '_blank' }"
          class="mt-4 mb-4"
          :source="forum.description"
        ></vue-markdown>
      </div>
    </div>

    <div class="container">
      <div class="row mt-5">
        <div class="col-12 order-1 order-md-0 col-md-9">
          <div v-for="channel in forum.channels" :key="channel.id">
            <div
              class="bg-white zmt-5"
              v-if="!channelId || (channelId && channelId.toString() === channel.id.toString())"
            >
              <div class="d-flex w-100 zmt-3 flex-wrap">
                <div v-if="channelId">
                  <RouterLink :to="`/forum/${uid}`" class="btn btn-tertiary mb-4 me-4">
                    {{ $t('tornar') }}                    
                  </RouterLink>
                </div>
                <RouterLink
                  :to="`/forum/${uid}/channel/${channel.id}`"
                  class="btn btn-secondary mb-4"
                >
                  {{ channel.name }}
                </RouterLink>

                <svg
                  @click="showConfig"
                  data-bs-toggle="modal"
                  data-bs-target="#confirm-modal-channel-settings"
                  v-if="
                    channelId &&
                    channel.users_permissions_users &&
                    channel.users_permissions_users.length > 0
                  "
                  class="channel-config clickable mt-2 ms-2"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path
                    d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
                  />
                </svg>
              </div>
              <CommentInput
                :channel="channel.id"
                :parent="0"
                @post="loadMessage"
                :placeholder="$t('nou-missatge-al-canal')"
                class="mb-3"
                :users="forum.users"
              />

              <div v-for="(message, i) in channel.messages" :key="message.id" class="mb-5">
                <forum-message
                  v-if="i < messagesPerChannel - 1"
                  :message="message"
                  :channel="channel.id"
                  @post="load"
                  @message-detail="messageDetail"
                  :detail="false"
                  @delete="deleteMessage"
                  @edit="editMessage"
                  :first="false"
                />

                <div v-if="i === messagesPerChannel - 1 && !channelId">
                  <RouterLink
                    :to="`/forum/${uid}/channel/${channel.id}`"
                    class="btn btn-tertiary mb-3"
                  >
                    {{ $t('veure-tots-els-missatges-del-canal') }}
                  </RouterLink>
                </div>
              </div>

              <div v-if="channel.messages && channel.messages.length === 0" class="mt-2 pb-5">
                {{ $t('no-hi-ha-missatges-al-canal') }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3 order-0 order-md-1 mb-5">
          <div class="module module-bordered">
            <h3 v-if="publicChannels.length" class="mb-3">{{ $t('channels') }}</h3>
            <div>
              <RouterLink
                class="btn mb-3 w-100"
                :to="`/forum/${uid}`"
                :class="{ 'btn-white': channelId, 'btn-primary': !channelId }"
              >
                {{ $t('all channels') }}
              </RouterLink>
            </div>
            <div v-for="channel in publicChannels" :key="channel.id">
              <RouterLink
                :to="`/forum/${uid}/channel/${channel.id}`"
                class="btn mb-3 w-100"
                :class="{
                  'btn-white':
                    !channelId || (channelId && channel.id.toString() !== channelId.toString()),
                  'btn-primary': channelId && channel.id.toString() === channelId.toString()
                }"
              >
                {{ channel.name }}
              </RouterLink>
            </div>
            <h3 v-if="privateChannels.length" class="mb-3">{{ $t('private-channels') }}</h3>
            <div v-for="channel in privateChannels" :key="channel.id">
              <RouterLink
                :to="`/forum/${uid}/channel/${channel.id}`"
                class="btn mb-3 w-100"
                :class="{
                  'btn-white':
                    !channelId || (channelId && channel.id.toString() !== channelId.toString()),
                  'btn-primary': channelId && channel.id.toString() === channelId.toString()
                }"
              >
                {{ channel.name }}
              </RouterLink>
            </div>
            <!-- <div v-if="forum">
              <div v-for="user in forum.users" :key="user.id">
                <RouterLink
                :to="`/forum/${uid}/user/${user.id}`"
                class="btn mb-3 w-100 btn-white">
                {{ user.name + ' ' + user.lastname }}
              </RouterLink>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <MessagesModal id="children-messages" :title="$t('thread')">
      <div v-if="showChildrenMessages" v-show="!showEditingMessage">
        <forum-message
          :message="showChildrenMessagesParent"
          :channel="(showChildrenMessagesParent as any).channelId"
          @post="load"
          @edit="editMessage"
          @delete="deleteMessage"
          :detail="true"
          :first="true"
        />
        <div v-for="message in childrenMessages" :key="(message as any).id" class="mt-2 mb-2">
          <forum-message
            :message="message"
            :channel="(showChildrenMessagesParent as any).channelId"
            @post="load"
            @edit="editMessage"
            @delete="deleteMessage"
            :detail="true"
            :first="false"
          />
        </div>
        <CommentInput
          v-if="showChildrenMessagesParent"
          :channel="(showChildrenMessagesParent as any).channelId"
          :parent="(showChildrenMessagesParent as any).id"
          @post="loadDetail"
          :placeholder="$t('enviar-una-resposta')"
          :modal="true"
          :users="forum.users"
        />
      </div>
    </MessagesModal>
    <!-- <ConfirmModal id="channel-settings" :title="$t('channel-settings')" @confirm="() => {}">
      channel-settings
      <pre v-if="channelConfigVisible">{{ channelConfig }}</pre>
    </ConfirmModal>
    <ConfirmModal id="private-channel-add" :title="$t('channel-settings')" @confirm="() => {}">
      private-channel-add
      <pre v-if="forum">{{ forum.users }}</pre>
    </ConfirmModal> -->
    <ConfirmModal
      id="edit-message"
      :title="$t('Edit message')"
      @confirm="showEditingMessage = false"
      @cancel="showEditingMessage = false"
      :show-footer="false"
    >
      <div v-if="showEditingMessage">
        <div v-if="editingMessage && editingMessage.file === null">
          <CommentInput
            :channel="editingMessage.channelId"
            :parent="editingMessage.parent"
            @post="loadAfterEdit"
            placeholder=""
            class="mb-3"
            :text="editingMessage.text"
            :id="editingMessage.id"
            :users="forum.users"
          >
          </CommentInput>
        </div>
      </div>
    </ConfirmModal>
    <CustomToast
      :show="toastVisible"
      type="success"
      :title="$t('enrolled')"
      :description="$t('enrolled-to-space-successfully')"
      id="account-contact-ok-toast"
    ></CustomToast>
  </Teleport>
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
.module-bordered {
  border-radius: 25px;
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
.channel-configz path {
  fill: #666;
}
@media (min-width: 1024px) {
}
</style>
