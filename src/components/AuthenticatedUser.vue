<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApplicationStore } from '@/stores/application'

import BaseAssetIcon from '@/components/BaseAssetIcon.vue'
// import BaseIcon from '@/components/BaseIcon.vue'
// import profile from '@/assets/icons/svgs/profile.svg'
// import key from '@/assets/icons/svgs/key.svg'
import mail from '@/assets/icons/svgs/mail.svg'
import logout from '@/assets/icons/svgs/logout.svg'
// import EditProfileModal from '@/components/profile/EditProfileModal.vue'
// import ChangePasswordModal from '@/components/profile/ChangePasswordModal.vue'
import UserAvatarImage from './UserAvatarImage.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const logOut = () => {
  authStore.logout()
  router.push('/login')
}

const organizationId = ref('')
organizationId.value = route.params.organizationId as string

const onlyPart0 = (email: string) => {
  return email && email.includes('@') ? email.split('@')[0] : email
}

const userText = computed(() =>
  authStore ? (authStore.userName ? authStore.userName : onlyPart0(authStore.userEmail)) : ''
)
</script>

<template>
  <div class="d-flex dropdown zms-3">
    <a
      class="d-flex dropdown-toggle"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <UserAvatarImage
        :bordered="false"
        :size="24"
        class="me-0 me-md-3"
        v-if="authStore"
        :name="userText"
        :url="authStore.pictureUrl"
      ></UserAvatarImage>

      <span class="d-none d-md-block user-name">
        {{ userText }}
      </span>

      <svg
        class="arrow ms-0 ms-md-1 mt-1"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.99997 12.6007C9.89052 12.6008 9.78213 12.5793 9.68102 12.5374C9.57991 12.4955 9.48808 12.434 9.41081 12.3565L5.87521 8.82139C5.71895 8.66512 5.63116 8.45318 5.63116 8.23219C5.63117 8.0112 5.71895 7.79926 5.87522 7.643C6.03148 7.48674 6.24342 7.39895 6.46441 7.39895C6.6854 7.39895 6.89734 7.48674 7.05361 7.643L9.99997 10.5889L12.9463 7.64298C13.1026 7.48672 13.3145 7.39893 13.5355 7.39893C13.7565 7.39893 13.9685 7.48671 14.1247 7.64298C14.281 7.79924 14.3688 8.01118 14.3688 8.23217C14.3688 8.45316 14.281 8.6651 14.1247 8.82136L10.5891 12.3565C10.5119 12.434 10.42 12.4955 10.3189 12.5374C10.2178 12.5793 10.1094 12.6008 9.99997 12.6007Z"
          fill="#757575"
        />
      </svg>
    </a>

    <ul class="dropdown-menu">
      <li class="email">
        <RouterLink class="dropdown-item clickable" to="/account/profile">
          <BaseAssetIcon :icon="mail"></BaseAssetIcon>
          {{ $t('profile-details') }}
        </RouterLink> 
      </li>
      <li class="sep"></li>
      <li>
        <a class="dropdown-item clickable" @click="logOut">
          <BaseAssetIcon :icon="logout"></BaseAssetIcon>
          {{ $t('log-out') }}
        </a>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.dropdown-menu {
  border-radius: 8px;
  background: var(--neutral-ligth, #fff);
  /* Shadow/Neutral/Strong */
  box-shadow: 0px 8px 12px 0px rgba(111, 120, 134, 0.3) !important;
  border: 0;
  margin-top: 10px;
}

.dropdown-toggle {
  color: var(--text-default-800, #0e0f11);
  color: #8891a0;

  /* Text/Headline Semibold */
  font-size: 16px;
  font-family: Athletics;
  font-weight: 600;
  line-height: 20px;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-toggle:hover {
  color: var(--text-default-800, #0e0f11);
}

.dropdown-toggle:hover svg path,
.dropdown-toggle:hover svg circle {
  stroke: #0e0f11 !important;
}

.user-logo {
  margin-right: 5px;
  margin-top: 2px;
}

.dropdown-menu li {
  padding: 8px 16px;
}

.dropdown-menu li:hover {
  background: var(--secondary-100, #edeef3);
}

.dropdown-menu li:hover a {
  background: var(--secondary-100, #edeef3);
}

.dropdown-menu li a {
  padding: 0;
  color: #0e0f11;

  /* Text/Headline Regular */
  font-size: 16px;
  font-family: Athletics;
  line-height: 20px;
  font-weight: 400;
}

.dropdown-item img {
  margin-right: 5px;
}

.dropdown-menu li.sep {
  background: #edeef3;
  height: 1px;
  padding: 0;
  margin: 6px 0;
}
a .user-name,
.user-name {
  text-decoration: none !important;
  color: var(--gray-0270, #757575);
  font-family: Athletics;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
}
.notifications {
  padding-top: 5px;
  margin-right: 1rem;
}
.circle-notifications {
  background-color: #0450cd;
  color: #fff;
  border-radius: 50px;
  font-size: 10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.end-9px {
  right: -9px !important;
}
.bordered {
  border: 2px solid #8891a0;
  border-radius: 50%;
}
.clickable {
  cursor: pointer;
}
.dropdown-menu li.email a {
  color: var(--text-subdued-500, #8891a0);
  cursor: text;
}
/* .dropdown-menu li.email:hover {
  background-color: #fff;
}
.dropdown-menu li.email:hover a {
  background-color: #fff;
} */
.clickable{
  cursor: pointer!important;
}
</style>
