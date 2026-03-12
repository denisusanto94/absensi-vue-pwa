import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'

export const generateOTPSecret = () => {
  // Generate a random secret
  return new OTPAuth.Secret({ size: 20 }).base32
}

export const generateOTPAuthUrl = (email, secret) => {
  const totp = new OTPAuth.TOTP({
    issuer: 'Sistem Absensi PWA',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  })
  return totp.toString()
}

export const generateQRCode = async (url) => {
  try {
    return await QRCode.toDataURL(url)
  } catch (err) {
    console.error('QR Code generation error:', err)
    return null
  }
}

export const verifyOTPToken = (token, secret) => {
  const totp = new OTPAuth.TOTP({
    issuer: 'Sistem Absensi PWA',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  })

  // Returns null if the token is invalid, or the delta if it is valid.
  // We use delta 1 to allow for some clock drift
  const delta = totp.validate({ token, window: 1 })
  return delta !== null
}
