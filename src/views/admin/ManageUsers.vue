<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="page-title mb-4 sm:mb-0">Kelola Karyawan</h1>
      <BaseButton variant="primary" @click="openModal()">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Tambah Karyawan
      </BaseButton>
    </div>
    
    <div class="card">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari karyawan..."
            class="input pl-10"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <select v-model="filterRole" class="input w-auto">
          <option value="">Semua Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500">Tidak ada data karyawan</p>
      </div>
      
      <div v-else class="overflow-x-auto -mx-6 px-6">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
              <th class="hidden md:table-cell text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th class="hidden lg:table-cell text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departemen</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th class="hidden sm:table-cell text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user._id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <span class="text-primary-700 font-bold text-xs">
                      {{ getInitials(user.name) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 text-sm leading-none">{{ user.name }}</p>
                    <p class="md:hidden text-[10px] text-gray-500 mt-1">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="hidden md:table-cell py-4 px-4 text-sm text-gray-600 truncate max-w-[150px]">{{ user.email }}</td>
              <td class="hidden lg:table-cell py-4 px-4 text-sm text-gray-600 capitalize">{{ user.department || '-' }}</td>
              <td class="py-4 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="hidden sm:table-cell py-4 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ user.isActive ? 'Aktif' : 'Off' }}
                </span>
              </td>
              <td class="py-4 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end space-x-1">
                  <button
                    @click="openModal(user)"
                    class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="[
                      'p-2 rounded-lg transition-colors',
                      user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="user.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 overflow-y-auto"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
          <div class="fixed inset-0 bg-black bg-opacity-50" @click="closeModal" />
          
          <div class="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle bg-white rounded-2xl shadow-xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ editingUser ? 'Edit Karyawan' : 'Tambah Karyawan' }}
            </h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <BaseInput
                v-model="form.name"
                label="Nama Lengkap"
                placeholder="Masukkan nama"
                required
              />
              
              <BaseInput
                v-model="form.email"
                type="email"
                label="Email"
                placeholder="email@perusahaan.com"
                :disabled="!!editingUser"
                required
              />
              
              <BaseInput
                v-if="!editingUser"
                v-model="form.password"
                type="password"
                label="Password"
                placeholder="Minimal 6 karakter"
                required
              />
              
              <BaseInput
                v-model="form.department"
                label="Departemen"
                placeholder="Masukkan departemen"
              />
              
              <BaseInput
                v-model="form.phone"
                label="Telepon"
                placeholder="08xxxxxxxxxx"
              />
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select v-model="form.role" class="input" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ submitError }}</p>
              </div>
              
              <div class="flex space-x-3 pt-4">
                <BaseButton type="button" variant="secondary" @click="closeModal" class="flex-1">
                  Batal
                </BaseButton>
                <BaseButton type="submit" variant="primary" :loading="submitting" class="flex-1">
                  {{ editingUser ? 'Simpan' : 'Tambah' }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { usersDB } from '@/api/database'
import { register, hashPassword } from '@/api/auth'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const users = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterRole = ref('')
const showModal = ref(false)
const editingUser = ref(null)
const submitting = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  department: '',
  phone: '',
  role: 'user'
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !filterRole.value || user.role === filterRole.value
    return matchesSearch && matchesRole
  })
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

const loadUsers = async () => {
  loading.value = true
  try {
    const result = await usersDB.allDocs({ include_docs: true })
    users.value = result.rows
      .map(row => row.doc)
      .filter(doc => doc._id && !doc._id.startsWith('_design'))
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const openModal = (user = null) => {
  editingUser.value = user
  submitError.value = ''
  
  if (user) {
    form.name = user.name
    form.email = user.email
    form.password = ''
    form.department = user.department || ''
    form.phone = user.phone || ''
    form.role = user.role
  } else {
    form.name = ''
    form.email = ''
    form.password = ''
    form.department = ''
    form.phone = ''
    form.role = 'user'
  }
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

const handleSubmit = async () => {
  submitError.value = ''
  submitting.value = true
  
  try {
    if (editingUser.value) {
      const doc = await usersDB.get(editingUser.value._id)
      
      doc.name = form.name
      doc.department = form.department
      doc.phone = form.phone
      doc.role = form.role
      doc.updatedAt = new Date().toISOString()
      
      await usersDB.put(doc)
    } else {
      if (form.password.length < 6) {
        submitError.value = 'Password minimal 6 karakter'
        submitting.value = false
        return
      }
      
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department,
        phone: form.phone,
        role: form.role
      })
      
      if (!result.success) {
        submitError.value = result.error
        submitting.value = false
        return
      }
    }
    
    await loadUsers()
    closeModal()
  } catch (error) {
    submitError.value = error.message
  } finally {
    submitting.value = false
  }
}

const toggleUserStatus = async (user) => {
  try {
    const doc = await usersDB.get(user._id)
    doc.isActive = !doc.isActive
    doc.updatedAt = new Date().toISOString()
    await usersDB.put(doc)
    await loadUsers()
  } catch (error) {
    console.error('Error toggling user status:', error)
  }
}

onMounted(() => {
  loadUsers()
})
</script>
