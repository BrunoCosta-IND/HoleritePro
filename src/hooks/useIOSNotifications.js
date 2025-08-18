import { useState, useEffect } from 'react'
import { supabase } from '@/lib/utils'

export const useIOSNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    checkIOS()
    checkPermission()
  }, [])

  const checkIOS = () => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(ios)
    return ios
  }

  const checkPermission = async () => {
    if (!checkIOS()) return false
    
    const permission = await Notification.permission
    setHasPermission(permission === 'granted')
    return permission === 'granted'
  }

  const requestPermission = async () => {
    if (!checkIOS()) {
      throw new Error('Este dispositivo não é iOS')
    }

    try {
      const permission = await Notification.requestPermission()
      setHasPermission(permission === 'granted')
      
      if (permission === 'granted') {
        await saveIOSPermission()
      }
      
      return permission
    } catch (error) {
      console.error('Erro ao solicitar permissão iOS:', error)
      throw error
    }
  }

  const saveIOSPermission = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

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
      } else {
        console.log('Permissão iOS salva com sucesso')
      }
    } catch (error) {
      console.error('Erro ao salvar permissão iOS:', error)
    }
  }

  const checkPendingNotifications = async () => {
    if (!checkIOS() || !hasPermission) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Buscar notificações pendentes para este usuário
      const { data: pendingNotifications, error } = await supabase
        .from('pending_notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('sent', false)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar notificações pendentes:', error)
        return
      }

      // Mostrar notificações pendentes
      pendingNotifications?.forEach(notification => {
        showLocalNotification(notification.title, notification.body, notification.data)
        
        // Marcar como enviada
        markNotificationAsSent(notification.id)
      })

    } catch (error) {
      console.error('Erro ao verificar notificações pendentes:', error)
    }
  }

  const showLocalNotification = (title, body, data = {}) => {
    if (!hasPermission) return

    const notification = new Notification(title, {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [100, 50, 100],
      data
    })

    // Adicionar listener para clique
    notification.onclick = () => {
      window.focus()
      notification.close()
      
      // Navegar para a página apropriada
      if (data.url) {
        window.location.href = data.url
      }
    }
  }

  const markNotificationAsSent = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('pending_notifications')
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) {
        console.error('Erro ao marcar notificação como enviada:', error)
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como enviada:', error)
    }
  }

  return {
    isIOS,
    hasPermission,
    requestPermission,
    checkPendingNotifications,
    showLocalNotification
  }
}
