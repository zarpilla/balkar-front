<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AvatarImage from './AvatarImage.vue'

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
  authStore ? (authStore.name ? authStore.name + ' ' + authStore.lastname : onlyPart0(authStore.userEmail)) : ''
)
</script>

<template>
  <div class="d-flex dropdown zms-3">
    <span
      class="d-flex dropdown-toggle"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <AvatarImage
        :bordered="false"
        :size="40"
        class="me-0 me-md-3 s-40"
        v-if="authStore"
        :name="userText"
        :url="authStore.pictureUrl"
      ></AvatarImage>

      <span class="d-none d-md-block user-name">
        {{ userText }}
      </span>

      <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="mask0_64_2174" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="41">
    <rect y="0.688797" width="40" height="40" fill="#D9D9D9"/>
  </mask>
  <g mask="url(#mask0_64_2174)">
    <path d="M5 11.8V9.02213H35V11.8H5ZM5 32.3555V29.5775H35V32.3555H5ZM5 22.0775V19.3H35V22.0775H5Z" fill="#1C1B1F"/>
  </g>
</svg>
    </span>

    <ul class="dropdown-menu">
      <li class="email">
        <RouterLink class="dropdown-item clickable" to="/dashboard">
          {{ $t('My courses') }}
        </RouterLink> 
      </li>
      <li class="sep"></li>
      <li class="email">
        <RouterLink class="dropdown-item clickable" to="/account/profile">
          {{ $t('profile-details') }}
        </RouterLink> 
      </li>
      <li class="sep"></li>
      <li>
        <a class="dropdown-item clickable" @click="logOut">
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
  color: var(--text-default-800, #000000);
  color: #8891a0;

  /* Text/Headline Semibold */
  font-size: 16px;
  font-family: Inter;
  font-weight: 600;
  line-height: 20px;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-toggle:hover {
  color: var(--text-default-800, #000000);
}

.dropdown-toggle:hover svg path,
.dropdown-toggle:hover svg circle {
  stroke: #000000 !important;
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
  color: #000000;

  /* Text/Headline Regular */
  font-size: 16px;
  font-family: Inter;
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
  color: #000;
font-family: "Inter";
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 110%; /* 17.6px */
letter-spacing: 0.32px;
text-transform: uppercase;

padding-top: 12px;
margin-right: 36px;
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
/* .dropdown-menu li.email:hover {
  background-color: #fff;
}
.dropdown-menu li.email:hover a {
  background-color: #fff;
} */
.clickable{
  cursor: pointer!important;
}
.menu-icon{
  vertical-align: -6px;
}
</style>
