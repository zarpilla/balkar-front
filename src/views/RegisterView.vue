<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { checkEmpty, checkIsEmail } from '@/utils/helper'
import { useI18n } from 'vue-i18n'
import { Api } from '@/service/api'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const { t } = useI18n()

const loading = ref(false)

</script>

<template>
  <LayoutGuest :loaded="!loading" css="col-lg-8 offset-lg-2 place-items-center">
    <div v-if="!loading" class="zbg-white p-4">
      <RegisterForm button-text="register"></RegisterForm>      
    </div>
  </LayoutGuest>
</template>
<style scoped>
.text-error {
  color: #f57356;
  font-size: 16px;
  margin-top: 10px;
}
</style>
