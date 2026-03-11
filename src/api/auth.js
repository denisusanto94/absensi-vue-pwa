import { usersDB } from './database'

const SESSION_KEY = 'absensi_session'

export const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const login = async (email, password) => {
  try {
    const result = await usersDB.find({
      selector: { email: email.toLowerCase() }
    })
    
    if (result.docs.length === 0) {
      throw new Error('Email tidak ditemukan')
    }
    
    const user = result.docs[0]
    const hashedPassword = await hashPassword(password)
    
    if (user.password !== hashedPassword) {
      throw new Error('Password salah')
    }
    
    if (!user.isActive) {
      throw new Error('Akun tidak aktif. Hubungi admin.')
    }
    
    const session = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      loginAt: new Date().toISOString()
    }
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    
    return { success: true, user: session }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const logout = () => {
  localStorage.removeItem(SESSION_KEY)
}

export const getSession = () => {
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}

export const isAuthenticated = () => {
  return getSession() !== null
}

export const hasRole = (requiredRole) => {
  const session = getSession()
  if (!session) return false
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(session.role)
  }
  
  return session.role === requiredRole
}

export const isAdmin = () => hasRole('admin')

export const isUser = () => hasRole(['user', 'admin'])

export const register = async (userData) => {
  try {
    const existingUser = await usersDB.find({
      selector: { email: userData.email.toLowerCase() }
    })
    
    if (existingUser.docs.length > 0) {
      throw new Error('Email sudah terdaftar')
    }
    
    const hashedPassword = await hashPassword(userData.password)
    
    const newUser = {
      _id: `user_${Date.now()}`,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'user',
      department: userData.department || '',
      phone: userData.phone || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await usersDB.put(newUser)
    
    return { success: true, user: { ...newUser, password: undefined } }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const initDefaultAdmin = async () => {
  try {
    const admins = await usersDB.find({
      selector: { role: 'admin' }
    })
    
    if (admins.docs.length === 0) {
      const defaultAdmin = {
        _id: 'user_admin_default',
        email: 'admin@absensi.com',
        password: await hashPassword('admin123'),
        name: 'Administrator',
        role: 'admin',
        department: 'IT',
        phone: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await usersDB.put(defaultAdmin)
      console.log('Default admin created: admin@absensi.com / admin123')
    }
  } catch (error) {
    console.error('Error initializing default admin:', error)
  }
}
