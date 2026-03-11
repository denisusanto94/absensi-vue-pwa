<template>
  <div class="pb-20 lg:pb-0">
    <h1 class="page-title">Pengajuan Cuti</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Form Pengajuan</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Jenis Cuti <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.type"
                class="input"
                required
              >
                <option value="">Pilih jenis cuti</option>
                <option value="annual">Cuti Tahunan</option>
                <option value="sick">Sakit</option>
                <option value="personal">Keperluan Pribadi</option>
                <option value="maternity">Cuti Melahirkan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BaseInput
                v-model="form.startDate"
                type="date"
                label="Tanggal Mulai"
                :min="minDate"
                required
              />
              
              <BaseInput
                v-model="form.endDate"
                type="date"
                label="Tanggal Selesai"
                :min="form.startDate || minDate"
                required
              />
            </div>
            
            <div v-if="totalDays > 0" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                Total: <strong>{{ totalDays }} hari</strong>
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Alasan <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.reason"
                rows="4"
                class="input"
                placeholder="Jelaskan alasan pengajuan cuti..."
                required
              ></textarea>
            </div>
            
            <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ submitError }}</p>
            </div>
            
            <div v-if="submitSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-600">{{ submitSuccess }}</p>
            </div>
            
            <BaseButton
              type="submit"
              variant="primary"
              :loading="submitting"
              block
            >
              Ajukan Cuti
            </BaseButton>
          </form>
        </div>
      </div>
      
      <div>
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Sisa Cuti</h2>
          
          <div class="text-center py-4">
            <p class="text-5xl font-bold text-primary-600">12</p>
            <p class="text-gray-500 mt-1">Hari tersisa</p>
          </div>
          
          <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-500">Total cuti tahunan</span>
              <span class="font-medium">14 hari</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Sudah digunakan</span>
              <span class="font-medium">2 hari</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card mt-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Riwayat Pengajuan</h2>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
      
      <div v-else-if="leaveRequests.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">Belum ada pengajuan cuti</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Jenis</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Tanggal</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Alasan</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="request in leaveRequests"
              :key="request._id"
              class="border-b border-gray-100"
            >
              <td class="py-3 px-4">
                <span class="font-medium text-gray-900">{{ getLeaveTypeLabel(request.type) }}</span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-600">
                {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                {{ request.reason }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(request.status)]"
                >
                  {{ getStatusLabel(request.status) }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { formatDate, getStatusColor, getStatusLabel, getLeaveTypeLabel } from '@/utils/formatters'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const absensiStore = useAbsensiStore()

const form = reactive({
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const loading = ref(true)
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')
const leaveRequests = ref([])

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const totalDays = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  return diffDays
})

const resetForm = () => {
  form.type = ''
  form.startDate = ''
  form.endDate = ''
  form.reason = ''
}

const handleSubmit = async () => {
  submitError.value = ''
  submitSuccess.value = ''
  
  if (!form.type || !form.startDate || !form.endDate || !form.reason) {
    submitError.value = 'Semua field wajib diisi'
    return
  }
  
  if (new Date(form.endDate) < new Date(form.startDate)) {
    submitError.value = 'Tanggal selesai tidak boleh sebelum tanggal mulai'
    return
  }
  
  submitting.value = true
  
  try {
    const result = await absensiStore.submitLeaveRequest({
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason
    })
    
    if (result.success) {
      submitSuccess.value = 'Pengajuan cuti berhasil dikirim!'
      resetForm()
      await loadLeaveRequests()
    } else {
      submitError.value = result.error
    }
  } catch (error) {
    submitError.value = error.message
  } finally {
    submitting.value = false
  }
}

const loadLeaveRequests = async () => {
  loading.value = true
  try {
    leaveRequests.value = await absensiStore.fetchLeaveRequests()
  } catch (error) {
    console.error('Error loading leave requests:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLeaveRequests()
})
</script>
