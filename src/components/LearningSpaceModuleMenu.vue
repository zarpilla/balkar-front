<template>
  <div class="module module-menu">
    <div
      v-for="module in space.content_modules"
      :key="`side.module.uid-${module.uid}`"
      class="d-block mb-1 module-item-block"
      :class="{ 'pb-3': moduleId?.toString() === module.uid.toString() }"
    >
      <RouterLink :to="`/space/${uid}/module/${module.uid}`" class="d-flex module-item">
        {{ module.menuTitle }}
        <svg
          class="ms-1 mt-module-item"
          :class="{ 'no-icon': module.completedPct !== 1 }"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_71_4297"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="18"
            height="19"
          >
            <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_71_4297)">
            <path
              d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488Z"
              fill="#44B08E"
            />
          </g>
        </svg>

        <svg
          class="ms-auto"
          v-if="moduleId?.toString() === module.uid.toString() && false"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_71_4675"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="25"
            height="25"
          >
            <rect x="0.493652" y="0.348755" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_71_4675)">
            <path
              d="M12.4937 11.1488L7.89365 15.7488L6.49365 14.3488L12.4937 8.34875L18.4937 14.3488L17.0937 15.7488L12.4937 11.1488Z"
              fill="#44B08E"
            />
          </g>
        </svg>

        <svg
          class="ms-auto"
          v-if="moduleId?.toString() !== module.uid.toString()"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_71_4718"
            style="mask-type: alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="25"
          >
            <rect y="0.348755" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_71_4718)">
            <path
              d="M12 15.7488L6 9.74875L7.4 8.34875L12 12.9488L16.6 8.34875L18 9.74875L12 15.7488Z"
              fill="#44B08E"
            />
          </g>
        </svg>
      </RouterLink>
      <div v-if="moduleId?.toString() === module.uid.toString()">
        <div
          v-for="(unit, j) in module.units"
          :key="`side.module.uid-${module.uid}-unit-${unit.uid}`"
        >
          <div class="d-flex">
            <div class="unit-icon-wrapper">
              <svg
                v-if="unit.completed"
                class="unit-icon"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_71_4297"
                  style="mask-type: alpha"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="18"
                  height="19"
                >
                  <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_71_4297)">
                  <path
                    d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488C"
                    fill="#44B08E"
                  />
                </g>
              </svg>
              <svg
                v-else
                class="unit-icon"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_71_4302"
                  style="mask-type: alpha"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="18"
                  height="19"
                >
                  <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_71_4302)">
                  <path
                    d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488ZM9 15.8488C10.675 15.8488 12.0938 15.2675 13.2563 14.105C14.4187 12.9425 15 11.5238 15 9.84875C15 8.17375 14.4187 6.75501 13.2563 5.5925C12.0938 4.43001 10.675 3.84875 9 3.84875C7.325 3.84875 5.90625 4.43001 4.74375 5.5925C3.58125 6.75501 3 8.17375 3 9.84875C3 11.5238 3.58125 12.9425 4.74375 14.105C5.90625 15.2675 7.325 15.8488 9 15.8488Z"
                    fill="#44B08E"
                  />
                </g>
              </svg>
            </div>
            <RouterLink
              :to="`/space/${uid}/module/${module.uid}/unit/${unit.uid}`"
              class="d-block unit side-unit"
            >
              <span class="unit-num pe-1">{{ j + 1 }}.</span>
              <span class="unit-name">{{ unit.title }}</span>
            </RouterLink>
          </div>
          <div
            v-if="
              unitId?.toString() === unit.uid.toString() && unit.lessons && unit.lessons.length > 0
            "
            class="mb-3"
          >
            <div
              v-for="lesson in unit.lessons"
              :key="`side.module.uid-${module.uid}-unit-${unit.uid}-lesson-${lesson.uid}`"
            >
              <div class="d-block mt-1 mb-1 ms-1">
                <RouterLink
                  :to="`/space/${uid}/module/${module.uid}/unit/${unit.uid}/lesson/${lesson.uid}`"
                  class="d-block lesson side-lesson"
                >
                  <div class="unit-icon-wrapper d-inline-block me-1">
                    <svg
                      v-if="lesson.completed"
                      class="unit-icon lesson-icon"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_71_4297"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="18"
                        height="19"
                      >
                        <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_71_4297)">
                        <path
                          d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488C"
                          fill="#44B08E"
                        />
                      </g>
                    </svg>
                    <svg
                      v-else
                      class="unit-icon lesson-icon"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_71_4302"
                        style="mask-type: alpha"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="18"
                        height="19"
                      >
                        <rect y="0.848755" width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_71_4302)">
                        <path
                          d="M7.95 13.2988L13.2375 8.01126L12.1875 6.96126L7.95 11.1988L5.8125 9.06125L4.7625 10.1113L7.95 13.2988ZM9 17.3488C7.9625 17.3488 6.9875 17.1519 6.075 16.7581C5.1625 16.3644 4.36875 15.83 3.69375 15.155C3.01875 14.48 2.48438 13.6863 2.09063 12.7738C1.69687 11.8613 1.5 10.8863 1.5 9.84875C1.5 8.81125 1.69687 7.83626 2.09063 6.92375C2.48438 6.01125 3.01875 5.2175 3.69375 4.5425C4.36875 3.8675 5.1625 3.33313 6.075 2.93938C6.9875 2.54563 7.9625 2.34875 9 2.34875C10.0375 2.34875 11.0125 2.54563 11.925 2.93938C12.8375 3.33313 13.6313 3.8675 14.3063 4.5425C14.9813 5.2175 15.5156 6.01125 15.9094 6.92375C16.3031 7.83626 16.5 8.81125 16.5 9.84875C16.5 10.8863 16.3031 11.8613 15.9094 12.7738C15.5156 13.6863 14.9813 14.48 14.3063 15.155C13.6313 15.83 12.8375 16.3644 11.925 16.7581C11.0125 17.1519 10.0375 17.3488 9 17.3488ZM9 15.8488C10.675 15.8488 12.0938 15.2675 13.2563 14.105C14.4187 12.9425 15 11.5238 15 9.84875C15 8.17375 14.4187 6.75501 13.2563 5.5925C12.0938 4.43001 10.675 3.84875 9 3.84875C7.325 3.84875 5.90625 4.43001 4.74375 5.5925C3.58125 6.75501 3 8.17375 3 9.84875C3 11.5238 3.58125 12.9425 4.74375 14.105C5.90625 15.2675 7.325 15.8488 9 15.8488Z"
                          fill="#44B08E"
                        />
                      </g>
                    </svg>
                  </div>

                  <span class="lesson-num pe-1">
                    <svg
                      class="rotate-90"
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 3.14879L1.4 7.74879L0 6.34879L6 0.348785L12 6.34879L10.6 7.74879L6 3.14879Z"
                        fill="#44B08E"
                      />
                    </svg>
                  </span>
                  <span class="lesson-name">{{ lesson.title }}</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  space: any
  uid: string
  moduleId?: number | string | null
  unitId?: number | string | null
}

