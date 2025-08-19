import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/utils'

export const useOptimizedDB = () => {
  const [cache, setCache] = useState({})
  const [pendingOperations, setPendingOperations] = useState(new Set())
  const timeoutRefs = useRef({})

  // Função para limpar timeouts
  const clearTimeout = useCallback((key) => {
    if (timeoutRefs.current[key]) {
      window.clearTimeout(timeoutRefs.current[key])
      delete timeoutRefs.current[key]
    }
  }, [])

  // Função para executar operação com timeout
  const executeWithTimeout = useCallback(async (operation, timeout = 10000, key = null) => {
    const operationPromise = operation()
    
    const timeoutPromise = new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout após ${timeout}ms`))
      }, timeout)
      
      if (key) {
        timeoutRefs.current[key] = timeoutId
      }
    })

    try {
      const result = await Promise.race([operationPromise, timeoutPromise])
      if (key) clearTimeout(key)
      return result
    } catch (error) {
      if (key) clearTimeout(key)
      throw error
    }
  }, [clearTimeout])

  // Função para inserir com otimizações
  const optimizedInsert = useCallback(async (table, data, options = {}) => {
    const { timeout = 5000, useCache = false, cacheKey = null } = options
    
    const operation = async () => {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select(options.select ? '*' : undefined)
      
      if (error) throw error
      
      // Invalidar cache se necessário
      if (useCache && cacheKey) {
        setCache(prev => {
          const newCache = { ...prev }
          delete newCache[cacheKey]
          return newCache
        })
      }
      
      return result
    }

    return executeWithTimeout(operation, timeout, `insert_${table}`)
  }, [executeWithTimeout])

  // Função para buscar com cache
  const optimizedSelect = useCallback(async (table, query, options = {}) => {
    const { timeout = 5000, useCache = true, cacheKey = null, cacheTTL = 30000 } = options
    
    // Verificar cache primeiro
    if (useCache && cacheKey && cache[cacheKey]) {
      const cached = cache[cacheKey]
      if (Date.now() - cached.timestamp < cacheTTL) {
        return cached.data
      }
    }

    const operation = async () => {
      let queryBuilder = supabase.from(table).select(query.select || '*')
      
      // Aplicar filtros
      if (query.filters) {
        query.filters.forEach(filter => {
          queryBuilder = queryBuilder[filter.method](filter.column, filter.value)
        })
      }
      
      // Aplicar ordenação
      if (query.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, { ascending: query.orderBy.ascending })
      }
      
      // Aplicar limite
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit)
      }

      const { data, error } = await queryBuilder
      
      if (error) throw error
      
      // Salvar no cache
      if (useCache && cacheKey) {
        setCache(prev => ({
          ...prev,
          [cacheKey]: {
            data,
            timestamp: Date.now()
          }
        }))
      }
      
      return data
    }

    return executeWithTimeout(operation, timeout, `select_${table}`)
  }, [executeWithTimeout, cache])

  // Função para atualizar com otimizações
  const optimizedUpdate = useCallback(async (table, data, conditions, options = {}) => {
    const { timeout = 5000, useCache = false, cacheKey = null } = options
    
    const operation = async () => {
      let queryBuilder = supabase.from(table).update(data)
      
      // Aplicar condições
      if (conditions) {
        conditions.forEach(condition => {
          queryBuilder = queryBuilder[condition.method](condition.column, condition.value)
        })
      }
      
      const { data: result, error } = await queryBuilder
      
      if (error) throw error
      
      // Invalidar cache se necessário
      if (useCache && cacheKey) {
        setCache(prev => {
          const newCache = { ...prev }
          delete newCache[cacheKey]
          return newCache
        })
      }
      
      return result
    }

    return executeWithTimeout(operation, timeout, `update_${table}`)
  }, [executeWithTimeout])

  // Função para executar operações em lote
  const batchOperation = useCallback(async (operations, options = {}) => {
    const { timeout = 15000, parallel = true } = options
    
    const operation = async () => {
      if (parallel) {
        const results = await Promise.allSettled(operations.map(op => op()))
        return results.map((result, index) => ({
          index,
          success: result.status === 'fulfilled',
          data: result.status === 'fulfilled' ? result.value : result.reason
        }))
      } else {
        const results = []
        for (let i = 0; i < operations.length; i++) {
          try {
            const result = await operations[i]()
            results.push({ index: i, success: true, data: result })
          } catch (error) {
            results.push({ index: i, success: false, data: error })
          }
        }
        return results
      }
    }

    return executeWithTimeout(operation, timeout, 'batch_operation')
  }, [executeWithTimeout])

  // Função para limpar cache
  const clearCache = useCallback((pattern = null) => {
    if (pattern) {
      setCache(prev => {
        const newCache = {}
        Object.keys(prev).forEach(key => {
          if (!key.includes(pattern)) {
            newCache[key] = prev[key]
          }
        })
        return newCache
      })
    } else {
      setCache({})
    }
  }, [])

  // Função para limpar todos os timeouts
  const clearAllTimeouts = useCallback(() => {
    Object.keys(timeoutRefs.current).forEach(key => {
      clearTimeout(key)
    })
  }, [clearTimeout])

  return {
    optimizedInsert,
    optimizedSelect,
    optimizedUpdate,
    batchOperation,
    clearCache,
    clearAllTimeouts,
    cache,
    pendingOperations
  }
}
