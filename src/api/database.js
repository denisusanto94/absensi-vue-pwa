import Dexie from 'dexie'

const db = new Dexie('AbsensiDB')

db.version(1).stores({
  users: '_id, email, role, name, department, isActive, createdAt',
  attendance: '_id, userId, date, type, createdAt, latitude, longitude, alamat_lengkap, kota, kecamatan, kelurahan, kabupaten, kode_pos',
  leaveRequests: '_id, userId, status, type, startDate, endDate, createdAt'
})

export const usersDB = {
  async get(id) {
    const doc = await db.users.get(id)
    if (!doc) throw { status: 404, message: 'not found' }
    return doc
  },
  
  async put(doc) {
    await db.users.put(doc)
    return { ok: true, id: doc._id, rev: '1' }
  },
  
  async find({ selector }) {
    let query = db.users.toCollection()
    
    if (selector.email) {
      const results = await db.users.where('email').equals(selector.email).toArray()
      return { docs: results }
    }
    
    if (selector.role) {
      if (selector.role.$in) {
        const results = await db.users.where('role').anyOf(selector.role.$in).toArray()
        return { docs: results }
      }
      const results = await db.users.where('role').equals(selector.role).toArray()
      return { docs: results }
    }
    
    const results = await db.users.toArray()
    return { docs: results }
  },
  
  async allDocs({ include_docs }) {
    const docs = await db.users.toArray()
    return {
      rows: docs.map(doc => ({ id: doc._id, doc }))
    }
  },
  
  async remove(doc) {
    await db.users.delete(doc._id)
    return { ok: true }
  },
  
  async createIndex() {
    return { ok: true }
  }
}

export const attendanceDB = {
  async get(id) {
    const doc = await db.attendance.get(id)
    if (!doc) throw { status: 404, message: 'not found' }
    return doc
  },
  
  async put(doc) {
    await db.attendance.put(doc)
    return { ok: true, id: doc._id, rev: '1' }
  },
  
  async find({ selector, sort }) {
    let results = []
    
    if (selector.userId && selector.date) {
      if (typeof selector.date === 'object' && selector.date.$gte && selector.date.$lte) {
        results = await db.attendance
          .where('userId').equals(selector.userId)
          .and(item => item.date >= selector.date.$gte && item.date <= selector.date.$lte)
          .toArray()
      } else {
        results = await db.attendance
          .where(['userId', 'date']).equals([selector.userId, selector.date])
          .toArray()
      }
    } else if (selector.userId) {
      results = await db.attendance.where('userId').equals(selector.userId).toArray()
    } else if (selector.date) {
      if (typeof selector.date === 'object' && selector.date.$gte && selector.date.$lte) {
        results = await db.attendance
          .where('date').between(selector.date.$gte, selector.date.$lte, true, true)
          .toArray()
      } else {
        results = await db.attendance.where('date').equals(selector.date).toArray()
      }
    } else {
      results = await db.attendance.toArray()
    }
    
    if (sort && sort[0]?.date === 'desc') {
      results.sort((a, b) => b.date.localeCompare(a.date))
    }
    
    return { docs: results }
  },
  
  async remove(doc) {
    await db.attendance.delete(doc._id)
    return { ok: true }
  },
  
  async createIndex() {
    return { ok: true }
  }
}

export const leaveRequestsDB = {
  async get(id) {
    const doc = await db.leaveRequests.get(id)
    if (!doc) throw { status: 404, message: 'not found' }
    return doc
  },
  
  async put(doc) {
    await db.leaveRequests.put(doc)
    return { ok: true, id: doc._id, rev: '1' }
  },
  
  async find({ selector, sort }) {
    let results = []
    
    if (selector.userId && selector.status) {
      results = await db.leaveRequests
        .where('userId').equals(selector.userId)
        .and(item => item.status === selector.status)
        .toArray()
    } else if (selector.userId) {
      results = await db.leaveRequests.where('userId').equals(selector.userId).toArray()
    } else if (selector.status) {
      results = await db.leaveRequests.where('status').equals(selector.status).toArray()
    } else {
      results = await db.leaveRequests.toArray()
    }
    
    if (sort && sort[0]?.createdAt === 'desc') {
      results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    
    return { docs: results }
  },
  
  async remove(doc) {
    await db.leaveRequests.delete(doc._id)
    return { ok: true }
  },
  
  async createIndex() {
    return { ok: true }
  }
}

export const createIndexes = async () => {
  console.log('Database indexes ready (Dexie)')
}

export const startAllSync = () => {
  console.log('Sync not available in Dexie mode')
}

export const stopAllSync = () => {
  console.log('Sync stopped')
}

export default db
