<script setup lang="ts"></script>

<template>
  <footer class="footer">
    <div class="d-flex container pt-4 pb-4">
      <RouterLink class="me-5" to="/">
        <img class="img-1" src="@/assets/logo.svg" alt="" />
      </RouterLink>
      <a class="ms-50" href="https://resilience.earth" target="_blank">
        <img class="img-2" src="@/assets/logo-2.svg" alt="" />
      </a>
    </div>
  </footer>
</template>
<style scoped>
footer {
  background: #f3c857;  
}
.img-1 {
  height: 48px;
}

.img-2 {
  height: 48px;
}
</style>
