import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Web Vitals monitoring - tracks Core Web Vitals for performance insights
const reportWebVitals = async () => {
  if (import.meta.env.PROD) {
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals')

    // Log to console in production for debugging
    const logVital = (metric: { name: string; value: number; rating: string }) => {
      console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)

      // Optional: Send to analytics endpoint
      // navigator.sendBeacon('/api/vitals', JSON.stringify(metric))
    }

    onCLS(logVital)   // Cumulative Layout Shift
    onFCP(logVital)   // First Contentful Paint
    onINP(logVital)   // Interaction to Next Paint
    onLCP(logVital)   // Largest Contentful Paint
    onTTFB(logVital)  // Time to First Byte
  }
}

// Register Service Worker for PWA
const registerSW = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({
      immediate: true,
      onRegistered(registration) {
        console.log('[PWA] Service Worker registered:', registration)
      },
      onRegisterError(error) {
        console.error('[PWA] Service Worker registration failed:', error)
      },
    })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize performance monitoring and PWA
reportWebVitals()
registerSW()
