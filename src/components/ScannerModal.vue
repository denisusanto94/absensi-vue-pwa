<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            @click="closeModal"
          />
          
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              class="relative inline-block w-full max-w-lg p-6 my-8 text-left align-middle bg-white rounded-2xl shadow-xl transform transition-all"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
                <button
                  @click="closeModal"
                  class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="relative">
                <div
                  v-if="!isScanning && !error"
                  class="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
                >
                  <div class="text-center">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p class="text-gray-500">Klik tombol untuk mulai scan</p>
                  </div>
                </div>
                
                <div
                  v-if="error"
                  class="aspect-square bg-red-50 rounded-xl flex items-center justify-center"
                >
                  <div class="text-center p-4">
                    <svg class="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-red-600 font-medium">{{ error }}</p>
                  </div>
                </div>
                
                <div
                  id="qr-reader"
                  :class="{ 'hidden': !isScanning }"
                  class="aspect-square rounded-xl overflow-hidden"
                />
                
                <div
                  v-if="isScanning"
                  class="absolute inset-0 pointer-events-none"
                >
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-48 h-48 border-2 border-primary-500 rounded-lg relative">
                      <div class="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary-500 rounded-tl" />
                      <div class="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary-500 rounded-tr" />
                      <div class="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary-500 rounded-bl" />
                      <div class="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary-500 rounded-br" />
                    </div>
                  </div>
                </div>

                <!-- Cropper Interface -->
                <div v-if="isCropping" class="aspect-square bg-slate-900 rounded-xl overflow-hidden">
                  <img ref="imageToCrop" :src="cropImageSrc" class="max-w-full block" />
                </div>
              </div>
              
              <div v-if="isCropping" class="mt-6">
                <div class="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <button @click="cropper.rotate(-90)" class="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" title="Putar Kiri">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <button @click="cropper.rotate(90)" class="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" title="Putar Kanan">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <div class="w-px h-6 bg-slate-200 mx-1"></div>
                  <button @click="handleFlip('horizontal')" class="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" title="Balik Horizontal">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8m0 0l-4-4m4 4l-4 4m0 6H8m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  <button @click="handleFlip('vertical')" class="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" title="Balik Vertikal">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="transform: rotate(90deg)">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8m0 0l-4-4m4 4l-4 4m0 6H8m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  <div class="w-px h-6 bg-slate-200 mx-1"></div>
                  <button @click="cropper.reset()" class="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" title="Reset">
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div class="flex space-x-3">
                  <button
                    @click="executeCropAndScan"
                    class="flex-1 btn-primary py-3 flex items-center justify-center font-bold"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Potong & Scan
                  </button>
                  <button
                    @click="cancelCropping"
                    class="btn-secondary py-3 px-6 font-bold"
                  >
                    Batal
                  </button>
                </div>
              </div>

              <div v-else class="mt-6 flex space-x-3">
                <button
                  v-if="!isScanning"
                  @click="startScanning"
                  class="flex-1 btn-primary py-3"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Mulai Scan
                </button>
                
                <button
                  v-else
                  @click="stopScanning"
                  class="flex-1 btn-danger py-3"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Berhenti
                </button>

                <div v-if="!isScanning">
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                  />
                  <button
                    @click="$refs.fileInput.click()"
                    class="btn-secondary py-3 px-4 flex items-center"
                    title="Scan dari Galeri"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload
                  </button>
                </div>
                
                <button
                  @click="closeModal"
                  class="btn-secondary py-3 px-6"
                >
                  Batal
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Scan QR Code'
  }
})

const emit = defineEmits(['update:modelValue', 'scan-success', 'scan-error'])

const isScanning = ref(false)
const isCropping = ref(false)
const cropImageSrc = ref('')
const imageToCrop = ref(null)
const error = ref(null)
let html5QrCode = null
let cropper = null

const startScanning = async () => {
  error.value = null
  isScanning.value = true
  isCropping.value = false
  
  // Tunggu render selesai agar elemen #qr-reader terlihat
  setTimeout(async () => {
    try {
      html5QrCode = new Html5Qrcode('qr-reader')
      
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          emit('scan-success', decodedText)
          stopScanning()
          closeModal()
        },
        () => {}
      )
    } catch (err) {
      console.error('QR Scanner error:', err)
      isScanning.value = false
      error.value = err.message || 'Gagal mengakses kamera'
      emit('scan-error', err)
    }
  }, 100)
}

const stopScanning = async () => {
  if (html5QrCode && isScanning.value) {
    try {
      await html5QrCode.stop()
    } catch (err) {
      console.error('Error stopping scanner:', err)
    }
  }
  isScanning.value = false
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  error.value = null
  
  // Step 1: Try to scan directly first (Quick scan)
  const quickScanner = new Html5Qrcode('qr-reader')
  try {
    const decodedText = await quickScanner.scanFile(file, false)
    emit('scan-success', decodedText)
    closeModal()
    quickScanner.clear()
    return
  } catch (err) {
    console.log('Quick scan failed, opening cropper...')
    quickScanner.clear()
  }

  // Step 2: If quick scan fails, show cropper
  isScanning.value = false
  const reader = new FileReader()
  reader.onload = (e) => {
    cropImageSrc.value = e.target.result
    isCropping.value = true
    
    // Initialize cropper after DOM update
    nextTick(() => {
      if (cropper) cropper.destroy()
      cropper = new Cropper(imageToCrop.value, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      })
    })
  }
  reader.readAsDataURL(file)
  event.target.value = '' // Reset input
}

const executeCropAndScan = async () => {
  if (!cropper) return
  
  error.value = null
  
  // 1. Get raw cropped canvas (no smoothing for sharpness)
  const croppedCanvas = cropper.getCroppedCanvas({
    width: 800,
    height: 800,
    imageSmoothingEnabled: false,
  })
  
  // 2. Add "Quiet Zone" (White padding around the QR)
  // Many decoders fail if the QR touches the edge
  const finalCanvas = document.createElement('canvas')
  const padding = 80 // 10% padding
  finalCanvas.width = 800 + (padding * 2)
  finalCanvas.height = 800 + (padding * 2)
  const ctx = finalCanvas.getContext('2d')
  
  // Fill white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
  
  // Draw the QR in the center
  ctx.drawImage(croppedCanvas, padding, padding)
  
  // 3. Convert to Blob and Scan
  finalCanvas.toBlob(async (blob) => {
    const file = new File([blob], 'cropped-qr.jpg', { type: 'image/jpeg' })
    const tempScanner = new Html5Qrcode('qr-reader', { verbose: false })
    
    try {
      const decodedText = await tempScanner.scanFile(file, false)
      emit('scan-success', decodedText)
      closeModal()
    } catch (err) {
      console.error('File scan error:', err)
      error.value = 'QR Code tidak terdeteksi. Coba sisakan area putih sedikit di sekeliling kode QR saat memotong.'
      emit('scan-error', err)
    } finally {
      try { tempScanner.clear() } catch(e) {}
    }
  }, 'image/jpeg', 0.9)
}

const handleFlip = (type) => {
  if (!cropper) return
  const data = cropper.getData()
  if (type === 'horizontal') {
    cropper.scaleX(data.scaleX === -1 ? 1 : -1)
  } else {
    cropper.scaleY(data.scaleY === -1 ? 1 : -1)
  }
}

const cancelCropping = () => {
  isCropping.value = false
  if (cropper) cropper.destroy()
  cropper = null
}

const closeModal = () => {
  stopScanning()
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    stopScanning()
    error.value = null
  }
})

onUnmounted(() => {
  stopScanning()
})
</script>
