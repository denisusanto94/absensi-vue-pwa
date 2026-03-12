export const send2FAEmail = async (toEmail, qrCodeDataUrl) => {
  const subject = "🔐 QR Code Autentikasi 2FA - Sistem Absensi PWA"
  
  // Pretty HTML Body with CID placeholder
  const body = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Sistem Absensi PWA</h1>
      </div>
      <div style="padding: 40px; background: white; text-align: center;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Siapkan Autentikasi 2FA Anda</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">
          Gunakan aplikasi <b>Google Authenticator</b> atau aplikasi TOTP lainnya untuk memindai kode QR di bawah ini demi keamanan akun Anda.
        </p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; display: inline-block; border: 2px dashed #e2e8f0;">
          <img src="cid:2fa-qr-code" alt="QR Code 2FA" style="width: 200px; height: 200px; display: block;" />
        </div>
        <div style="margin-top: 30px; padding: 15px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a;">
          <p style="color: #92400e; font-size: 13px; margin: 0;">
            Jangan bagikan kode QR ini kepada siapapun untuk menjaga keamanan akun Anda.
          </p>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Sistem Absensi PWA. Automated Security Email.
      </div>
    </div>
  `

  try {
    // Try local API first (Vite Dev Server Proxy)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        To: toEmail,
        Subject: subject,
        Body: body,
        QRCodeData: qrCodeDataUrl // Send base64 separately
      })
    })

    if (response.ok) {
      return { success: true }
    }

    // Fallback to SmtpJS (Note: SmtpJS might still struggle with base64 embedded in body)
    console.warn('Local email API failed, trying SmtpJS...')
    if (typeof Email !== 'undefined') {
      const smtpRes = await Email.send({
        Host: "smtp.gmail.com",
        Username: "tognw.deni@gmail.com",
        Password: "mklw decl pokx dbib",
        To: toEmail,
        From: "tognw.deni@gmail.com",
        Subject: subject,
        Body: body.replace('cid:2fa-qr-code', qrCodeDataUrl) // Replace CID with base64 for SmtpJS
      })
      
      if (smtpRes === 'OK') return { success: true }
      return { success: false, error: smtpRes }
    }
    
    return { success: false, error: 'Email service unreachable' }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}
