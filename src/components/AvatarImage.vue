<script setup lang="ts">
import { computed } from 'vue'
import { stringToColor } from '@/utils/colorsFunctions'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: null
  },
  size: {
    type: Number,
    default: 32
  },
  bordered: Boolean
})

const name = computed(() => props.name)

const firstLetterOfName = computed(() => {
  return name.value ? name.value.charAt(0).toUpperCase() : ''
})

const apiBase = import.meta.env.VITE_API_BASE

const urlWithApiBase = computed(() => {
  return props.url ? (( props.url.startsWith(apiBase) || props.url.includes(';base64') ? '' : apiBase) + props.url) : ''
})


</script>

<template>
  <div>
    <img v-if="url" :src="urlWithApiBase" :alt="name" :class="`rounded mr s-${props.size}`" />
    <div class="icon mr" :style="`height:${size}px;width:${size}px;background-color:${stringToColor(name || 'x')}`" v-else>

      <div class="first-letter" :style="`font-size: ${props.size / 2.5}px; line-height: ${props.size}px`">{{ firstLetterOfName }}</div>
      <!-- <svg
        class="user-logo"
        :width="size"
        :height="size"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          v-if="bordered"
          cx="16"
          cy="16"
          r="15"
          fill="#EBEAF0"
          stroke="#8891A0"
          stroke-width="2"
        />
        <g clip-path="url(#clip0_76_8029)">
          <path
            d="M16.0001 15.1667C17.841 15.1667 19.3334 13.6743 19.3334 11.8333C19.3334 9.99238 17.841 8.5 16.0001 8.5C14.1591 8.5 12.6667 9.99238 12.6667 11.8333C12.6667 13.6743 14.1591 15.1667 16.0001 15.1667Z"
            stroke="#8891A0"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11 23.5V21.8333C11 20.9493 11.3512 20.1014 11.9763 19.4763C12.6014 18.8512 13.4493 18.5 14.3333 18.5H17.6667C18.5507 18.5 19.3986 18.8512 20.0237 19.4763C20.6488 20.1014 21 20.9493 21 21.8333V23.5"
            stroke="#8891A0"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_76_8029">
            <rect width="20" height="20" fill="white" transform="translate(6 6)" />
          </clipPath>
        </defs>
      </svg> -->
    </div>
  </div>
</template>

<style scoped>
.rounded {
  border-radius: 40px !important;
}

.icon {
  border-radius: 50%;
  background: var(--secondary-100, #edeef3);
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 20px;
}

.icon img {
  transform: scale(0.5);
}

.s-10 {
  width: 10px;
  height: 10px;
  line-height: 10px;
}

.s-20 {
  width: 20px;
  height: 20px;
  line-height: 20px;
}

.s-24 {
  width: 24px;
  height: 24px;
  line-height: 24px;
  vertical-align: -2px;
}

.s-30 {
  width: 30px;
  height: 30px;
}

.s-32 {
  width: 32px;
  height: 32px;
}

.s-48 {
  width: 48px;
  height: 48px;
  line-height: 48px;
  font-size: 30px;
}

.s-56 {
  width: 56px;
  height: 56px;
  line-height: 56px;
  font-size: 30px;
}

.s-96 {
  width: 96px;
  height: 96px;
  line-height: 96px;
  font-size: 30px;
}
.first-letter{
  text-decoration: none;
  font-weight: bold;
  color: var(--Nabiu, #020034);
  text-transform: uppercase;
  color: #fff;
}
</style>
