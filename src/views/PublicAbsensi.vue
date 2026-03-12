<template>
  <div class="min-h-screen bg-slate-900 text-white selection:bg-indigo-500/30">
    <!-- Background Decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-lg mx-auto px-4 py-8 md:py-16">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6 group transition-all hover:bg-indigo-500/20">
          <svg class="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">Presensi Digital</h1>
        <p class="text-slate-400">Silakan pilih nama Anda untuk memulai absensi</p>
      </div>

      <!-- User Selection -->
      <div class="space-y-6">
        <div v-if="!selectedUser" class="space-y-4">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama Anda..."
              class="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-sm"
              @focus="showResults = true"
            />
          </div>

          <!-- Search Results -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div 
              v-if="showResults && filteredUsers.length > 0" 
              class="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md max-h-60 overflow-y-auto"
            >
              <button
                v-for="user in filteredUsers"
                :key="user._id"
                @click="selectUser(user)"
                class="w-full text-left px-5 py-4 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p class="font-medium text-slate-200 group-hover:text-white">{{ user.name }}</p>
                  <p class="text-xs text-slate-500">{{ user.department }}</p>
                </div>
                <svg class="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </transition>
        </div>

        <!-- Attendance Controls (Only shown when user selected) -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div v-if="selectedUser" class="space-y-6">
            <!-- Selected User Badge -->
            <div class="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between backdrop-blur-sm">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mr-4 text-xl font-bold shrink-0">
                  {{ userInitials }}
                </div>
                <div>
                  <p class="font-bold text-lg">{{ selectedUser.name }}</p>
                  <p class="text-sm text-slate-400">{{ selectedUser.department }}</p>
                </div>
              </div>
              <button 
                @click="selectedUser = null" 
                class="p-2 text-slate-500 hover:text-white transition-colors"
                title="Ganti Nama"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Status Card -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 backdrop-blur-sm">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <p class="text-slate-400 text-sm">Waktu Server</p>
                  <p class="text-2xl font-mono font-bold">{{ currentTime }}</p>
                </div>
                <div class="text-right">
                  <p class="text-slate-400 text-sm">{{ formattedToday }}</p>
                  <p class="text-xs text-indigo-400">{{ greeting }}</p>
                </div>
              </div>

              <!-- Location Status -->
              <div class="mb-6">
                <div v-if="locationLoading" class="flex items-center space-x-3 text-slate-400 text-sm italic">
                  <div class="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Mencari lokasi presensi...</span>
                </div>
                <div v-else-if="locationError" class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400 text-sm">
                  <svg class="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{{ locationError }}</span>
                  <button @click="fetchLocation" class="ml-auto font-bold underline">Ulangi</button>
                </div>
                <div v-else class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center text-emerald-400 text-sm">
                  <svg class="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Lokasi siap disinkronkan</span>
                </div>
              </div>

              <!-- Status Absen -->
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                  <p class="text-slate-500 text-xs mb-1 uppercase tracking-wider">In</p>
                  <p class="font-bold text-lg" :class="hasCheckedIn ? 'text-white' : 'text-slate-600'">
                    {{ checkInTime || '--:--' }}
                  </p>
                </div>
                <div class="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                  <p class="text-slate-500 text-xs mb-1 uppercase tracking-wider">Out</p>
                  <p class="font-bold text-lg" :class="hasCheckedOut ? 'text-white' : 'text-slate-600'">
                    {{ checkOutTime || '--:--' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-4">
              <div v-if="submitError" class="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-200 text-sm text-center">
                {{ submitError }}
              </div>
              <div v-if="submitSuccess" class="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-200 text-sm text-center">
                {{ submitSuccess }}
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Check In Indicator -->
                <div
                  class="relative py-4 rounded-3xl font-bold transition-all flex items-center justify-center border-2"
                  :class="(!hasCheckedIn) 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500'"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Check In
                </div>

                <!-- Check Out Indicator -->
                <div
                  class="relative py-4 rounded-3xl font-bold transition-all flex items-center justify-center border-2"
                  :class="(hasCheckedIn && !hasCheckedOut) 
                    ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500'"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Check Out
                </div>
              </div>

              <!-- Main Scan Action -->
              <button
                @click="showScanner = true"
                :disabled="hasCheckedOut || !location"
                class="w-full py-5 rounded-3xl font-bold transition-all flex items-center justify-center group"
                :class="hasCheckedOut || !location
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 animate-pulse-gentle'"
              >
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-white/20 rounded-xl">
                    <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-xs opacity-70 uppercase tracking-widest font-bold">Wajib Scan QR</p>
                    <p class="text-lg">Scan Presensi Sekarang</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Footer -->
      <div class="mt-16 text-center space-y-6">
        <button 
          v-if="deferredPrompt"
          @click="installApp"
          class="inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition-all hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Tambahkan ke Home Screen
        </button>

        <div>
          <router-link to="/login" class="text-slate-500 hover:text-indigo-400 text-sm transition-colors decoration-indigo-500/30 hover:underline underline-offset-4">
            Buka Panel Admin
          </router-link>
          <p class="text-slate-600 text-xs mt-6 tracking-widest uppercase">Digital Attendance v2.0</p>
        </div>
      </div>
    </div>

    <!-- Scanner Modal -->
    <ScannerModal
      v-model="showScanner"
      title="Scan QR Code Presensi"
      @scan-success="handleQRScan"
      @scan-error="handleQRError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAbsensiStore } from '@/store/absensi'
import { usersDB } from '@/api/database'
import { getCurrentLocation } from '@/utils/location'
import { formatTime, getGreeting } from '@/utils/formatters'
import ScannerModal from '@/components/ScannerModal.vue'

const absensiStore = useAbsensiStore()

const searchQuery = ref('')
const allUsers = ref([])
const showResults = ref(false)
const selectedUser = ref(null)

const location = ref(null)
const locationLoading = ref(true)
const locationError = ref('')
const currentTime = ref('')
const showScanner = ref(false)
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')
const deferredPrompt = ref(null)

let timeInterval = null

const filteredUsers = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return allUsers.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.department?.toLowerCase().includes(query)
  ).slice(0, 5)
})

