<script setup lang="ts">
import { Api } from '@/service/api'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import AvatarImageUpload from '@/components/AvatarImageUpload.vue'
import AvatarImage from '@/components/AvatarImage.vue'
import CustomToast from '@/components/CustomToast.vue'
import { useI18n } from 'vue-i18n'
import { checkEmpty, checkIsEmail } from '@/utils/helper'
import router from '@/router'
const { t } = useI18n()
const authStore = useAuthStore()


const props = defineProps({
  redirect: {
    type: String,
    required: false
  }
})

const account = ref<any>(null)

const editedAccount = ref<any>({
  name: '',
  lastname: ''
})

const avatar = ref<any>(null)

const apiBase = import.meta.env.VITE_API_BASE
const load = async () => {
  account.value = (await Api.auth.get()).data
  editedAccount.value.name = account.value.name
  editedAccount.value.lastname = account.value.lastname
  const myAvatar = await Api.avatars.mine()
  if (myAvatar.data && myAvatar.data.data) {
    editedAccount.value.pictureUrl = apiBase + myAvatar.data.data.avatar.url
    avatar.value = myAvatar.data.data
    authStore.pictureUrl = myAvatar.data.data.avatar.url
  }
}

const saveChanges = async () => {
  if (checkEmpty(editedAccount.value.name) || checkEmpty(editedAccount.value.lastname)) {
    toastErrorVisible.value = !toastErrorVisible.value
    // Handle validation error, show error message or take appropriate action
    return
  }

  // Perform API call to save changes
  await Api.auth.update(account.value.id, { ...editedAccount.value })
  toastMessage.value = t('Account uploaded successfully!')
  toastVisible.value = !toastVisible.value
  // Reload account data

  authStore.setUser({
    name: editedAccount.value.name,
    lastname: editedAccount.value.lastname
  })

  if (!props.redirect) {
    await load()
  } else {
    router.push(props.redirect)
  }
}

onMounted(async () => {
  await load()
})

const updateAccount = async () => {
  await saveChanges()
}

const toastMessage = ref('')
const toastErrorVisible = ref(false)

const toastVisible = ref(false)
const uploaded = (fileImage: string) => {
  editedAccount.value.pictureUrl = fileImage  
  toastMessage.value = t('Avatar uploaded successfully!')
  toastVisible.value = !toastVisible.value
  setTimeout(() => {
    window.location.reload()
  }, 1000)  
}

</script>

<template>
  <div class="container mt-5" v-if="account">
    <div class="row">
      <div class="col-12 col-md-9">
        <div class="bordered-card mb-4">
          <FormField :label="$t('avatar')" css="col-12 col-md-8 mb-3">
            <div class="d-flex mb-5 position-relative">
              <AvatarImage
                class="me-1"
                :size="96"
                :url="editedAccount.pictureUrl"
                :name="editedAccount.name + ' ' + editedAccount.lastname"
              ></AvatarImage>
              <div class="upload">
                <AvatarImageUpload
                  @uploaded="uploaded"
                  :api="`/user-avatars${avatar ? '/' + avatar.id : ''}`"
                  :method="avatar ? 'put' : 'post'"
                ></AvatarImageUpload>
              </div>
            </div>
          </FormField>
          <form @submit.prevent="updateAccount">
            <FormField :label="$t('email')" css="col-12 col-md-8 mb-3">
              <FormControl
                type="text"
                :placeholder="$t('email')"
                v-model="account.email"
                name="current"
                readonly
              />
            </FormField>
            <FormField :label="$t('name')" css="col-12 col-md-8 mb-3">
              <FormControl
                type="text"
                :placeholder="$t('name')"
                v-model="editedAccount.name"
                name="name"
              />
            </FormField>
            <FormField :label="$t('lastname')" css="col-12 col-md-8 mb-3">
              <FormControl
                type="text"
                :placeholder="$t('lastname')"
                v-model="editedAccount.lastname"
                name="lastname"
              />
            </FormField>

            <div class="col-12 col-md-8">
              <div class="actions d-flex mt-4">
                <button class="btn btn-primary btn-medium ms-auto" type="submit">
                  {{ $t('changePassword.submitButton') }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <CustomToast
      :show="toastVisible"
      type="success"
      :title="$t('Success')"
      :description="toastMessage"
      id="updated-site-toast"
    ></CustomToast>
    <CustomToast
      :show="toastErrorVisible"
      type="error"
      :title="$t('Error')"
      :description="$t('Name and lastname are mandatory')"
      id="updated-error-site-toast"
    ></CustomToast>
  </Teleport>
</template>
