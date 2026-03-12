import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as authLogin, logout as authLogout, getSession, isAdmin as checkAdmin } from '@/api/auth'
import { usersDB } from '@/api/database'

export const useUserStore = defineStore('user', () => {
  const session = ref(getSession())
  const userProfile = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const isLoggedIn = computed(() => session.value !== null)
  const isAdmin = computed(() => session.value?.role === 'admin')
  const userName = computed(() => session.value?.name || '')
  const userRole = computed(() => session.value?.role || '')
  const userId = computed(() => session.value?.userId || '')
  
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await authLogin(email, password)
      
      if (result.success) {
        // Return user for 2FA verification step
        return { success: true, user: result.user }
      } else {
        error.value = result.error
        return { success: false, error: result.error }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const completeLogin = async (user) => {
    const { createSession } = await import('@/api/auth')
    session.value = createSession(user)
    await fetchUserProfile()
    return { success: true }
  }
  
  const logout = () => {
    authLogout()
    session.value = null
    userProfile.value = null
  }
  
  const fetchUserProfile = async () => {
    if (!session.value?.userId) return
    
    try {
      const doc = await usersDB.get(session.value.userId)
      userProfile.value = { ...doc, password: undefined }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }
  
  const updateProfile = async (updates) => {
    if (!session.value?.userId) return { success: false, error: 'Not logged in' }
    
    try {
      const doc = await usersDB.get(session.value.userId)
      const updatedDoc = {
        ...doc,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      await usersDB.put(updatedDoc)
      userProfile.value = { ...updatedDoc, password: undefined }
      
      if (updates.name) {
        session.value.name = updates.name
        localStorage.setItem('absensi_session', JSON.stringify(session.value))
      }
      
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
  
  const initSession = () => {
    const savedSession = getSession()
    if (savedSession) {
      session.value = savedSession
      fetchUserProfile()
    }
  }
  
  return {
    session,
    userProfile,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    userName,
    userRole,
    userId,
    login,
    completeLogin,
    logout,
    fetchUserProfile,
    updateProfile,
    initSession
  }
})
