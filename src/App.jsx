import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CriadorLogin from './components/CriadorLogin'
import CriadorDashboard from './components/CriadorDashboard'
import CriadorPersonalizacao from './components/CriadorPersonalizacao'
import CriadorFuncionalidades from './components/CriadorFuncionalidades'
import AdminDashboard from './components/AdminDashboard'
import AdminCadastroFuncionarios from './components/AdminCadastroFuncionarios'
import AdminUploadHolerites from './components/AdminUploadHolerites'
import FuncionarioLogin from './components/FuncionarioLogin'
import FuncionarioDashboard from './components/FuncionarioDashboard'
import FuncionarioHolerite from './components/FuncionarioHolerite'
import LoginUnificado from './components/AdminLogin'
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

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginUnificado theme={theme} toggleTheme={toggleTheme} />} />
          
          {/* Rotas do Criador */}
          <Route 
            path="/criador-login" 
            element={
              <CriadorLogin 
                theme={theme} 
                toggleTheme={toggleTheme} 
                setIsAuthenticated={setIsAuthenticated}
                setUserType={setUserType}
              />
            } 
          />
          <Route 
            path="/criador-dashboard" 
            element={<CriadorDashboard theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/criador-personalizacao" 
            element={<CriadorPersonalizacao theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/criador-funcionalidades" 
            element={<CriadorFuncionalidades theme={theme} toggleTheme={toggleTheme} />} 
          />
          
          {/* Rotas do Administrador */}
          <Route 
            path="/admin-dashboard" 
            element={<AdminDashboard theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/funcionarios/cadastrar" 
            element={<AdminCadastroFuncionarios theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/admin/holerites/upload" 
            element={<AdminUploadHolerites theme={theme} toggleTheme={toggleTheme} />} 
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
      </div>
    </Router>
  )
}

export default App

