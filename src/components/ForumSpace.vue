<script setup lang="ts">
import { Api } from '@/service/api'
import { ref, watch, computed, onMounted } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import CustomToast from '@/components/CustomToast.vue'
import MessagesModal from '@/components/MessagesModal.vue'
import CommentInput from '@/components/CommentInput.vue'
import ForumMessage from '@/components/ForumMessage.vue'
import { useAuthStore } from '@/stores/auth'
import { onUnmounted } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import { Modal } from 'bootstrap'
import { replaceMentionValues } from '@/utils/mentions'
import { useI18n } from 'vue-i18n'
import LearningSpaceHeader from '@/components/LearningSpaceHeader.vue'
import LearningSpaceBanner from '@/components/LearningSpaceBanner.vue'
import LearningSpaceTheme from '@/components/LearningSpaceTheme.vue'
import AvatarImage from '@/components/AvatarImage.vue'
import { getApiBase } from '@/utils/config'

const authStore = useAuthStore()

const locale = useI18n().locale

const props = defineProps<{
  uid: string
}>()

const router = useRouter()
const channelId = ref(router.currentRoute.value.params.channelId as string)
const userId = ref(router.currentRoute.value.params.userId as string)

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

// --- Forum notification system ---
const unreadCounts = ref<Record<string, number>>({})

const fetchUnreadCounts = async () => {
  if (!forum.value) return
  try {
    const { data } = await Api.forums.unreadCounts(forum.value.id?.toString() || forum.value._id?.toString() || forum.value.uid || props.uid)
    if (data && data.unreadCounts) {
      // Map channelId to unreadCount
      const map: Record<string, number> = {}
      data.unreadCounts.forEach((item: any) => {
        map[item.channelId] = item.unreadCount
      })
      unreadCounts.value = map
    }
  } catch (e) {
    unreadCounts.value = {}
  }
}

