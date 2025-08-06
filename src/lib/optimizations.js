// Otimizações para reduzir uso do Supabase Free

import { supabase } from './utils'

// Cache local para reduzir consultas
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Função para cache com expiração
export const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Otimizar consulta de funcionários
export const getFuncionariosOptimized = async () => {
  const cacheKey = 'funcionarios'
  const cached = getCachedData(cacheKey)
  
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from('funcionarios')
    .select('id, nome, cpf, email, cargo')
    .eq('ativo', true)
    .order('nome')
  
  if (!error) {
    setCachedData(cacheKey, data)
  }
  
  return { data, error }
}

// Otimizar consulta de configurações
export const getConfiguracoesOptimized = async () => {
  const cacheKey = 'configuracoes'
  const cached = getCachedData(cacheKey)
  
  if (cached) {
    return cached
  }
  
  const { data, error } = await supabase
    .from('empresa_config')
    .select('*')
    .limit(1)
    .single()
  
  if (!error) {
    setCachedData(cacheKey, data)
  }
  
  return { data, error }
}

// Limpar cache quando necessário
export const clearCache = (key = null) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
} 