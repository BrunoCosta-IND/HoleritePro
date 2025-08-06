// Monitoramento de uso do Supabase Free

// Contador de requisições
let requestCount = 0
const MAX_REQUESTS_PER_DAY = 50000 // Limite aproximado do plano free

// Função para monitorar uso
export const monitorSupabaseUsage = () => {
  requestCount++
  
  // Alertar quando próximo do limite
  if (requestCount > MAX_REQUESTS_PER_DAY * 0.8) {
    console.warn('⚠️ Aproximando limite de requisições do Supabase Free')
  }
  
  // Resetar contador diariamente
  const now = new Date()
  const lastReset = localStorage.getItem('supabase_request_reset')
  
  if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
    requestCount = 0
    localStorage.setItem('supabase_request_reset', now.toISOString())
  }
  
  // Salvar contador
  localStorage.setItem('supabase_request_count', requestCount.toString())
}

// Função para obter estatísticas
export const getSupabaseStats = () => {
  const count = parseInt(localStorage.getItem('supabase_request_count') || '0')
  const percentage = (count / MAX_REQUESTS_PER_DAY) * 100
  
  return {
    requests: count,
    limit: MAX_REQUESTS_PER_DAY,
    percentage: percentage.toFixed(2),
    remaining: MAX_REQUESTS_PER_DAY - count
  }
}

// Função para verificar se está próximo do limite
export const isNearLimit = () => {
  const stats = getSupabaseStats()
  return stats.percentage > 80
} 