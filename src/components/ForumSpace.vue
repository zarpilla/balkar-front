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

const authStore = useAuthStore()

const props = defineProps<{
  uid: string
}>()

const router = useRouter()
const channelId = ref(router.currentRoute.value.params.channelId as string)

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

  const { data: spaceData } = await Api.learningSpaces.get(props.uid)
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
  // loaded.value = false

  console.log('loadChannel', start.value)

  // await until loaded.value is true
  await awaitUntilLoaded()

  const { data: forumData } = await Api.forums.get(props.uid)

  const moreAll: any[] = []

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

  // forum.value.channels.find((channel: any) => {
  //   if (channel.id.toString() === cid.toString()) {
  //     console.log('channel.messages', channel.messages, moreAll)
  //     for (let i = 0; i < moreAll.length; i++) {
  //       channel.messages.push(moreAll[i])
  //     }
  //     // channel.messages = moreAll
  //   }
  // })
}

load()

const base = import.meta.env.VITE_API_BASE

const toastVisible = ref(false)

watch(
  () => router.currentRoute.value.params.channelId,
  async () => {
    channelId.value = router.currentRoute.value.params.channelId as string
    start.value = 0
    if (channelId.value) {
      messagesPerChannel.value = messagesPerChannelChannel
    } else {
      messagesPerChannel.value = messagesPerChannelHome
    }

    await load()
  }
)

const uploaded = async () => {
  console.log('uploaded')
  await load()
}

const messageDetail = async (message: any) => {
  console.log('messageDetail', message)
  childrenMessages.value = message.children
  // await getChildrenMessages(message)
  showChildrenMessagesParent.value = message
  showChildrenMessages.value = true
}

const loadDetail = async (message: any) => {
  await getChildrenMessages(message)
  console.log('message loadDetail', message, childrenMessages.value)
  // childrenMessages.value.push(message as never)
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
        <vue-markdown :linkify="true" class="mt-4 mb-4" :source="forum.description"></vue-markdown>
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
                    Tornar
                  </RouterLink>
                </div>
                <RouterLink
                  :to="`/forum/${uid}/channel/${channel.id}`"
                  class="btn btn-secondary mb-4"
                >
                  {{ channel.name }}
                </RouterLink>
              </div>

              <CommentInput
                :channel="channel.id"
                :parent="0"
                @post="loadMessage"
                :placeholder="$t('nou-missatge-al-canal')"
                class="mb-3"
              />

              <div v-for="(message, i) in channel.messages" :key="message.id" class="mb-5">
                <forum-message
                  v-if="i < messagesPerChannel - 1"
                  :message="message"
                  :channel="channel.id"
                  @post="load"
                  @message-detail="messageDetail"
                  :detail="false"
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

              <div v-if="channel.messages && channel.messages.length === 0" class="mt-2 pb-2">
                {{ $t('no-hi-ha-missatges-al-canal') }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3 order-0 order-md-1 mb-5">
          <div class="module module-bordered">
            <h3 class="mb-3">{{ $t('channels') }}</h3>
            <div>
              <RouterLink
                class="btn mb-3 w-100"
                :to="`/forum/${uid}`"
                :class="{ 'btn-white': channelId, 'btn-primary': !channelId }"
              >
                {{ $t('all channels') }}
              </RouterLink>
            </div>
            <div v-for="channel in forum.channels" :key="channel.id">
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
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <MessagesModal id="children-messages" :title="$t('thread')">
      <div v-if="showChildrenMessages">
        <forum-message
          :message="showChildrenMessagesParent"
          :channel="(showChildrenMessagesParent as any).channelId"
          @post="load"
          :detail="true"
        />
        <div v-for="message in childrenMessages" :key="(message as any).id" class="mb-1">
          <forum-message
            :message="message"
            :channel="(showChildrenMessagesParent as any).channelId"
            @post="load"
            :detail="true"
          />
        </div>

        <CommentInput
          v-if="showChildrenMessagesParent"
          :channel="(showChildrenMessagesParent as any).channelId"
          :parent="(showChildrenMessagesParent as any).id"
          @post="loadDetail"
          :placeholder="$t('enviar-una-resposta')"
          :modal="true"
        />
      </div>
    </MessagesModal>
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
@media (min-width: 1024px) {
}
</style>
