/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Serves api/chat.ts during `npm run dev`, so the chatbot works locally without
 * Vercel. Reads GEMINI_API_KEY (and optional GEMINI_MODEL) from .env (server-side only, never bundled).
 * The key is read once at startup: restart `npm run dev` after changing it.
 */
function devApi(): Plugin {
  return {
    name: 'askowly-dev-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      if (env.GEMINI_MODEL?.trim()) process.env.GEMINI_MODEL = env.GEMINI_MODEL.trim()
      if (env.GEMINI_API_KEY?.trim()) {
        process.env.GEMINI_API_KEY = env.GEMINI_API_KEY.trim()
        server.config.logger.info('  /api/chat: GEMINI_API_KEY loaded (server-side only).')
      } else if (!process.env.VITEST) {
        server.config.logger.warn(
          '\n  /api/chat: no GEMINI_API_KEY in .env, so the chat will answer in limited on-device mode.\n' +
            '  Add it to .env, then restart npm run dev.\n',
        )
      }

      server.middlewares.use('/api/chat', async (req, res) => {
        let raw = ''
        for await (const chunk of req) raw += chunk
        let body: unknown = {}
        try {
          body = raw ? JSON.parse(raw) : {}
        } catch {
          /* handler rejects the empty body */
        }
        // Minimal stand-in for the Vercel request/response helpers the handler uses.
        const vres = Object.assign(res, {
          status(code: number) {
            res.statusCode = code
            return vres
          },
          json(data: unknown) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return vres
          },
        })
        try {
          const { default: handler } = await server.ssrLoadModule('/api/chat.ts')
          await handler(Object.assign(req, { body }), vres)
        } catch (error) {
          // Never hang the request: report a sanitized error the client understands.
          server.config.logger.error(`[api/chat] dev handler crashed: ${error instanceof Error ? error.name : 'unknown'}`)
          if (!res.headersSent) vres.status(500).json({ error: 'upstream_error', code: 'upstream_error' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    devApi(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AskOwly',
        short_name: 'AskOwly',
        description: 'A friendly owl helper for medicines, gentle movement, and spotting scams.',
        theme_color: '#FFE9C7',
        background_color: '#FFF7EB',
        display: 'standalone',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Keep the fonts after the first visit so the app looks the same offline.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
