<template>
  <div class="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <!-- Floating Circles -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-float-slow"></div>
    </div>
    
    <div class="w-full max-w-md relative z-10">
      <!-- Back Button -->
      <button
        v-if="step === '2fa'"
        @click="backToLogin"
        class="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-6 group"
      >
        <div class="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span class="font-medium">Kembali ke Login</span>
      </button>
      <router-link
        v-else
        to="/"
        class="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-6 group"
      >
        <div class="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span class="font-medium">Kembali ke Absensi</span>
      </router-link>

      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="relative inline-block">
          <div class="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30 animate-bounce-slow">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white/20 animate-pulse"></div>
        </div>
        <h1 class="text-4xl font-bold text-white tracking-tight">
          Sistem Absensi
        </h1>
        <p class="text-white/70 mt-3 text-lg">{{ step === 'login' ? 'Masuk ke akun Anda' : 'Otentikasi Dua Faktor' }}</p>
      </div>
      
      <!-- Login Card -->
      <div v-if="step === 'login'" class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white/90">Email</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                placeholder="nama@perusahaan.com"
                class="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                :class="{ 'border-red-400 focus:ring-red-400': errors.email }"
                required
              />
            </div>
            <p v-if="errors.email" class="text-red-300 text-sm mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.email }}
            </p>
          </div>
          
          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white/90">Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                class="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                :class="{ 'border-red-400 focus:ring-red-400': errors.password }"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="text-red-300 text-sm mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ errors.password }}
            </p>
          </div>

          <!-- Login Error -->
          <transition name="fade">
            <div v-if="loginError" class="p-4 bg-red-500/20 backdrop-blur border border-red-400/30 rounded-2xl flex items-center">
              <svg class="w-5 h-5 text-red-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <p class="text-red-200 text-sm">{{ loginError }}</p>
            </div>
          </transition>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 px-6 bg-white text-indigo-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
          </button>
        </form>

        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/20"></div></div>
          <div class="relative flex justify-center text-sm"><span class="px-4 bg-transparent text-white/50">Demo Akun</span></div>
        </div>
        <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div class="flex items-center justify-between text-white font-mono text-sm">
            <div><p class="text-white/50 text-[10px] uppercase mb-1">Email</p>denisusanto94@gmail.com</div>
            <div class="text-right"><p class="text-white/50 text-[10px] uppercase mb-1">Pass</p>admin123</div>
          </div>
        </div>
      </div>

      <!-- 2FA Card -->
      <div v-else class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
        <!-- Setup Mode (No is_authenticator) -->
        <div v-if="!tempUser.is_authenticator" class="text-center space-y-6">
          <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p class="text-white/90 font-medium mb-4">Scan QR Code di Google Authenticator</p>
            <div class="bg-white p-4 rounded-xl inline-block shadow-inner">
              <img :src="qrCodeUrl" alt="2FA QR Code" class="w-48 h-48 mx-auto" />
            </div>
            <p class="text-white/50 text-xs mt-4">Belum punya aplikasi? Download di PlayStore/AppStore</p>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white/90 text-left">Masukkan Token 6-Digit</label>
            <input
              v-model="otpToken"
              type="text"
              maxlength="6"
              placeholder="000000"
              class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div v-if="loginError" class="text-red-300 text-sm">{{ loginError }}</div>

          <button
            @click="handleVerify2FA"
            :disabled="otpToken.length < 6 || loading"
            class="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            Verifikasi & Masuk
          </button>

          <button
            v-if="tempUser?.role === 'admin'"
            @click="handleAdminBypass"
            class="mt-4 w-full py-3 bg-white/5 border border-white/20 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Sebagai Admin Login Langsung Tanpa 2fa</span>
          </button>
        </div>

        <!-- Verification Mode (Already has is_authenticator) -->
        <div v-else class="text-center space-y-6">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p class="text-white/90">Masukkan 6-digit token dari aplikasi Google Authenticator Anda.</p>
          
          <input
            v-model="otpToken"
            type="text"
            maxlength="6"
            placeholder="000000"
            class="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <div v-if="loginError" class="text-red-300 text-sm">{{ loginError }}</div>

          <button
            @click="handleVerify2FA"
            :disabled="otpToken.length < 6 || loading"
            class="w-full py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all disabled:opacity-50"
          >
            Verifikasi Token
          </button>

          <button
            @click="handleForgotPassword"
            class="text-sm text-white/50 hover:text-white underline block mx-auto"
          >
            Lupa QR Code? Kirim ke Email Anda
          </button>

          <button
            v-if="tempUser?.role === 'admin'"
            @click="handleAdminBypass"
            class="mt-4 w-full py-3 bg-white/5 border border-white/20 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Sebagai Admin Login Langsung Tanpa 2fa</span>
          </button>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-white/50 text-sm">&copy; {{ currentYear }} Sistem Absensi PWA</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useToastStore } from '@/store/toast'
