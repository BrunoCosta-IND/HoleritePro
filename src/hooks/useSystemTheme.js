import { useState, useEffect } from 'react'

export const useSystemTheme = () => {
  const [theme, setTheme] = useState('system')
  const [systemTheme, setSystemTheme] = useState('light')

  useEffect(() => {
    // Detectar tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newTheme)
      
      // Se o tema está configurado como 'system', aplicar automaticamente
      if (theme === 'system') {
        applyTheme(newTheme)
      }
    }

    // Definir tema inicial
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    
    // Aplicar tema inicial
    if (theme === 'system') {
      applyTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    // Listener para mudanças no tema do sistema
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const applyTheme = (newTheme) => {
    const root = document.documentElement
    
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }

  const setThemeMode = (newTheme) => {
    setTheme(newTheme)
    
    if (newTheme === 'system') {
      applyTheme(systemTheme)
    } else {
      applyTheme(newTheme)
    }
    
    // Salvar preferência
    localStorage.setItem('theme', newTheme)
  }

  // Carregar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme !== 'system') {
        applyTheme(savedTheme)
      }
    }
  }, [])

  return {
    theme,
    systemTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  }
}
