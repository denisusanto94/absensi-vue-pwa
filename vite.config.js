import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Sistem Absensi PWA',
        short_name: 'Absensi',
        description: 'Aplikasi Absensi QR Code Offline-First',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
    {
      name: 'email-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/api/send-email') && req.method === 'POST') {
            console.log('\x1b[36m%s\x1b[0m', 'Email Proxy received request...');
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                const nodemailer = await import('nodemailer');
                
                const transporter = nodemailer.default.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'tognw.deni@gmail.com',
                    pass: 'mklw decl pokx dbib'
                  }
                });

                // Setup attachments if QRCodeData is present
                const attachments = [];
                if (data.QRCodeData) {
                  attachments.push({
                    filename: 'qrcode.png',
                    content: data.QRCodeData.split("base64,")[1],
                    encoding: 'base64',
                    cid: '2fa-qr-code' // Same as used in HTML: cid:2fa-qr-code
                  });
                }

                await transporter.sendMail({
                  from: '"Sistem Absensi PWA" <tognw.deni@gmail.com>',
                  to: data.To,
                  subject: data.Subject,
                  html: data.Body,
                  attachments: attachments
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                console.log('\x1b[32m%s\x1b[0m', 'Email sent successfully with CID attachment!');
              } catch (error) {
                console.error('Email Proxy Logic Error:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
              }
            });
            
            req.on('error', (err) => {
              console.error('Request stream error:', err);
              res.statusCode = 500;
              res.end();
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
