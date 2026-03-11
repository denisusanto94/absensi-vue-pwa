<template>
  <div>
    <h1 class="page-title">Approval Cuti</h1>
    
    <div class="card mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === tab.value
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              activeTab === tab.value ? 'bg-white text-primary-600' : 'bg-gray-300 text-gray-700'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>
    
    <div class="card">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
      
      <div v-else-if="filteredRequests.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">Tidak ada pengajuan cuti {{ activeTab !== 'all' ? getStatusLabel(activeTab).toLowerCase() : '' }}</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="request in filteredRequests"
          :key="request._id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary-700 font-medium text-sm">
                    {{ getInitials(request.userName) }}
                  </span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ request.userName || 'Unknown' }}</p>
                  <span
                    :class="['px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(request.status)]"
                  >
                    {{ getStatusLabel(request.status) }}
                  </span>
                </div>
              </div>
              
              <div class="ml-13 space-y-2">
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span class="text-gray-600">{{ getLeaveTypeLabel(request.type) }}</span>
                </div>
                
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-600">
                    {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}
                    ({{ calculateDays(request.startDate, request.endDate) }} hari)
                  </span>
                </div>
                
                <div class="flex items-start text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span class="text-gray-600">{{ request.reason }}</span>
                </div>
                
                <div v-if="request.reviewNotes" class="flex items-start text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span class="text-gray-500 italic">Catatan: {{ request.reviewNotes }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="request.status === 'pending'" class="flex sm:flex-col gap-2">
              <BaseButton
                variant="success"
                size="sm"
                @click="showApprovalModal(request, 'approve')"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Setujui
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                @click="showApprovalModal(request, 'reject')"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tolak
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <teleport to="body">
      <div
        v-if="modalVisible"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal" />
          
          <div class="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle bg-white rounded-2xl shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ modalAction === 'approve' ? 'Setujui Cuti' : 'Tolak Cuti' }}
            </h3>
            
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">
                <strong>{{ selectedRequest?.userName }}</strong> mengajukan
                <strong>{{ getLeaveTypeLabel(selectedRequest?.type) }}</strong>
                dari {{ formatDate(selectedRequest?.startDate) }} sampai {{ formatDate(selectedRequest?.endDate) }}
              </p>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Catatan (Opsional)
              </label>
              <textarea
                v-model="reviewNotes"
                rows="3"
                class="input"
                placeholder="Tambahkan catatan..."
              ></textarea>
            </div>
            
            <div class="flex space-x-3">
              <BaseButton variant="secondary" @click="closeModal" class="flex-1">
                Batal
              </BaseButton>
              <BaseButton
                :variant="modalAction === 'approve' ? 'success' : 'danger'"
                :loading="processing"
                @click="processRequest"
                class="flex-1"
              >
                {{ modalAction === 'approve' ? 'Setujui' : 'Tolak' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { usersDB } from '@/api/database'
import { formatDate, getStatusColor, getStatusLabel, getLeaveTypeLabel } from '@/utils/formatters'
import BaseButton from '@/components/BaseButton.vue'

const absensiStore = useAbsensiStore()

const loading = ref(true)
const leaveRequests = ref([])
const activeTab = ref('pending')
const modalVisible = ref(false)
const modalAction = ref('')
const selectedRequest = ref(null)
const reviewNotes = ref('')
const processing = ref(false)

const tabs = computed(() => [
  { value: 'all', label: 'Semua', count: leaveRequests.value.length },
  { value: 'pending', label: 'Menunggu', count: leaveRequests.value.filter(r => r.status === 'pending').length },
  { value: 'approved', label: 'Disetujui', count: leaveRequests.value.filter(r => r.status === 'approved').length },
  { value: 'rejected', label: 'Ditolak', count: leaveRequests.value.filter(r => r.status === 'rejected').length }
])

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') return leaveRequests.value
  return leaveRequests.value.filter(r => r.status === activeTab.value)
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

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
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
    
    const requests = await absensiStore.fetchAllLeaveRequests()
    
    leaveRequests.value = requests.map(request => ({
      ...request,
      userName: userMap[request.userId] || 'Unknown'
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error loading leave requests:', error)
  } finally {
    loading.value = false
  }
}

const showApprovalModal = (request, action) => {
  selectedRequest.value = request
  modalAction.value = action
  reviewNotes.value = ''
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedRequest.value = null
  modalAction.value = ''
  reviewNotes.value = ''
}

const processRequest = async () => {
  if (!selectedRequest.value) return
  
  processing.value = true
  
  try {
    const status = modalAction.value === 'approve' ? 'approved' : 'rejected'
    await absensiStore.updateLeaveRequestStatus(
      selectedRequest.value._id,
      status,
      reviewNotes.value
    )
    
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Error processing request:', error)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
