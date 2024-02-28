<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApplicationStore } from '@/stores/application'
import { useI18n } from 'vue-i18n'
import { Api } from '@/service/api'
const { t, locale, availableLocales } = useI18n()

const localeText = computed(() => (locale.value === 'en' ? 'EN' : 'CA'))

const setLocale = (loc: string) => {
  locale.value = loc
  localStorage.setItem('locale', loc)
}
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
      <!-- <img class="me-md-1" src="@/assets/images/language.svg" /> -->

      <svg class="me-md-1" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="#757575" d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>

      <span class="d-none d-md-block user-name">
        {{ localeText }}
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
    </span>

    <ul class="dropdown-menu">
      <li class="locale" v-for="loc in availableLocales" :key="loc">
        <span class="text-uppercase" @click="setLocale(loc)">{{ loc }}</span>
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

.locale{
  color: #0e0f11;
  cursor: pointer;
}
.locale span{
  display: block;
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
.clickable {
  cursor: pointer !important;
}
</style>
