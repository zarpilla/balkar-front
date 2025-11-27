<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Safe translation function with fallbacks
const safeTranslation = (key: string, fallback: string = '') => {
  try {
    const i18n = useI18n()
    
    // Check if the translation key exists
    if (!i18n.te(key)) {
      return fallback
    }
    
    // Get the raw translation without processing linked messages
    const messages = i18n.getLocaleMessage(i18n.locale.value)
    const rawTranslation = messages[key]
    
    if (rawTranslation && rawTranslation !== key) {
      return rawTranslation
    }
    
    return fallback
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error)
    return fallback
  }
}
</script>

<template>
  <footer class="footer pt-5 pb-5" >
    <div class="d-flex container pt-4 pb-4">
      <div class="row w-auto w-md-100 pt-5 pb-5">
        <div class="col-12 col-md-3 text-center text-md-start mb-4 mb-md-0">
          <RouterLink to="/">
            <img class="img-1" src="@/assets/logo.svg" alt="" />
          </RouterLink>
        </div>
        <div class="col-12 col-md-3 text-center text-md-start mb-4 mb-md-0">
          <a class="ms-50" href="#" target="_blank">
            <img class="img-2" src="@/assets/logo-2.svg" alt="" />
          </a>
        </div>
        <div class="col-12 col-md-3 text-center text-md-start mb-4 mb-md-0">
          <a class="ms-50" href="#" target="_blank">
            <img class="img-2" src="@/assets/logo-3.svg" alt="" />
          </a>
        </div>
        <div class="col-12 col-md-3 text-center text-md-start mb-4 mb-md-0">
          
          <div class="footer-contact">
            <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_956_662"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="22"
              height="22"
            >
              <rect width="22" height="22" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_956_662)">
              <path
                d="M3.66683 18.3334C3.16266 18.3334 2.73107 18.1539 2.37204 17.7949C2.01301 17.4358 1.8335 17.0042 1.8335 16.5001V5.50008C1.8335 4.99591 2.01301 4.56432 2.37204 4.20529C2.73107 3.84626 3.16266 3.66675 3.66683 3.66675H18.3335C18.8377 3.66675 19.2693 3.84626 19.6283 4.20529C19.9873 4.56432 20.1668 4.99591 20.1668 5.50008V16.5001C20.1668 17.0042 19.9873 17.4358 19.6283 17.7949C19.2693 18.1539 18.8377 18.3334 18.3335 18.3334H3.66683ZM11.0002 11.9167L3.66683 7.33341V16.5001H18.3335V7.33341L11.0002 11.9167ZM11.0002 10.0834L18.3335 5.50008H3.66683L11.0002 10.0834ZM3.66683 7.33341V5.50008V16.5001V7.33341Z"
                fill="#2C3036"
              />
            </g>
          </svg>
            {{ safeTranslation('footer-contact', 'Contact') }}
          </div>
          <div class="footer-contact-email">
            {{ safeTranslation('footer-contact-email', 'info@example.com') }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
footer { 
  position: relative;
  background-color: #fbf9f3;
  width: 100%;
}

footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('@/assets/bg-footer.png') no-repeat center center;
  background-size: cover;
  opacity: 0.25;
  z-index: 0;
}

footer > * {
  position: relative;
  z-index: 1;
}
.img-1 {
  height: 48px;
}

.img-2 {
  height: 48px;
}
.footer-contact {
  margin-top: 16px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  color: #2c3036;
}
.footer-contact-email {
  margin-top: 8px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: #2c3036;

  text-decoration: underline;
}
.w-md-100 {
  @media screen and (min-width: 768px) {
    width: 100%!important;    
  }
}
</style>