defineProps<Props>()
</script>

<style scoped>
.module-item-block {
  border-bottom: 1px solid #898989;
}
.unit {
  margin-left: 5px;
}
a .unit-name {
  text-decoration: none !important;
}

.module-item {
  color: var(--Green, #44b08e);

  /* Sidebar - Module */
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 110%; /* 16.5px */
  line-height: 25px;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-top: 20px;
  margin-bottom: 20px;
}

.module-item.router-link-exact-active {
  text-decoration: underline!;
}

a.side-unit {
  color: #797979 !important;

  /* Sidebar - Sections L1 */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
  text-decoration: none !important;
  margin-bottom: 15px;
  line-height: 19px;
}
.side-unit .topic-name {
  text-decoration: none;
  font-weight: 400;
  line-height: 24px;
}
a.side-unit.router-link-exact-active .unit-name {
  text-decoration: underline !important;
  color: var(--Black, #000) !important;
}
a.side-unit.router-link-exact-active .unit-num {
  text-decoration: none !important;
  color: var(--Black, #000) !important;
}
@media (min-width: 1024px) {
  .module-menu {
    position: sticky;
    top: 0;
    overflow-y: auto;
    padding-right: 15px;
  }
}
.lesson.side-lesson {
  color: var(--Dark-grey, #797979);

  /* Sidebar - Sections L1 */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
  padding-left: 16px;
}
.lesson-name {
  text-decoration: none;
}
.lesson.router-link-exact-active {
  color: #000;
}
.lesson.router-link-exact-active .lesson-name {
  text-decoration: underline !important;
  color: var(--Black, #000) !important;
}
.lesson.router-link-exact-active .lesson-num {
  text-decoration: none !important;
  color: var(--Black, #000) !important;
}
.lesson-num svg {
  margin-top: -2px;
}
.lesson-num svg path {
  fill: #797979 !important;
}
.router-link-exact-active .lesson-num svg path {
  fill: var(--Black, #000) !important;
}

.rotate-90 {
  transform: rotate(90deg);
}
.mt-module-item {
  margin-top: 3px;
}
.v-none {
  visibility: hidden;
}
.unit-icon {
  margin-top: -8px;
}
.lesson-icon {
  margin-top: -3px;
  margin-right: 3px;
}
.no-icon path {
  fill: #fff !important;
}
</style>
