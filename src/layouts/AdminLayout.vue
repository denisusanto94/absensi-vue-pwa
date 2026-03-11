<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    
    <div class="flex">
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16 transform transition-transform duration-300 lg:translate-x-0 lg:static',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <div class="flex flex-col h-full">
          <div class="px-4 py-4 border-b border-gray-200">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          
          <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
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
            
            <div class="pt-4 mt-4 border-t border-gray-200">
              <span class="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User Menu
              </span>
              <router-link
                v-for="item in userMenuItems"
                :key="item.path"
                :to="item.path"
                class="flex items-center px-4 py-3 mt-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                :class="{ 'bg-primary-50 text-primary-700 font-medium': isActive(item.path) }"
                @click="closeSidebarOnMobile"
              >
                <component :is="item.icon" class="w-5 h-5 mr-3" />
                {{ item.label }}
              </router-link>
            </div>
          </nav>
          
          <div class="p-4 border-t border-gray-200">
            <div class="bg-purple-50 rounded-lg p-4">
              <p class="text-sm text-purple-800 font-medium">Admin Mode</p>
              <p class="text-xs text-purple-600 mt-1">
                Kelola karyawan dan data absensi
              </p>
            </div>
          </div>
        </div>
      </aside>
      
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        @click="isSidebarOpen = false"
      />
      
      <main class="flex-1 p-4 sm:p-6 lg:ml-0 overflow-x-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, h, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const isSidebarOpen = ref(false)

// Close sidebar on window resize if widening
const handleResize = () => {
  if (window.innerWidth >= 1024 && isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const DashboardIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' })
  ])
}

const UsersIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
  ])
}

const ChartIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
  ])
}

const ApprovalIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const ScanIcon = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' })
  ])
}

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/admin/manage-users', label: 'Kelola Karyawan', icon: UsersIcon },
  { path: '/admin/rekap-absensi', label: 'Rekap Absensi', icon: ChartIcon },
  { path: '/admin/approval-cuti', label: 'Approval Cuti', icon: ApprovalIcon }
]

const userMenuItems = []

const isActive = (path) => {
  return route.path === path
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}
</script>
