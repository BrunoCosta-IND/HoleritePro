import { useState, useEffect } from 'react'
import { supabase } from '@/lib/utils'

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState('default')
  const [subscription, setSubscription] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkSupport()
    checkPermission()
  }, [])

  const checkSupport = () => {
    // Detectar iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    
    // No iOS, notificações push em PWAs têm limitações
    // Vamos usar notificações locais como fallback
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && !isIOS
    const iosSupported = isIOS && 'Notification' in window
    
    setIsSupported(supported || iosSupported)
    return supported || iosSupported
  }

  const checkPermission = async () => {
    if (!checkSupport()) return

    const permission = await Notification.permission
    setPermission(permission)
    return permission
  }

  const requestPermission = async () => {
    if (!checkSupport()) {
      throw new Error('Notificações não são suportadas neste navegador')
    }

    setIsLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      
      if (permission === 'granted') {
        // No iOS, usar notificações locais em vez de push
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        
        if (isIOS) {
          // Para iOS, apenas salvar que o usuário permitiu notificações
          await saveIOSNotificationPermission()
        } else {
          await subscribeToPush()
        }
      }
      
      return permission
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToPush = async () => {
    try {
      // Registrar service worker se ainda não estiver registrado
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      // Aguardar o service worker estar ativo
      await navigator.serviceWorker.ready

      // Verificar se já existe uma subscription
      const existingSubscription = await registration.pushManager.getSubscription()
      
      if (existingSubscription) {
        setSubscription(existingSubscription)
        return existingSubscription
      }

      // Criar nova subscription
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || '')
      })

      setSubscription(newSubscription)
      
      // Salvar subscription no banco de dados
      await saveSubscriptionToDatabase(newSubscription)
      
      return newSubscription
    } catch (error) {
      console.error('Erro ao subscrever para notificações push:', error)
      throw error
    }
  }

  const saveSubscriptionToDatabase = async (subscription) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('Usuário não autenticado, não é possível salvar subscription')
        return
      }

      const subscriptionData = {
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(subscriptionData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Erro ao salvar subscription:', error)
        throw error
      }

      console.log('Subscription salva com sucesso')
    } catch (error) {
      console.error('Erro ao salvar subscription no banco:', error)
      throw error
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        setSubscription(null)
        
        // Remover do banco de dados
        await removeSubscriptionFromDatabase()
      }
    } catch (error) {
      console.error('Erro ao cancelar subscription:', error)
      throw error
    }
  }

  const removeSubscriptionFromDatabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Erro ao remover subscription:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro ao remover subscription do banco:', error)
      throw error
    }
  }

  const saveIOSNotificationPermission = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return
      }

      const permissionData = {
        user_id: user.id,
        platform: 'ios',
        notification_enabled: true,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(permissionData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Erro ao salvar permissão iOS:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro ao salvar permissão iOS no banco:', error)
      throw error
    }
  }

  const sendNotification = (title, options = {}) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [100, 50, 100],
        ...options
      })
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    isLoading,
    requestPermission,
    unsubscribeFromPush,
    sendNotification
  }
}

// Função auxiliar para converter VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
