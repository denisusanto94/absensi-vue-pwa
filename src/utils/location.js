export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung oleh browser ini'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        let message = 'Gagal mendapatkan lokasi'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Akses lokasi ditolak. Silakan izinkan akses lokasi.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Informasi lokasi tidak tersedia.'
            break
          case error.TIMEOUT:
            message = 'Waktu permintaan lokasi habis.'
            break
        }
        
        reject(new Error(message))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180
  
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

export const isWithinRadius = (userLat, userLon, officeLat, officeLon, radiusMeters = 100) => {
  const distance = calculateDistance(userLat, userLon, officeLat, officeLon)
  return {
    isWithin: distance <= radiusMeters,
    distance: Math.round(distance)
  }
}

export const formatCoordinates = (latitude, longitude) => {
  const latDirection = latitude >= 0 ? 'N' : 'S'
  const lonDirection = longitude >= 0 ? 'E' : 'W'
  
  return `${Math.abs(latitude).toFixed(6)}° ${latDirection}, ${Math.abs(longitude).toFixed(6)}° ${lonDirection}`
}

export const getGoogleMapsUrl = (latitude, longitude) => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export const watchLocation = (callback, errorCallback) => {
  if (!navigator.geolocation) {
    errorCallback(new Error('Geolocation tidak didukung'))
    return null
  }
  
  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
    },
    (error) => {
      errorCallback(error)
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

export const clearLocationWatch = (watchId) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}
