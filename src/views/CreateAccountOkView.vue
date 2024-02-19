<script setup lang="ts">
import LayoutGuest from '@/layouts/LayoutGuest.vue'
</script>

<template>
  <LayoutGuest :loaded="true" css="col-lg-6 offset-lg-3 place-items-center">
    <div>
      <h3 class="mt-5 mb-5">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="#F06500"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        Your request was sent successfully!
      </h3>

      <h4>Please, check your email</h4>
      <div class="text mb-5 pb-5">
        We’ve sent you an email with your username and instructions to 
        <RouterLink to="/login">
          log in.
        </RouterLink>
        
        
      </div>

      <div class="pt-4 questions">
        Do you have questions?
      </div>

      <div class="mt-2 questions-txt">
        If you have doubts or you have not received the email, please call us:
<a href="tel:01449 360 0345">01449 360 0345</a> or <a href="tel:01223 976 543">01223 976 543</a>
      </div>
    </div>
  </LayoutGuest>
</template>
<style scoped>
h4{
  color: var(--gray-02100, #0A0A0A);

/* Heading/SF Pro/S/Bold */
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: 28px; /* 140% */
}
.text{
  color: var(--gray-02100, #0A0A0A);

/* Body Text/SF Pro/16/Regular */
font-family: Athletics;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 24px; /* 150% */
}
.questions{
  color: var(--gray-02100, #0A0A0A);

/* Body Text/SF Pro/16/Medium */
font-family: Athletics;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 24px; /* 150% */
border-top: 1px solid #C2C2C2;

}
.questions-txt{
  color: var(--gray-02100, #0A0A0A);

/* Body Text/SF Pro/16/Regular */
font-family: Athletics;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 24px; /* 150% */
}
</style>

