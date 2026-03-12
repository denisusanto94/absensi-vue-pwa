<template>
  <router-view />
  <BaseToast />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { createIndexes, startAllSync } from '@/api/database'
import { initDefaultAdmin } from '@/api/auth'
import BaseToast from '@/components/BaseToast.vue'

const userStore = useUserStore()

onMounted(async () => {
  await createIndexes()
  await initDefaultAdmin()
  
  userStore.initSession()
  
  if (userStore.isLoggedIn) {
    startAllSync()
  }
})
</script>
