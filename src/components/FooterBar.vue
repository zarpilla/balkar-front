<script setup lang="ts"></script>

<template>
  <footer class="footer">
    <div class="d-flex container pt-4 pb-4">
      <RouterLink class="me-5" to="/">
        <img class="img-1" src="@/assets/logo.svg" alt="Balkar" />
      </RouterLink>
      <a class="ms-50" href="https://resilience.earth" target="_blank">
        <img class="img-2" src="@/assets/resilience.svg" alt="Resilience Earth" />
      </a>
    </div>
  </footer>
</template>
<style scoped>
footer {
  background: #f3c857;  
}
.img-1 {
  height: 68px;
}

.img-2 {
  height: 62px;
}
</style>