const userInitials = computed(() => {
  if (!selectedUser.value) return ''
  return selectedUser.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const greeting = computed(() => getGreeting())
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
  return checkIn ? formatTime(checkIn.time) : null
})

const checkOutTime = computed(() => {
  const checkOut = absensiStore.todayAttendance?.checkOut
  return checkOut ? formatTime(checkOut.time) : null
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
    locationError.value = 'Akses lokasi diperlukan untuk absen'
  } finally {
    locationLoading.value = false
  }
}

const selectUser = async (user) => {
  selectedUser.value = user
  searchQuery.value = ''
  showResults.value = false
  submitError.value = ''
  submitSuccess.value = ''
  
  // Load attendance status for selected user
  await absensiStore.fetchTodayAttendance(user._id)
}

const handleCheckIn = async () => {
  if (!location.value || !selectedUser.value) return
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  try {
    const result = await absensiStore.checkIn(location.value, null, selectedUser.value._id)
    if (result.success) {
      submitSuccess.value = 'Check-in berhasil! Selamat bekerja.'
    } else {
      submitError.value = result.error
    }
  } catch (err) {
    submitError.value = err.message
  } finally {
    submitting.value = false
  }
}

const handleCheckOut = async () => {
  if (!location.value || !selectedUser.value) return
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  try {
    const result = await absensiStore.checkOut(location.value, null, selectedUser.value._id)
    if (result.success) {
      submitSuccess.value = 'Check-out berhasil! Hati-hati di jalan.'
    } else {
      submitError.value = result.error
    }
  } catch (err) {
    submitError.value = err.message
  } finally {
    submitting.value = false
  }
}

const handleQRScan = async (qrData) => {
  if (!location.value || !selectedUser.value) return
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  try {
    let result
    if (!hasCheckedIn.value) {
      result = await absensiStore.checkIn(location.value, qrData, selectedUser.value._id)
    } else {
      result = await absensiStore.checkOut(location.value, qrData, selectedUser.value._id)
    }
    if (result.success) {
      submitSuccess.value = 'Absensi QR Berhasil!'
      showScanner.value = false
    } else {
      submitError.value = result.error
    }
  } catch (err) {
    submitError.value = 'Gagal memproses QR'
  } finally {
    submitting.value = false
  }
}

const handleQRError = (err) => {
  submitError.value = 'Kamera tidak dapat diakses'
}

const installApp = async () => {
  if (!deferredPrompt.value) return
  
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    deferredPrompt.value = null
  }
}

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault()
  deferredPrompt.value = e
}

onMounted(async () => {
  const users = await usersDB.find({ selector: { isActive: true } })
  allUsers.value = users.docs.filter(u => u.role !== 'admin')
  
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchLocation()

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

watch(selectedUser, (newVal) => {
  if (!newVal) {
    absensiStore.todayAttendance = null
  }
})
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
@keyframes pulse-gentle {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 20px 10px rgba(79, 70, 229, 0); }
}

.animate-pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
