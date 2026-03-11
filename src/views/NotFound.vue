<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-600">404</h1>
      <p class="text-2xl font-semibold text-gray-900 mt-4">Halaman Tidak Ditemukan</p>
      <p class="text-gray-500 mt-2">Maaf, halaman yang Anda cari tidak ada.</p>
      <router-link
        to="/"
        class="inline-flex items-center mt-6 btn-primary px-6 py-3"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Kembali ke Beranda
      </router-link>
    </div>
  </div>
</template>
