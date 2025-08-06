import { useState, useEffect } from 'react'

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar se o app já está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true
      
      setIsInstalled(isStandalone)
      
      if (isStandalone) {
        setIsInstallable(false)
      }
    }

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listener para o evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    // Verificar se o navegador suporta PWA
    const checkPWASupport = () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window
      
      if (!isSupported) {
        setIsInstallable(false)
      }
    }

    // Registrar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Verificações iniciais
    checkIfInstalled()
    checkPWASupport()

    // Verificar periodicamente se o app foi instalado
    const interval = setInterval(checkIfInstalled, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearInterval(interval)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const sendNotification = (title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      })
    }
  }

  return {
    isInstallable,
    isInstalled,
    installApp,
    requestNotificationPermission,
    sendNotification
  }
} 