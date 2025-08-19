import { useState, useEffect } from 'react'

export const useServiceWorkerUpdate = () => {
  const [waitingWorker, setWaitingWorker] = useState(null)
  const [showReload, setShowReload] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Service Worker foi atualizado, recarregar página
        window.location.reload()
      })

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'RELOAD_PAGE') {
          window.location.reload()
        }
      })

      // Verificar se há atualização pendente
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker)
              setShowReload(true)
            }
          })
        })
      })
    }
  }, [])

  const reloadPage = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  const forceCacheClear = () => {
    // Limpar todos os caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName)
        })
      })
    }
    
    // Limpar localStorage (exceto dados importantes)
    const keysToKeep = ['usuarioLogado', 'loginUnificadoLembrar']
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key)
      }
    })
    
    reloadPage()
  }

  return {
    showReload,
    reloadPage,
    forceCacheClear
  }
}
