<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    
    <div class="flex">
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="isSidebarOpen"
          class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16 lg:static lg:translate-x-0"
        >
          <div class="flex flex-col h-full">
            <nav class="flex-1 px-4 py-6 space-y-1">
              <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                :class="{ 'bg-primary-50 text-primary-700 font-medium': isActive(item.path) }"
                @click="closeSidebarOnMobile"
              >
                <component :is="item.icon" class="w-5 h-5 mr-3" />
                {{ item.label }}
              </router-link>
            </nav>
            
            <div class="p-4 border-t border-gray-200">
              <div class="bg-primary-50 rounded-lg p-4">
                <p class="text-sm text-primary-800 font-medium">Tips</p>
                <p class="text-xs text-primary-600 mt-1">
                  Pastikan GPS aktif saat melakukan absensi
                </p>
              </div>
            </div>
          </div>
        </aside>
      </transition>
      
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        @click="isSidebarOpen = false"
      />
      
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
    
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden safe-area-bottom">
      <div class="flex justify-around py-2">
        <router-link
          v-for="item in mobileMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center px-3 py-2 text-gray-500"
          :class="{ 'text-primary-600': isActive(item.path) }"
        >
          <component :is="item.icon" class="w-6 h-6" />
          <span class="text-xs mt-1">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const isSidebarOpen = ref(false)

const DashboardIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ])
}

const ScanIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' })
  ])
}

const CalendarIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ])
}

const menuItems = [
  { path: '/user/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/user/scan-absen', label: 'Scan Absen', icon: ScanIcon },
  { path: '/user/pengajuan-cuti', label: 'Pengajuan Cuti', icon: CalendarIcon }
]

const mobileMenuItems = menuItems

const isActive = (path) => {
  return route.path === path
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
