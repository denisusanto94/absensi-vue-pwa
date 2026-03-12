<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="toast.show"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
    >
      <div
        :class="[
          'rounded-2xl shadow-2xl p-4 border backdrop-blur-xl flex items-center space-x-3',
          toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 
          toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 
          'bg-indigo-500/90 border-indigo-400 text-white'
        ]"
      >
        <div class="flex-shrink-0">
          <svg v-if="toast.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="font-semibold text-sm">{{ toast.message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useToastStore } from '@/store/toast'
const toast = useToastStore()
</script>
