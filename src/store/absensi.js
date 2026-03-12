import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { attendanceDB, leaveRequestsDB } from '@/api/database'
import { useUserStore } from './user'
import { getAddressFromCoords } from '@/utils/location'

export const useAbsensiStore = defineStore('absensi', () => {
  const attendanceRecords = ref([])
  const leaveRequests = ref([])
  const todayAttendance = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pendingSync = ref([])
  
  const userStore = useUserStore()
  
  const hasCheckedInToday = computed(() => {
    return todayAttendance.value?.checkIn !== undefined
  })
  
  const hasCheckedOutToday = computed(() => {
    return todayAttendance.value?.checkOut !== undefined
  })
  
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }
  
  const checkIn = async (location, qrData = null, publicUserId = null) => {
    loading.value = true
    error.value = null
    
    try {
      const today = getTodayDate()
      const userId = publicUserId || userStore.userId
      
      if (!userId) throw new Error('User ID tidak valid')
      
      let existingRecord = null
      try {
        existingRecord = await attendanceDB.get(`attendance_${userId}_${today}`)
      } catch (e) {
        // Record doesn't exist yet
      }
      
      if (existingRecord?.checkIn) {
        throw new Error('Anda sudah melakukan check-in hari ini')
      }
      
      const record = existingRecord || {
        _id: `attendance_${userId}_${today}`,
        userId,
        date: today,
        type: 'regular'
      }
      
      const addressDetails = await getAddressFromCoords(location.latitude, location.longitude)
      
      record.checkIn = {
        time: new Date().toISOString(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          ...addressDetails
        },
        qrData,
        device: navigator.userAgent
      }
      
      // Flatten searchable fields for indexing convenience
      record.latitude = location.latitude
      record.longitude = location.longitude
      record.alamat_lengkap = addressDetails.alamat_lengkap
      record.kota = addressDetails.kota
      record.kecamatan = addressDetails.kecamatan
      record.kelurahan = addressDetails.kelurahan
      record.kabupaten = addressDetails.kabupaten
      record.kode_pos = addressDetails.kode_pos
      record.updatedAt = new Date().toISOString()
      
      if (!existingRecord) {
        record.createdAt = new Date().toISOString()
      }
      
      await attendanceDB.put(record)
      todayAttendance.value = record
      
      addToPendingSync(record._id)
      
      return { success: true, record }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  const checkOut = async (location, qrData = null, publicUserId = null) => {
    loading.value = true
    error.value = null
    
    try {
      const today = getTodayDate()
      const userId = publicUserId || userStore.userId
      
      if (!userId) throw new Error('User ID tidak valid')
      
      let existingRecord = null
      try {
        existingRecord = await attendanceDB.get(`attendance_${userId}_${today}`)
      } catch (e) {
        throw new Error('Anda belum melakukan check-in hari ini')
      }
      
      if (!existingRecord?.checkIn) {
        throw new Error('Anda belum melakukan check-in hari ini')
      }
      
      if (existingRecord.checkOut) {
        throw new Error('Anda sudah melakukan check-out hari ini')
      }
      
      const addressDetails = await getAddressFromCoords(location.latitude, location.longitude)

      existingRecord.checkOut = {
        time: new Date().toISOString(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          ...addressDetails
        },
        qrData,
        device: navigator.userAgent
      }
      existingRecord.updatedAt = new Date().toISOString()
      
      await attendanceDB.put(existingRecord)
      todayAttendance.value = existingRecord
      
      addToPendingSync(existingRecord._id)
      
      return { success: true, record: existingRecord }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  const fetchTodayAttendance = async (publicUserId = null) => {
    const today = getTodayDate()
    const userId = publicUserId || userStore.userId
    
    if (!userId) return
    
    try {
      const record = await attendanceDB.get(`attendance_${userId}_${today}`)
      todayAttendance.value = record
    } catch (e) {
      todayAttendance.value = null
    }
  }
  
  const fetchAttendanceHistory = async (startDate = null, endDate = null) => {
    loading.value = true
    
    try {
      const userId = userStore.userId
      const selector = { userId }
      
      if (startDate && endDate) {
        selector.date = { $gte: startDate, $lte: endDate }
      }
      
      const result = await attendanceDB.find({
        selector,
        sort: [{ date: 'desc' }]
      })
      
      attendanceRecords.value = result.docs
      return result.docs
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }
  
  const fetchAllAttendance = async (filters = {}) => {
    loading.value = true
    
    try {
      const selector = {}
      
      if (filters.userId) selector.userId = filters.userId
      if (filters.date) selector.date = filters.date
      if (filters.startDate && filters.endDate) {
        selector.date = { $gte: filters.startDate, $lte: filters.endDate }
      }
      
      const result = await attendanceDB.find({
        selector,
        sort: [{ date: 'desc' }]
      })
      
      return result.docs
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }
  
  const submitLeaveRequest = async (leaveData) => {
    loading.value = true
    error.value = null
    
    try {
      const userId = userStore.userId
      
      const request = {
        _id: `leave_${userId}_${Date.now()}`,
        userId,
        type: leaveData.type,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await leaveRequestsDB.put(request)
      
      addToPendingSync(request._id)
      
      return { success: true, request }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  const fetchLeaveRequests = async (status = null) => {
    loading.value = true
    
    try {
      const userId = userStore.userId
      const selector = { userId }
      
      if (status) selector.status = status
      
      const result = await leaveRequestsDB.find({
        selector,
        sort: [{ createdAt: 'desc' }]
      })
      
      leaveRequests.value = result.docs
      return result.docs
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }
  
  const fetchAllLeaveRequests = async (status = null) => {
    loading.value = true
    
    try {
      const selector = {}
      if (status) selector.status = status
      
      const result = await leaveRequestsDB.find({
        selector,
        sort: [{ createdAt: 'desc' }]
      })
      
      return result.docs
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }
  
  const updateLeaveRequestStatus = async (requestId, status, notes = '') => {
    loading.value = true
    
    try {
      const doc = await leaveRequestsDB.get(requestId)
      
      doc.status = status
      doc.reviewNotes = notes
      doc.reviewedAt = new Date().toISOString()
      doc.reviewedBy = userStore.userId
      doc.updatedAt = new Date().toISOString()
      
      await leaveRequestsDB.put(doc)
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateAttendance = async (record) => {
    loading.value = true
    try {
      record.updatedAt = new Date().toISOString()
      await attendanceDB.put(record)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteAttendance = async (recordId) => {
    loading.value = true
    try {
      const doc = await attendanceDB.get(recordId)
      await attendanceDB.remove(doc)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  const addToPendingSync = (docId) => {
    if (!pendingSync.value.includes(docId)) {
      pendingSync.value.push(docId)
      localStorage.setItem('absensi_pending_sync', JSON.stringify(pendingSync.value))
    }
  }
  
  const loadPendingSync = () => {
    const saved = localStorage.getItem('absensi_pending_sync')
    if (saved) {
      pendingSync.value = JSON.parse(saved)
    }
  }
  
  const clearPendingSync = () => {
    pendingSync.value = []
    localStorage.removeItem('absensi_pending_sync')
  }
  
  return {
    attendanceRecords,
    leaveRequests,
    todayAttendance,
    loading,
    error,
    pendingSync,
    hasCheckedInToday,
    hasCheckedOutToday,
    checkIn,
    checkOut,
    fetchTodayAttendance,
    fetchAttendanceHistory,
    fetchAllAttendance,
    submitLeaveRequest,
    fetchLeaveRequests,
    fetchAllLeaveRequests,
    updateLeaveRequestStatus,
    updateAttendance,
    deleteAttendance,
    loadPendingSync,
    clearPendingSync
  }
})
