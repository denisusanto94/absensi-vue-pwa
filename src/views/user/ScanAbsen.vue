<template>
  <div class="pb-20 lg:pb-0">
    <h1 class="page-title">Scan Absen</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Status Lokasi</h2>
        
        <div v-if="locationLoading" class="flex items-center justify-center py-8">
          <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          <span class="ml-3 text-gray-600">Mendapatkan lokasi...</span>
        </div>
        
        <div v-else-if="locationError" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-medium text-red-800">Lokasi Tidak Tersedia</p>
              <p class="text-sm text-red-600 mt-1">{{ locationError }}</p>
              <button
                @click="fetchLocation"
                class="mt-3 text-sm text-red-700 font-medium hover:text-red-800"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <div class="flex items-center p-4 bg-green-50 rounded-lg">
            <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p class="font-medium text-green-800">Lokasi Terdeteksi</p>
              <p class="text-sm text-green-600">
                {{ formatCoordinates(location.latitude, location.longitude) }}
              </p>
            </div>
          </div>
          
          <a
            :href="getGoogleMapsUrl(location.latitude, location.longitude)"
            target="_blank"
            class="flex items-center justify-center w-full p-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Lihat di Google Maps
          </a>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Absensi</h2>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Tanggal</p>
                <p class="font-semibold text-gray-900">{{ formattedToday }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">Waktu</p>
                <p class="font-semibold text-gray-900">{{ currentTime }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="hasCheckedIn && !hasCheckedOut" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              Anda sudah check-in pada <strong>{{ checkInTime }}</strong>
            </p>
          </div>
          
          <div v-if="hasCheckedOut" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">
              Anda sudah selesai bekerja hari ini.
              <br />Check-in: <strong>{{ checkInTime }}</strong>
              <br />Check-out: <strong>{{ checkOutTime }}</strong>
            </p>
          </div>
          
          <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ submitError }}</p>
          </div>
          
          <div v-if="submitSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">{{ submitSuccess }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <BaseButton
              variant="success"
              :loading="submitting"
              :disabled="hasCheckedIn || !location || locationError"
              block
              class="py-4"
              @click="handleCheckIn"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Check In
            </BaseButton>
            
            <BaseButton
              variant="danger"
              :loading="submitting"
              :disabled="!hasCheckedIn || hasCheckedOut || !location || locationError"
              block
              class="py-4"
              @click="handleCheckOut"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Check Out
            </BaseButton>
          </div>
          
          <div class="text-center">
            <button
              @click="showScanner = true"
              :disabled="hasCheckedOut"
              class="text-primary-600 hover:text-primary-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ScannerModal
      v-model="showScanner"
      title="Scan QR Code Absensi"
      @scan-success="handleQRScan"
      @scan-error="handleQRError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { getCurrentLocation, formatCoordinates, getGoogleMapsUrl } from '@/utils/location'
import { formatTime } from '@/utils/formatters'
import BaseButton from '@/components/BaseButton.vue'
import ScannerModal from '@/components/ScannerModal.vue'

const absensiStore = useAbsensiStore()

const location = ref(null)
const locationLoading = ref(true)
const locationError = ref('')
const currentTime = ref('')
const showScanner = ref(false)
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

let timeInterval = null

const formattedToday = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
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

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchLocation = async () => {
  locationLoading.value = true
  locationError.value = ''
  
  try {
    location.value = await getCurrentLocation()
  } catch (error) {
    locationError.value = error.message
  } finally {
    locationLoading.value = false
  }
}

const handleCheckIn = async () => {
  if (!location.value) return
  
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  
  try {
    const result = await absensiStore.checkIn(location.value)
    
    if (result.success) {
      submitSuccess.value = 'Check-in berhasil!'
    } else {
      submitError.value = result.error
    }
  } catch (error) {
    submitError.value = error.message
  } finally {
    submitting.value = false
  }
}

const handleCheckOut = async () => {
  if (!location.value) return
  
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  
  try {
    const result = await absensiStore.checkOut(location.value)
    
    if (result.success) {
      submitSuccess.value = 'Check-out berhasil!'
    } else {
      submitError.value = result.error
    }
  } catch (error) {
    submitError.value = error.message
  } finally {
    submitting.value = false
  }
}

const handleQRScan = async (qrData, locationOverride = null) => {
  if (!location.value && !locationOverride) {
    submitError.value = 'Lokasi tidak tersedia'
    return
  }
  
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  
  try {
    let result
    if (!hasCheckedIn.value) {
      result = await absensiStore.checkIn(location.value, qrData, null, locationOverride)
      if (result.success) {
        submitSuccess.value = 'Check-in dengan QR berhasil!'
      }
    } else if (!hasCheckedOut.value) {
      result = await absensiStore.checkOut(location.value, qrData, null, locationOverride)
      if (result.success) {
        submitSuccess.value = 'Check-out dengan QR berhasil!'
      }
    }
    
    if (result && !result.success) {
      submitError.value = result.error
    }
  } catch (error) {
    submitError.value = error.message
  } finally {
    submitting.value = false
  }
}

const handleQRError = (error) => {
  submitError.value = 'Gagal membaca QR Code: ' + error.message
}

onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  await fetchLocation()
  await absensiStore.fetchTodayAttendance()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
