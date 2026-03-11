<template>
  <div>
    <h1 class="page-title">Dashboard Admin</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalEmployees }}</p>
            <p class="text-sm text-gray-500">Total Karyawan</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.presentToday }}</p>
            <p class="text-sm text-gray-500">Hadir Hari Ini</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.absentToday }}</p>
            <p class="text-sm text-gray-500">Tidak Hadir</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingLeave }}</p>
            <p class="text-sm text-gray-500">Cuti Pending</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Absensi Hari Ini</h2>
          <router-link to="/admin/rekap-absensi" class="text-primary-600 text-sm font-medium hover:text-primary-700">
            Lihat Semua
          </router-link>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
        
        <div v-else-if="todayAttendance.length === 0" class="text-center py-8">
          <p class="text-gray-500">Belum ada data absensi hari ini</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="record in todayAttendance.slice(0, 5)"
            :key="record._id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-700 font-medium text-sm">
                  {{ getInitials(record.userName) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ record.userName || 'Unknown' }}</p>
                <p class="text-sm text-gray-500">
                  In: {{ formatTime(record.checkIn?.time) }}
                  <span v-if="record.checkOut"> | Out: {{ formatTime(record.checkOut.time) }}</span>
                </p>
              </div>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                record.checkOut ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              ]"
            >
              {{ record.checkOut ? 'Selesai' : 'Aktif' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Pengajuan Cuti Pending</h2>
          <router-link to="/admin/approval-cuti" class="text-primary-600 text-sm font-medium hover:text-primary-700">
            Lihat Semua
          </router-link>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
        
        <div v-else-if="pendingLeaveRequests.length === 0" class="text-center py-8">
          <p class="text-gray-500">Tidak ada pengajuan cuti pending</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="request in pendingLeaveRequests.slice(0, 5)"
            :key="request._id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900">{{ request.userName || 'Unknown' }}</p>
              <p class="text-sm text-gray-500">
                {{ getLeaveTypeLabel(request.type) }} - {{ formatDate(request.startDate) }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="handleApprove(request._id)"
                class="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                title="Setujui"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="handleReject(request._id)"
                class="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                title="Tolak"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { usersDB } from '@/api/database'
import { formatTime, formatDate, getLeaveTypeLabel } from '@/utils/formatters'

const absensiStore = useAbsensiStore()

const loading = ref(true)
const todayAttendance = ref([])
const pendingLeaveRequests = ref([])

const stats = reactive({
  totalEmployees: 0,
  presentToday: 0,
  absentToday: 0,
  pendingLeave: 0
})

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const loadDashboardData = async () => {
  loading.value = true
  
  try {
    const users = await usersDB.find({
      selector: { role: 'user', isActive: true }
    })
    stats.totalEmployees = users.docs.length
    
    const today = new Date().toISOString().split('T')[0]
    const attendance = await absensiStore.fetchAllAttendance({ date: today })
    
    const userMap = {}
    for (const user of users.docs) {
      userMap[user._id] = user.name
    }
    
    todayAttendance.value = attendance.map(record => ({
      ...record,
      userName: userMap[record.userId] || 'Unknown'
    }))
    
    stats.presentToday = attendance.length
    stats.absentToday = Math.max(0, stats.totalEmployees - stats.presentToday)
    
    const leaveRequests = await absensiStore.fetchAllLeaveRequests('pending')
    
    pendingLeaveRequests.value = leaveRequests.map(request => ({
      ...request,
      userName: userMap[request.userId] || 'Unknown'
    }))
    
    stats.pendingLeave = leaveRequests.length
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    loading.value = false
  }
}

const handleApprove = async (requestId) => {
  const result = await absensiStore.updateLeaveRequestStatus(requestId, 'approved')
  if (result.success) {
    await loadDashboardData()
  }
}

const handleReject = async (requestId) => {
  const result = await absensiStore.updateLeaveRequestStatus(requestId, 'rejected')
  if (result.success) {
    await loadDashboardData()
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