const load = async () => {
  loaded.value = false
  const { data: forumData } = await Api.forums.get(props.uid, locale.value)

  if (forumData) {

    for await (const channel of forumData.channels) {
      if (!channel.messages) {
        channel.messages = []
      }

      if (channel.id.toString() === channelId.value) {
        const { data: messages } = await Api.channels.messages(
          channel.uid,
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
          channel.uid,
          messagesPerChannelHome,
          0
        )
        if (messages && messages.data) {
          channel.messages = messages.data
        }
      }
    }

    // temporary disable comments
    forumData.users = []

    forum.value = forumData
    // await fetchUnreadCounts()
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

const loadChannel = async (uid: string) => {
  // await until loaded.value is true
  await awaitUntilLoaded()

  // const { data: forumData } = await Api.forums.get(props.uid)

  for await (const channel of forum.value.channels) {
    if (channel.uid.toString() === uid.toString()) {
      const { data: messages } = await Api.channels.messages(
        uid.toString(),
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

const base = getApiBase()

const toastVisible = ref(false)
const channelConfigVisible = ref(false)
const channelConfig = ref(null)

watch(
  () => router.currentRoute.value.params,
  async () => {
    channelId.value = router.currentRoute.value.params.channelId as string
    userId.value = router.currentRoute.value.params.userId as string

    start.value = 0
    if (channelId.value) {
      messagesPerChannel.value = messagesPerChannelChannel
      // Mark channel as read when entering
      try {
        // await Api.forums.markChannelAsReadAll(channelId.value)
      } catch (e) {
        console.error('Error marking channel as read:', e)
      }
    } else {
      messagesPerChannel.value = messagesPerChannelHome
    }

    await load()
    //await fetchUnreadCounts()
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
        channel.uid.toString() === data.data.channelUid.toString()
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
    if (channel.uid.toString() === message.channel.toString()) {
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
  const { data: forumData } = await Api.forums.get(props.uid, locale.value)

  if (forumData) {
    for await (const channel of forumData.channels) {
      if (!channel.messages) {
        channel.messages = []
      }

      if (channel.uid.toString() === channelId.value) {
        const { data: messages } = await Api.channels.messages(
          channel.uid,
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
          channel.uid,
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

const privateChannelsEnabled = false

const privateChannels = computed(() => {
  if (forum.value && forum.value.private_channels && privateChannelsEnabled) {
    return forum.value.private_channels.filter(
      (channel: any) => channel.users_permissions_users.length > 0
    )
  }
  return []
})

const showCreatePrivateChannelModal = ref(false)
const createPrivateChannelModal = ref<Modal | null>(null)

const availableUsersForPrivateChannels = computed(() => {
  if (!forum.value || !forum.value.users || !forum.value.private_channels) {
    return []
  }

  // Get IDs of users who already have private channels with current user
  const existingPrivateChannelUserIds = forum.value.private_channels
    .map((channel: any) => channel.other_user?.id)
    .filter(Boolean)

  // Filter out current user and users who already have private channels
  return forum.value.users.filter(
    (user: any) => user.id !== authStore.userId && !existingPrivateChannelUserIds.includes(user.id)
  )
})

const openCreatePrivateChannelModal = () => {
  showCreatePrivateChannelModal.value = true
  const el = document.getElementById('confirm-modal-create-private-channel')
  if (el) {
    createPrivateChannelModal.value = new Modal(el, { keyboard: false })
    createPrivateChannelModal.value.show()
  }
}

const createPrivateChannel = async (userId: number) => {
  try {
    const channel = await Api.channels.createPrivate(props.uid, userId)
    createPrivateChannelModal.value?.hide()
    showCreatePrivateChannelModal.value = false
    // router.push(`/space/${props.uid}/forum/channel/${channel.data.data.uid}`)
     window.history.replaceState(
        {},
        '',
        `/space/${props.uid}/forum/channel/${channel.data.data.uid}`
      )
  } catch (error) {
    console.error('Error creating private channel:', error)
  }
}

const showConfig = () => {
  channelConfig.value = forum.value.channels.find(
    (channel: any) => channel.uid.toString() === channelId.value
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
        await loadChannel(channelId.value)
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

  console.log('deleteMessage', message)

  editMessageModal.value?.hide()
  showEditingMessage.value = false

  const index = childrenMessages.value.findIndex((m: any) => m.id === message.id)
  if (index > -1) {
    childrenMessages.value.splice(index, 1)
  }
  if (
    showChildrenMessagesParent.value &&
    showChildrenMessagesParent.value &&
    (showChildrenMessagesParent.value as any).id === message.id
  ) {
    ;(showChildrenMessagesParent.value as any).text = message.text
  } else {
    if (forum.value && forum.value.channels) {
      let targetChannel = null
      
      // First try to use the current channelId from the route
      if (channelId.value) {
        targetChannel = forum.value.channels
          .find((channel: any) => channel.uid.toString() === channelId.value.toString())
      }
      
      // If no channel found or no channelId, search all channels for the message
      if (!targetChannel) {
        targetChannel = forum.value.channels
          .find((channel: any) => 
            channel.messages && 
            channel.messages.some((m: any) => m.id === message.id)
          )
      }
      
      // Remove the message from the found channel
      if (targetChannel && targetChannel.messages) {
        const messageIndex = targetChannel.messages.findIndex((m: any) => m.id === message.id)
        if (messageIndex > -1) {
          targetChannel.messages.splice(messageIndex, 1)
        }
      }
    }
  }
}

const editMessageModal = ref<Modal | null>(null)
const editMessage = async (message: any) => {
  // message.updatedAt = new Date()

  const body = replaceMentionValues(
    message.text.split('\n').join('<br>'),
    ({ name }: any) => `@${name}`
  )

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
    showChildrenMessagesParent.value &&
    showChildrenMessagesParent.value &&
    (showChildrenMessagesParent.value as any).id === message.id
  ) {
    ;(showChildrenMessagesParent.value as any).text = message.text
  } else {
    const index = forum.value.channels
      .find((channel: any) => channel.id.toString() === message.channel.toString())
      .messages.findIndex((m: any) => m.id === message.id)
    if (index > -1) {
      forum.value.channels.find(
        (channel: any) => channel.id.toString() === message.channel.toString()
      ).messages[index].text = message.text //splice(index, 1, message)
    }
  }

  // await load()
}
</script>

<template>
  <div class="learning-space mb-5" v-if="forum && space">
    <LearningSpaceTheme :theme-styles="space.theme?.styles" />
    
    <LearningSpaceBanner :space="space" :base="base" :authenticated="true" template="small" />

    <LearningSpaceHeader :space="space" :uid="uid" :authenticated="true" selected="community" />

    <div class="container">
      <div class="row mt-5">
        <div class="col-12 col-md-4 mb-5 pe-0 pe-md-5">
          <div class="module">
            <h2 class="mb-4">{{ $t('channels') }}</h2>
            <div v-for="channel in publicChannels" :key="channel.id" class="module-item">
              <RouterLink
                :to="`/space/${uid}/forum/channel/${channel.uid}`"
                class="forum-link d-flex mb-3 w-100"
                :class="{
                  'forum-link':
                    !channelId || (channelId && channel.uid.toString() !== channelId.toString()),
                  'forum-selected': channelId && channel.uid.toString() === channelId.toString()
                }"
              >
                {{ channel.name }}
                <svg
                  v-if="channelId && channel.uid.toString() === channelId.toString()"                
                  class="ms-2 rotate-90 mt-1"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3.14879L1.4 7.74879L0 6.34879L6 0.348785L12 6.34879L10.6 7.74879L6 3.14879Z"
                    fill="var(--icon-primary, #44B08E)"
                  />
                </svg>
              </RouterLink>
            </div>
            <h2 v-if="privateChannels.length" class="mb-3">{{ $t('private-channels') }}</h2>
            <div v-for="channel in privateChannels" :key="channel.uid">
              <RouterLink
                :to="`/space/${uid}/forum/channel/${channel.uid}`"
                class="forum-link d-flex mb-3 w-100"
                :class="{
                  'forum-link':
                    !channelId || (channelId && channel.uid.toString() !== channelId.toString()),
                  'forum-selected': channelId && channel.uid.toString() === channelId.toString()
                }"
              >
                <span v-if="channel.other_user">
                  {{ channel.other_user.name }} {{ channel.other_user.lastname }}
                </span>
                <span v-else>
                  {{ channel.name }}
                </span>
                <svg
                  v-if="channelId && channel.uid.toString() === channelId.toString()"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3.14879L1.4 7.74879L0 6.34879L6 0.348785L12 6.34879L10.6 7.74879L6 3.14879Z"
                    fill="var(--icon-primary, #44B08E)"
                  />
                </svg>
              </RouterLink>
            </div>
            <div v-if="availableUsersForPrivateChannels.length > 0 && privateChannelsEnabled" class="mt-3">
              <button
                @click="openCreatePrivateChannelModal"
                class="btn btn-outline-primary btn-sm w-100"
              >
                {{ $t('create-private-channel') }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-8 mt-3" v-if="channelId">
          <div v-for="channel in forum.channels" :key="channel.uid">
            <div
              class="bg-white zmt-5"
              v-if="!channelId || (channelId && channelId.toString() === channel.uid.toString())"
            >
              <div class="d-flex w-100 zmt-3 flex-wrap">
                <div v-if="channelId && false">
                  <RouterLink :to="`/space/${uid}/forum`" class="btn btn-tertiary mb-4 me-4">
                    {{ $t('tornar') }}
                  </RouterLink>
                </div>
                <RouterLink
                  :to="`/space/${uid}/forum/channel/${channel.uid}`"
                  class="forum-link forum-link-individual"
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
                :users="forum.users"
              />

              <div v-for="(message, i) in channel.messages" :key="message.id" class="mb-5">
                <forum-message
                  v-if="i < messagesPerChannel - 1"
                  :message="message"
                  :channel="channel.uid"
                  @post="load"
                  @message-detail="messageDetail"
                  :detail="false"
                  @delete="deleteMessage"
                  @edit="editMessage"
                  :first="false"
                />

                <div v-if="i === messagesPerChannel - 1 && !channelId">
                  <RouterLink
                    :to="`/space/${uid}/forum/channel/${channel.uid}`"
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
        <div class="col-12 col-md-8" v-else>
          <div class="zmodule-type-forum mb-5">
            <VueMarkdown
              class="description"
              :source="forum.description"
              :options="{ sanitize: true }"
            ></VueMarkdown>
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
    <ConfirmModal
      id="create-private-channel"
      :title="$t('create-private-channel')"
      :show-footer="false"
    >
      <div v-if="showCreatePrivateChannelModal">
        <h5 class="mb-3">{{ $t('select-user-for-private-channel') }}</h5>
        <div class="list-group">
          <button
            v-for="user in availableUsersForPrivateChannels"
            :key="user.id"
            @click="createPrivateChannel(user.id)"
            class="list-group-item list-group-item-action d-flex align-items-center"
          >
            <AvatarImage
              class="me-2 mb-0"
              :size="40"
              :url="user.avatar"
              :name="user.name"
            ></AvatarImage>
            <div>
              <div class="fw-bold">{{ user.name }} {{ user.lastname }}</div>
              <small class="text-muted">{{ user.username }}</small>
            </div>
          </button>
        </div>
        <div
          v-if="availableUsersForPrivateChannels.length === 0"
          class="text-muted text-center py-3"
        >
          {{ $t('no-available-users-for-private-channels') }}
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
h3 {
  color: var(--Dark-grey, #797979);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
}
.module {
  color: var(--neutral-black, #000000);
  font-family: Inter;
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
  background: var(--theme-accent-light, #efdda2);
  font-family: Inter;
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
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--neutral-black, #000000);
}
.quick-access-name {
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px; /* 100% */
  color: var(--neutral-black, #000000);
}
.arrow-down {
  vertical-align: -4px;
  margin-left: 0.5rem;
}
.enrolled img {
  max-width: 100%;
}
.module-type-monitoring {
  background: var(--theme-secondary, #f5d634);
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.module-selected .module-type-monitoring {
  margin-top: 0rem;
}
.module-upload {
  margin-top: 5rem;
  background-color: var(--theme-info-bg, #bbdff7);

  color: var(--neutral-black, #000000);
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
  border: 2px solid var(--color-black, #000000);
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
  border-bottom: 1px solid var(--color-border-light, #eee);
}
.uploaded-file:last-child {
  border-bottom: none !important;
}
.remove-file {
  cursor: pointer;
}
.module-type-forum {
  background: var(--theme-success, #a5dda3);
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.module-type-forum .description {
  font-size: 14px;
  line-height: 20px;
  margin-top: 6px;
  color: var(--neutral-black, #000000);
  font-family: Inter;
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
.forum-link {
  color: var(--theme-primary, #44b08e);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 16.5px */
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin: 20px 0 0 0;
  padding-bottom: 20px;

  border-bottom: 1px solid var(--color-border-grey, #898989);
  display: block;
}

.rotate-90 {
  transform: rotate(90deg);
  margin-left: 0.5rem;
}
.module-item {
  padding-bottom: 0px;
}
.forum-link-individual {
  border: 0;
}
</style>
