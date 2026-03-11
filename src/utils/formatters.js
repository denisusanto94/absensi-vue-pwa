export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-'
  
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  }
  
  return new Date(dateString).toLocaleDateString('id-ID', defaultOptions)
}

export const formatTime = (dateString) => {
  if (!dateString) return '-'
  
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '-'
  
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end - start
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours} jam ${minutes} menit`
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

export const getDayName = (dateString) => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const date = new Date(dateString)
  return days[date.getDay()]
}

export const getMonthName = (monthIndex) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months[monthIndex]
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    cancelled: 'Dibatalkan'
  }
  return labels[status] || status
}

export const getLeaveTypeLabel = (type) => {
  const labels = {
    annual: 'Cuti Tahunan',
    sick: 'Sakit',
    personal: 'Keperluan Pribadi',
    maternity: 'Cuti Melahirkan',
    other: 'Lainnya'
  }
  return labels[type] || type
}
