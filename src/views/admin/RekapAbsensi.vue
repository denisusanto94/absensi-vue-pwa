<template>
  <div>
    <h1 class="page-title">Rekap Absensi</h1>
    
    <div class="card mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
          <input
            v-model="filters.endDate"
            type="date"
          class="input"
          />
        </div>
        <div class="flex items-end">
          <BaseButton variant="primary" @click="loadData" :loading="loading" class="w-full">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Filter
          </BaseButton>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ stats.totalPresent }}</p>
        <p class="text-sm text-gray-500">Total Hadir</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-red-600">{{ stats.totalAbsent }}</p>
        <p class="text-sm text-gray-500">Total Absen</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-yellow-600">{{ stats.totalLate }}</p>
        <p class="text-sm text-gray-500">Terlambat</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalOnLeave }}</p>
        <p class="text-sm text-gray-500">Cuti</p>
      </div>
    </div>
    
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Data Absensi</h2>
        <BaseButton variant="secondary" size="sm" @click="exportData">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </BaseButton>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
      
      <div v-else-if="attendanceData.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500">Tidak ada data absensi</p>
      </div>
      
      <div v-else class="overflow-x-auto -mx-6 px-6">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th class="py-3 px-4">Tanggal</th>
              <th class="py-3 px-4">Nama</th>
              <th class="py-3 px-4">Check In</th>
              <th class="hidden md:table-cell py-3 px-4">Check Out</th>
              <th class="hidden lg:table-cell py-3 px-4">Durasi</th>
              <th class="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in attendanceData"
              :key="record._id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-4 whitespace-nowrap">
                <p class="font-bold text-gray-900 text-xs">{{ formatDate(record.date) }}</p>
                <p class="text-[9px] text-gray-400 uppercase tracking-tighter">{{ getDayName(record.date) }}</p>
              </td>
              <td class="py-4 px-4">
                <p class="text-xs font-semibold text-gray-900 truncate max-w-[100px]">{{ record.userName || 'Unknown' }}</p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <p class="text-xs font-bold text-gray-900">{{ formatTime(record.checkIn?.time) }}</p>
                <p class="md:hidden text-[9px] text-gray-400 uppercase tracking-tighter">Out: {{ formatTime(record.checkOut?.time) || '-' }}</p>
              </td>
              <td class="hidden md:table-cell py-4 px-4 text-xs text-gray-900 font-medium">
                {{ formatTime(record.checkOut?.time) || '-' }}
              </td>
              <td class="hidden lg:table-cell py-4 px-4 text-xs text-gray-600">
                {{ record.checkIn && record.checkOut ? formatDuration(record.checkIn.time, record.checkOut.time) : '-' }}
              </td>
              <td class="py-4 px-4 text-right whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter',
                    getStatusClass(record)
                  ]"
                >
                  {{ getStatusText(record) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { usersDB } from '@/api/database'
import { formatDate, formatTime, formatDuration, getDayName } from '@/utils/formatters'
import BaseButton from '@/components/BaseButton.vue'

const absensiStore = useAbsensiStore()

const loading = ref(true)
const attendanceData = ref([])

const today = new Date()
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

const filters = reactive({
  startDate: firstDayOfMonth.toISOString().split('T')[0],
  endDate: today.toISOString().split('T')[0]
})

const stats = reactive({
  totalPresent: 0,
  totalAbsent: 0,
  totalLate: 0,
  totalOnLeave: 0
})

const getStatusClass = (record) => {
  if (!record.checkIn) return 'bg-red-100 text-red-800'
  
  const checkInHour = new Date(record.checkIn.time).getHours()
  if (checkInHour >= 9) return 'bg-yellow-100 text-yellow-800'
  
  if (record.checkOut) return 'bg-green-100 text-green-800'
  
  return 'bg-blue-100 text-blue-800'
}

const getStatusText = (record) => {
  if (!record.checkIn) return 'Absen'
  
  const checkInHour = new Date(record.checkIn.time).getHours()
  if (checkInHour >= 9) return 'Terlambat'
  
  if (record.checkOut) return 'Hadir'
  
  return 'Aktif'
}

const loadData = async () => {
  loading.value = true
  
  try {
    const users = await usersDB.find({
      selector: { role: { $in: ['user', 'admin'] } }
    })
    
    const userMap = {}
    users.docs.forEach(user => {
      userMap[user._id] = user.name
    })
    
    const attendance = await absensiStore.fetchAllAttendance({
      startDate: filters.startDate,
      endDate: filters.endDate
    })
    
    attendanceData.value = attendance.map(record => ({
      ...record,
      userName: userMap[record.userId] || 'Unknown'
    })).sort((a, b) => new Date(b.date) - new Date(a.date))
    
    let late = 0
    attendanceData.value.forEach(record => {
      if (record.checkIn) {
        const checkInHour = new Date(record.checkIn.time).getHours()
        if (checkInHour >= 9) late++
      }
    })
    
    stats.totalPresent = attendanceData.value.filter(r => r.checkIn).length
    stats.totalLate = late
    stats.totalAbsent = 0
    stats.totalOnLeave = 0
  } catch (error) {
    console.error('Error loading attendance data:', error)
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  const headers = ['Tanggal', 'Nama', 'Check In', 'Check Out', 'Durasi', 'Status']
  const rows = attendanceData.value.map(record => [
    formatDate(record.date),
    record.userName,
    formatTime(record.checkIn?.time),
    formatTime(record.checkOut?.time),
    record.checkIn && record.checkOut ? formatDuration(record.checkIn.time, record.checkOut.time) : '-',
    getStatusText(record)
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `rekap-absensi-${filters.startDate}-${filters.endDate}.csv`
  link.click()
}

onMounted(() => {
  loadData()
})
</script>
