import { createRouter, createWebHistory } from 'vue-router'
import { getSession } from '@/api/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: ['user', 'admin'] },
    children: [
      {
        path: '',
        redirect: '/user/dashboard'
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('@/views/user/Dashboard.vue')
      },
      {
        path: 'scan-absen',
        name: 'ScanAbsen',
        component: () => import('@/views/user/ScanAbsen.vue')
      },
      {
        path: 'pengajuan-cuti',
        name: 'PengajuanCuti',
        component: () => import('@/views/user/PengajuanCuti.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'manage-users',
        name: 'ManageUsers',
        component: () => import('@/views/admin/ManageUsers.vue')
      },
      {
        path: 'rekap-absensi',
        name: 'RekapAbsensi',
        component: () => import('@/views/admin/RekapAbsensi.vue')
      },
      {
        path: 'approval-cuti',
        name: 'ApprovalCuti',
        component: () => import('@/views/admin/ApprovalCuti.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const session = getSession()
  const isAuthenticated = session !== null
  
  if (to.meta.requiresGuest && isAuthenticated) {
    if (session.role === 'admin') {
      return next('/admin/dashboard')
    }
    return next('/user/dashboard')
  }
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }
  
  if (to.meta.role && isAuthenticated) {
    const requiredRole = to.meta.role
    const userRole = session.role
    
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return next('/user/dashboard')
      }
    } else if (requiredRole !== userRole) {
      if (userRole === 'admin') {
        return next('/admin/dashboard')
      }
      return next('/user/dashboard')
    }
  }
  
  next()
})

export default router