import { generateOTPSecret, generateOTPAuthUrl, generateQRCode, verifyOTPToken } from '@/utils/twoFactor'
import { send2FAEmail } from '@/utils/email'
import { usersDB } from '@/api/database'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const step = ref('login') // 'login', '2fa'
const tempUser = ref(null)
const otpToken = ref('')
const qrCodeUrl = ref('')
const loading = ref(false)
const loginError = ref('')

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const currentYear = computed(() => new Date().getFullYear())

const backToLogin = () => {
  step.value = 'login'
  tempUser.value = null
  otpToken.value = ''
  loginError.value = ''
}

const handleLogin = async () => {
  loginError.value = ''
  loading.value = true
  
  try {
    const result = await userStore.login(form.email, form.password)
    if (result.success) {
      tempUser.value = result.user
      step.value = '2fa'
      
      // If setup is needed (not yet authenticator)
      if (!tempUser.value.is_authenticator) {
        if (!tempUser.value.otp_secret) {
          tempUser.value.otp_secret = generateOTPSecret()
        }
        const authUrl = generateOTPAuthUrl(tempUser.value.email, tempUser.value.otp_secret)
        qrCodeUrl.value = await generateQRCode(authUrl)
      }
    } else {
      loginError.value = result.error
    }
  } catch (error) {
    loginError.value = 'Terjadi kesalahan sistem.'
  } finally {
    loading.value = false
  }
}

const handleVerify2FA = async () => {
  loginError.value = ''
  loading.value = true
  
  try {
    const isValid = verifyOTPToken(otpToken.value, tempUser.value.otp_secret)
    if (isValid) {
      // If it was the first setup, update user records
      if (!tempUser.value.is_authenticator) {
        const userDoc = await usersDB.get(tempUser.value._id)
        userDoc.is_authenticator = true
        userDoc.otp_secret = tempUser.value.otp_secret
        userDoc.updatedAt = new Date().toISOString()
        await usersDB.put(userDoc)
        tempUser.value.is_authenticator = true
      }
      
      // Finish login
      await userStore.completeLogin(tempUser.value)
      toast.showToast('Login berhasil! Selamat datang.', 'success')
      if (userStore.isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } else {
      loginError.value = 'Token tidak valid'
    }
  } catch (error) {
    loginError.value = 'Verifikasi gagal.'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  loading.value = true
  loginError.value = ''
  
  try {
    const authUrl = generateOTPAuthUrl(tempUser.value.email, tempUser.value.otp_secret)
    const code = await generateQRCode(authUrl)
    const res = await send2FAEmail(tempUser.value.email, code)
    
    if (res.success) {
      toast.showToast('QR Code telah dikirim ke email Anda!', 'success')
    } else {
      loginError.value = 'Gagal mengirim email: ' + res.error
      toast.showToast('Gagal mengirim email', 'error')
    }
  } catch (err) {
    loginError.value = 'Gagal memproses permintaan.'
  } finally {
    loading.value = false
  }
}

const handleAdminBypass = async () => {
  if (tempUser.value?.role !== 'admin') return
  
  loading.value = true
  try {
    await userStore.completeLogin(tempUser.value)
    toast.showToast('Login Admin Berhasil (Bypass 2FA)', 'success')
    router.push('/admin/dashboard')
  } catch (err) {
    toast.showToast('Gagal memproses login admin', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
@keyframes float-delayed { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(-5deg); } }
@keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.animate-float { animation: float 8s ease-in-out infinite; }
.animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; animation-delay: 1s; }
.animate-float-slow { animation: float-slow 12s ease-in-out infinite; animation-delay: 2s; }
.animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
