<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <button
            v-if="showMenuButton"
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="flex items-center ml-2 lg:ml-0">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span class="ml-2 text-lg font-semibold text-gray-900">Absensi</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center text-sm text-gray-600">
            <span class="font-medium">{{ userName }}</span>
            <span class="mx-2 text-gray-400">|</span>
            <span class="capitalize px-2 py-1 rounded-full text-xs font-medium"
              :class="roleClass">
              {{ userRole }}
            </span>
          </div>
          
          <div class="relative" ref="dropdownRef">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-700 font-medium text-sm">{{ userInitials }}</span>
              </div>
              <svg class="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              >
                <div class="px-4 py-2 border-b border-gray-100 sm:hidden">
                  <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ userRole }}</p>
                </div>
                
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

defineProps({
  showMenuButton: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-sidebar'])

const router = useRouter()
const userStore = useUserStore()

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const userName = computed(() => userStore.userName)
const userRole = computed(() => userStore.userRole)

const userInitials = computed(() => {
  const name = userName.value || ''
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const roleClass = computed(() => {
  return userRole.value === 'admin'
    ? 'bg-purple-100 text-purple-800'
    : 'bg-green-100 text-green-800'
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
