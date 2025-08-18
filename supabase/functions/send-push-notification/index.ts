import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subscription, payload } = await req.json()

    if (!subscription || !payload) {
      throw new Error('Subscription e payload são obrigatórios')
    }

    // Enviar notificação push usando Web Push API
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'TTL': '86400', // 24 horas
        'Urgency': 'high',
        'Authorization': `vapid t=${generateVAPIDToken(subscription)}`
      },
      body: JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        data: payload.data,
        actions: payload.actions
      })
    })

    if (!response.ok) {
      throw new Error(`Erro ao enviar notificação: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notificação enviada com sucesso' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro ao enviar notificação push:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Função para gerar token VAPID
function generateVAPIDToken(subscription: any) {
  const vapidKeys = {
    publicKey: 'BN-gRzQww0YLqvtirDISPr6hzAZJv3yYUaSkzeIF4xikiikhu7VYr9AHmG0YCBBByfNGe9qNv9wSnoKZVhnq1puw',
    privateKey: 'Y93JJLJF8PWu8FDULuYVTVqkadQDHTRO_xK7mkDvpyRs'
  }
  
  // Implementação básica do token VAPID
  // Em produção, você deve usar uma biblioteca como web-push
  const header = {
    typ: 'JWT',
    alg: 'ES256'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    aud: new URL(subscription.endpoint).origin,
    exp: now + 12 * 60 * 60, // 12 horas
    sub: 'mailto:admin@empresa.com'
  }
  
  // Por simplicidade, retornando um token básico
  // Em produção, use: return webpush.generateVAPIDHeaders(subscription.endpoint, vapidKeys.publicKey, vapidKeys.privateKey)
  return btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload)) + '.signature'
}
