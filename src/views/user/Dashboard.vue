<template>
  <div class="pb-20 lg:pb-0">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ greeting }}, {{ userName }}!</h1>
      <p class="text-gray-500">{{ formattedToday }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Status Hari Ini</h2>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              statusBadgeClass
            ]"
          >
            {{ statusText }}
          </span>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Check In</p>
                <p class="font-semibold text-gray-900">{{ checkInTime }}</p>
              </div>
            </div>
            <span v-if="hasCheckedIn" class="text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-500">Check Out</p>
                <p class="font-semibold text-gray-900">{{ checkOutTime }}</p>
              </div>
            </div>
            <span v-if="hasCheckedOut" class="text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
        </div>
        
        <div class="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start">
          <svg class="w-5 h-5 text-indigo-600 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-indigo-800">
            Lakukan absensi di halaman utama aplikasi.
          </p>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistik Bulan Ini</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-3xl font-bold text-green-600">{{ stats.present }}</p>
            <p class="text-sm text-green-700">Hari Hadir</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4">
            <p class="text-3xl font-bold text-red-600">{{ stats.absent }}</p>
            <p class="text-sm text-red-700">Tidak Hadir</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <p class="text-3xl font-bold text-yellow-600">{{ stats.late }}</p>
            <p class="text-sm text-yellow-700">Terlambat</p>
          </div>
          <div class="bg-blue-50 rounded-lg p-4">
            <p class="text-3xl font-bold text-blue-600">{{ stats.leave }}</p>
            <p class="text-sm text-blue-700">Cuti</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Riwayat Absensi</h2>
        <button class="text-primary-600 text-sm font-medium hover:text-primary-700">
          Lihat Semua
        </button>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p class="text-gray-500 mt-2">Memuat data...</p>
      </div>
      
      <div v-else-if="attendanceHistory.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500">Belum ada data absensi</p>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="record in attendanceHistory.slice(0, 5)"
          :key="record._id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <p class="font-medium text-gray-900">{{ formatDate(record.date) }}</p>
            <p class="text-sm text-gray-500">{{ getDayName(record.date) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">
              {{ formatTime(record.checkIn?.time) }} - {{ formatTime(record.checkOut?.time) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ record.checkIn && record.checkOut ? formatDuration(record.checkIn.time, record.checkOut.time) : '-' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useAbsensiStore } from '@/store/absensi'
import { getGreeting, formatDate, formatTime, formatDuration, getDayName } from '@/utils/formatters'

const userStore = useUserStore()
const absensiStore = useAbsensiStore()

const loading = ref(true)
const attendanceHistory = ref([])

const userName = computed(() => userStore.userName)
const greeting = computed(() => getGreeting())

const formattedToday = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const hasCheckedIn = computed(() => absensiStore.hasCheckedInToday)
const hasCheckedOut = computed(() => absensiStore.hasCheckedOutToday)

const checkInTime = computed(() => {
  const checkIn = absensiStore.todayAttendance?.checkIn
  return checkIn ? formatTime(checkIn.time) : '-'
})

const checkOutTime = computed(() => {
  const checkOut = absensiStore.todayAttendance?.checkOut
  return checkOut ? formatTime(checkOut.time) : '-'
})

const statusText = computed(() => {
  if (hasCheckedOut.value) return 'Selesai'
  if (hasCheckedIn.value) return 'Sedang Bekerja'
  return 'Belum Absen'
})

const statusBadgeClass = computed(() => {
  if (hasCheckedOut.value) return 'bg-green-100 text-green-800'
  if (hasCheckedIn.value) return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
})

const stats = ref({
  present: 0,
  absent: 0,
  late: 0,
  leave: 0
})

const calculateStats = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const workDays = []
  
  for (let d = new Date(firstDay); d <= today; d.setDate(d.getDate() + 1)) {
    const day = d.getDay()
    if (day !== 0 && day !== 6) {
      workDays.push(new Date(d).toISOString().split('T')[0])
    }
  }
  
  let present = 0
  let late = 0
  
  attendanceHistory.value.forEach(record => {
    if (workDays.includes(record.date)) {
      present++
      if (record.checkIn) {
        const checkInHour = new Date(record.checkIn.time).getHours()
        if (checkInHour >= 9) late++
      }
    }
  })
  
  const todayStr = today.toISOString().split('T')[0]
  const todayIsWorkDay = workDays.includes(todayStr)
  const workDaysUntilToday = workDays.filter(d => d < todayStr).length
  
  stats.value = {
    present,
    absent: Math.max(0, workDaysUntilToday - present),
    late,
    leave: 0
  }
}

onMounted(async () => {
  loading.value = true
  
  try {
    await absensiStore.fetchTodayAttendance()
    
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const endDate = now.toISOString().split('T')[0]
    
    attendanceHistory.value = await absensiStore.fetchAttendanceHistory(startDate, endDate)
    calculateStats()
  } catch (error) {
    console.error('Error loading dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>
