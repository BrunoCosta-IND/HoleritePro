import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AdminDashboard from './components/AdminDashboard'
import AdminCadastroFuncionarios from './components/AdminCadastroFuncionarios'
import AdminCadastroAdmins from './components/AdminCadastroAdmins'
import AdminUploadHolerites from './components/AdminUploadHolerites'
import AdminConfiguracoes from './components/AdminConfiguracoes'
import AdminRelatorios from './components/AdminRelatorios'
import FuncionarioLogin from './components/FuncionarioLogin'
import FuncionarioDashboard from './components/FuncionarioDashboard'
import FuncionarioHolerite from './components/FuncionarioHolerite'
import LoginUnificado from './components/AdminLogin'
import PWAInstallBanner from './components/PWAInstallBanner'
import { startKeepAlive } from './lib/keepAlive'
import './App.css'

function App() {
  const [theme, setTheme] = useState('dark')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(null)

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Manter Supabase ativo (apenas em produção)
  useEffect(() => {
    if (import.meta.env.PROD) {
      startKeepAlive();
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginUnificado theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<LoginUnificado theme={theme} toggleTheme={toggleTheme} />} />
          
          {/* Rotas do Administrador */}
          <Route 
            path="/admin" 
            element={<AdminDashboard theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/funcionarios/cadastrar" 
            element={<AdminCadastroFuncionarios theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/admins/cadastrar" 
            element={<AdminCadastroAdmins theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/holerites/upload" 
            element={<AdminUploadHolerites theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/configuracoes" 
            element={<AdminConfiguracoes theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/relatorios" 
            element={<AdminRelatorios theme={theme} toggleTheme={toggleTheme} />} 
          />
          
          {/* Rotas do Funcionário */}
          <Route 
            path="/funcionario-login" 
            element={<FuncionarioLogin theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/funcionario-dashboard" 
            element={<FuncionarioDashboard theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/funcionario/holerite/:id" 
            element={<FuncionarioHolerite theme={theme} toggleTheme={toggleTheme} />} 
          />
        </Routes>
        
        {/* Banner de instalação PWA */}
        <PWAInstallBanner />
      </div>
    </Router>
  )
}

export default App

