<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="page-title mb-4 sm:mb-0">Management Absensi</h1>
      <BaseButton variant="primary" @click="openModal()">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Tambah Absensi Manual
      </BaseButton>
    </div>

    <div class="card mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cari Karyawan</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nama atau Email..."
              class="input pl-10"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="input"
            @change="loadData"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Akhir</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="input"
            @change="loadData"
          />
        </div>
        <div class="flex items-end">
          <BaseButton variant="secondary" @click="resetFilters" class="w-full">
            Reset
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-500">Memuat data absensi...</p>
      </div>

      <div v-else-if="attendanceData.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-slate-500">Tidak ada data absensi untuk kriteria ini</p>
      </div>

      <div v-else class="overflow-x-auto -mx-6 px-6">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th class="py-3 px-4">Karyawan</th>
              <th class="py-3 px-4">Tanggal</th>
              <th class="py-3 px-4">Check In</th>
              <th class="py-3 px-4">Check Out</th>
              <th class="py-3 px-4 text-center">Latitude</th>
              <th class="py-3 px-4 text-center">Longitude</th>
              <th class="py-3 px-4">Alamat</th>
              <th class="py-3 px-4">Kota/Kab</th>
              <th class="py-3 px-4">Kecamatan</th>
              <th class="py-3 px-4">Kelurahan</th>
              <th class="py-3 px-4 text-center">Kode Pos</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="record in filteredAttendance"
              :key="record._id"
              class="hover:bg-indigo-50/30 transition-colors group"
            >
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <span class="text-indigo-700 font-bold text-[10px]">
                      {{ getInitials(record.userName) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900 text-sm leading-none">{{ record.userName }}</p>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase">{{ record.department || 'No Dept' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <p class="text-xs font-medium text-slate-600">{{ formatDate(record.date) }}</p>
              </td>
              <td class="py-4 px-4">
                <p class="text-xs font-bold text-slate-900">{{ formatTime(record.checkIn?.time) }}</p>
              </td>
              <td class="py-4 px-4">
                <p class="text-xs font-bold text-slate-900">{{ formatTime(record.checkOut?.time) || '-' }}</p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap text-center">
                <p class="text-[10px] text-slate-500 font-mono">{{ record.checkIn?.location?.latitude?.toFixed(6) || '-' }}</p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap text-center">
                <p class="text-[10px] text-slate-500 font-mono">{{ record.checkIn?.location?.longitude?.toFixed(6) || '-' }}</p>
              </td>
              <td class="py-4 px-4 min-w-[200px]">
                <p class="text-[10px] text-slate-600 leading-tight line-clamp-2" :title="record.checkIn?.location?.alamat_lengkap">
                  {{ record.checkIn?.location?.alamat_lengkap || '-' }}
                </p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <p class="text-[10px] text-slate-600">{{ record.checkIn?.location?.kota || record.checkIn?.location?.kabupaten || '-' }}</p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <p class="text-[10px] text-slate-600">{{ record.checkIn?.location?.kecamatan || '-' }}</p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap">
                <p class="text-[10px] text-slate-600">{{ record.checkIn?.location?.kelurahan || '-' }}</p>
              </td>
              <td class="py-4 px-4 whitespace-nowrap text-center">
                <p class="text-[10px] text-slate-600">{{ record.checkIn?.location?.kode_pos || '-' }}</p>
              </td>
              <td class="py-4 px-4 text-center">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter',
                    getStatusClass(record)
                  ]"
                >
                  {{ getStatusText(record) }}
                </span>
              </td>
              <td class="py-4 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openModal(record)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                    title="Edit Absensi"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(record)"
                    class="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all"
                    title="Hapus Record"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="closeModal" />
          
          <div class="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle bg-white rounded-3xl shadow-2xl transform transition-all">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-slate-900">
                {{ editingRecord ? 'Edit Absensi' : 'Absensi Manual' }}
              </h3>
              <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="saveAttendance" class="space-y-4">
              <div v-if="!editingRecord">
                <label class="block text-sm font-semibold text-slate-700 mb-1">Pilih Karyawan</label>
                <select v-model="form.userId" class="input" required>
                  <option value="" disabled>Pilih Karyawan...</option>
                  <option v-for="user in allUsers" :key="user._id" :value="user._id">
                    {{ user.name }} ({{ user.department }})
                  </option>
                </select>
              </div>
              <div v-else class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Karyawan</p>
                <p class="font-bold text-slate-900">{{ editingRecord.userName }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Tanggal</label>
                <input v-model="form.date" type="date" class="input" :disabled="!!editingRecord" required />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Jam Masuk</label>
                  <input v-model="form.checkInTime" type="time" class="input" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Jam Keluar</label>
                  <input v-model="form.checkOutTime" type="time" class="input" />
                </div>
              </div>

              <div v-if="errorMsg" class="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
                {{ errorMsg }}
              </div>

              <div class="flex space-x-3 pt-6">
                <button type="button" @click="closeModal" class="flex-1 py-3 px-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
                  Batal
                </button>
                <BaseButton type="submit" variant="primary" :loading="saving" class="flex-1 py-3 rounded-2xl">
                  Simpan Data
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Delete Confirmation -->
    <teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 text-center">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteConfirm = false" />
          <div class="relative inline-block w-full max-w-sm p-8 bg-white rounded-3xl shadow-2xl">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Hapus Absensi?</h3>
            <p class="text-slate-500 mb-8">Data absensi <strong>{{ recordToDelete?.userName }}</strong> pada tanggal {{ formatDate(recordToDelete?.date) }} akan dihapus permanen.</p>
            <div class="flex space-x-3">
              <button @click="showDeleteConfirm = false" class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                Batal
              </button>
              <button @click="handleDelete" class="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { usersDB } from '@/api/database'
import { formatDate, formatTime, getDayName } from '@/utils/formatters'
import BaseButton from '@/components/BaseButton.vue'

const absensiStore = useAbsensiStore()
const loading = ref(false)
const saving = ref(false)
const attendanceData = ref([])
const allUsers = ref([])
const searchQuery = ref('')
const errorMsg = ref('')

const filters = reactive({
  startDate: '',
  endDate: new Date().toISOString().split('T')[0],
  userId: ''
})

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const editingRecord = ref(null)
const recordToDelete = ref(null)

const form = reactive({
  userId: '',
  date: new Date().toISOString().split('T')[0],
  checkInTime: '',
  checkOutTime: ''
})

const filteredAttendance = computed(() => {
  return attendanceData.value.filter(record => {
    const query = searchQuery.value.toLowerCase()
    return record.userName.toLowerCase().includes(query) || 
           record.department?.toLowerCase().includes(query)
  })
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusClass = (record) => {
  if (!record.checkIn) return 'bg-red-100 text-red-800'
  const time = new Date(record.checkIn.time)
  if (time.getHours() >= 9) return 'bg-yellow-100 text-yellow-800'
  return 'bg-emerald-100 text-emerald-800'
}

const getStatusText = (record) => {
  if (!record.checkIn) return 'N/A'
  const time = new Date(record.checkIn.time)
  if (time.getHours() >= 9) return 'Terlambat'
  return 'Tepat Waktu'
}

const loadData = async () => {
  loading.value = true
  try {
    const usersRes = await usersDB.find({ selector: { isActive: true } })
    allUsers.value = usersRes.docs
    const userMap = {}
    allUsers.value.forEach(u => userMap[u._id] = u)

    const attendance = await absensiStore.fetchAllAttendance({
      startDate: filters.startDate,
      endDate: filters.endDate
    })
    
    // Sort by date desc and then by name
    attendanceData.value = attendance.map(record => {
      const user = userMap[record.userId]
      return {
        ...record,
        userName: user?.name || 'Unknown',
        department: user?.department || '-'
      }
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('Error load data:', err)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  const today = new Date()
  const fiveDaysAgo = new Date()
  fiveDaysAgo.setDate(today.getDate() - 5)
  
  filters.startDate = fiveDaysAgo.toISOString().split('T')[0]
  filters.endDate = today.toISOString().split('T')[0]
  searchQuery.value = ''
  loadData()
}

const openModal = (record = null) => {
  errorMsg.value = ''
  if (record) {
    editingRecord.value = record
    form.userId = record.userId
    form.date = record.date
    form.checkInTime = record.checkIn ? new Date(record.checkIn.time).toTimeString().slice(0, 5) : ''
    form.checkOutTime = record.checkOut ? new Date(record.checkOut.time).toTimeString().slice(0, 5) : ''
  } else {
    editingRecord.value = null
    form.userId = ''
    form.date = new Date().toISOString().split('T')[0]
    form.checkInTime = '08:00'
    form.checkOutTime = '17:00'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingRecord.value = null
}

const saveAttendance = async () => {
  saving.value = true
  errorMsg.value = ''
  try {
    const dateStr = form.date
    const checkInDateTime = form.checkInTime ? new Date(`${dateStr}T${form.checkInTime}`).toISOString() : null
    const checkOutDateTime = form.checkOutTime ? new Date(`${dateStr}T${form.checkOutTime}`).toISOString() : null

    if (editingRecord.value) {
      const updatedRecord = { ...editingRecord.value }
      if (checkInDateTime) {
        updatedRecord.checkIn = { ...updatedRecord.checkIn, time: checkInDateTime, isManual: true }
      } else {
        delete updatedRecord.checkIn
      }

      if (checkOutDateTime) {
        updatedRecord.checkOut = { ...updatedRecord.checkOut, time: checkOutDateTime, isManual: true }
      } else {
        delete updatedRecord.checkOut
      }

      await absensiStore.updateAttendance(updatedRecord)
    } else {
      // Create new manual attendance
      const newRecord = {
        _id: `attendance_${form.userId}_${dateStr}`,
        userId: form.userId,
        date: dateStr,
        type: 'regular',
        createdAt: new Date().toISOString()
      }

      if (checkInDateTime) {
        newRecord.checkIn = { time: checkInDateTime, isManual: true, location: { latitude: 0, longitude: 0 } }
      }
      if (checkOutDateTime) {
        newRecord.checkOut = { time: checkOutDateTime, isManual: true, location: { latitude: 0, longitude: 0 } }
      }

      await absensiStore.updateAttendance(newRecord)
    }
    
    await loadData()
    closeModal()
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    saving.value = false
  }
}

const confirmDelete = (record) => {
  recordToDelete.value = record
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!recordToDelete.value) return
  try {
    await absensiStore.deleteAttendance(recordToDelete.value._id)
    await loadData()
    showDeleteConfirm.value = false
  } catch (err) {
    alert('Gagal menghapus data: ' + err.message)
  }
}

onMounted(() => {
  const today = new Date()
  const fiveDaysAgo = new Date()
  fiveDaysAgo.setDate(today.getDate() - 5)
  
  filters.startDate = fiveDaysAgo.toISOString().split('T')[0]
  filters.endDate = today.toISOString().split('T')[0]
  
  loadData()
})
</script>
