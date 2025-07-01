import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Settings } from 'lucide-react'

// Função genérica para login via Baserow
async function loginBaserow(email, senha, tableId) {
  const token = 'QWD51BL7wHeIyccSLWEgWoT9JCWkdc8z'
  const url = `https://api.baserow.io/api/database/rows/table/${tableId}/?user_field_names=true&filter__email__equal=${encodeURIComponent(email)}&filter__senha__equal=${encodeURIComponent(senha)}`

  const res = await fetch(url, {
    headers: { Authorization: `Token ${token}` }
  })
  const data = await res.json()
  if (data.count > 0) {
    // Login OK, retorna o usuário
    return data.results[0]
  } else {
    // Login inválido
    return null
  }
}

const LoginUnificado = ({ theme, toggleTheme }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lembrar, setLembrar] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  // Simulação de dados
  const admins = [
    { email: 'admin@empresa.com', senha: '123456' }
  ]
  const funcionarios = [
    { cpf: '123.456.789-00', nome: 'João Silva', senha: '123456' },
    { cpf: '987.654.321-00', nome: 'Maria Santos', senha: '123456' },
    { cpf: '111.444.777-35', nome: 'Pedro Oliveira Santos', senha: '123456' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMsg('Verificando...')

    const { usuario, senha } = formData
    if (!usuario || !senha) {
      setError('Preencha todos os campos.')
      setIsLoading(false)
      return
    }

    if (lembrar) {
      localStorage.setItem('loginUnificadoLembrar', JSON.stringify({ usuario, senha }))
    } else {
      localStorage.removeItem('loginUnificadoLembrar')
    }

    // Verifica se é e-mail ou CPF
    const isEmail = usuario.includes('@')

    if (isEmail) {
      // Login de admin pelo e-mail
      const adminResponse = await fetch(`https://api.baserow.io/api/database/rows/table/591349/?user_field_names=true&filter__email__equal=${encodeURIComponent(usuario)}&filter__senha__equal=${encodeURIComponent(senha)}`, {
        headers: { Authorization: 'Token QWD51BL7wHeIyccSLWEgWoT9JCWkdc8z' }
      })
      const adminData = await adminResponse.json()
      const admin = adminData.count > 0 ? adminData.results[0] : null
      if (admin) {
        setMsg('Login realizado com sucesso! Bem-vindo, ' + admin.nome)
        localStorage.setItem('usuarioLogado', JSON.stringify({ ...admin, tipo: 'admin' }))
        setTimeout(() => {
          navigate('/admin-dashboard')
        }, 1000)
        setIsLoading(false)
        return
      } else {
        setError('E-mail ou senha incorretos.')
        setIsLoading(false)
        return
      }
    } else {
      // Login de funcionário pelo CPF
      const url = `https://api.baserow.io/api/database/rows/table/591365/?user_field_names=true&filter__cpf__equal=${encodeURIComponent(usuario)}&filter__senha__equal=${encodeURIComponent(senha)}`
      const res = await fetch(url, {
        headers: { Authorization: 'Token QWD51BL7wHeIyccSLWEgWoT9JCWkdc8z' }
      })
      const data = await res.json()
      const funcionario = data.count > 0 ? data.results[0] : null
      if (funcionario) {
        setMsg('Login realizado com sucesso! Bem-vindo, ' + funcionario.nome)
        localStorage.setItem('usuarioLogado', JSON.stringify({ ...funcionario, tipo: 'funcionario' }))
        setTimeout(() => {
          navigate('/funcionario-dashboard')
        }, 1000)
        setIsLoading(false)
        return
      }
    }

    setMsg('E-mail/CPF ou senha inválidos.')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <div className="w-full h-screen flex rounded-3xl shadow-2xl bg-black overflow-hidden relative">
        {/* Lado esquerdo: Formulário */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-16 py-20 h-full">
          <h1 className="text-4xl font-bold text-white mb-8">
            Faça seu login
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">.</span>
          </h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="usuario" className="text-gray-300 mb-1">E-mail (Admin) ou CPF (Funcionário)</Label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Digite seu e-mail ou CPF"
                value={formData.usuario}
                onChange={handleInputChange}
                required
                className="w-10/12 mx-auto px-4 py-2 rounded-lg bg-black text-white border-2 border-transparent focus:border-[3px] focus:border-purple-500 focus:ring-0 focus:outline-none shadow-[0_0_8px_0_rgba(168,85,247,0.5)] transition-all duration-200"
                style={{ boxShadow: '0 0 8px 0 rgba(168,85,247,0.5), 0 0 0 2px transparent' }}
              />
            </div>
            <div>
              <Label htmlFor="senha" className="text-gray-300 mb-1">Senha</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-slate-200 p-0"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                  className="w-10/12 mx-auto px-4 py-2 pl-10 rounded-lg bg-black text-white border-2 border-transparent focus:border-[3px] focus:border-purple-500 focus:ring-0 focus:outline-none shadow-[0_0_8px_0_rgba(168,85,247,0.5)] transition-all duration-200"
                  style={{ boxShadow: '0 0 8px 0 rgba(168,85,247,0.5), 0 0 0 2px transparent' }}
                />
              </div>
            </div>
            {/* Checkbox lembrar login e senha */}
            <div className="flex items-center space-x-2">
              <input
                id="lembrar"
                type="checkbox"
                checked={lembrar}
                onChange={e => setLembrar(e.target.checked)}
                className="accent-purple-500 w-4 h-4 rounded"
              />
              <Label htmlFor="lembrar" className="text-gray-300 cursor-pointer select-none">
                Lembrar login e senha
              </Label>
            </div>
            {error && (
              <Alert className="bg-red-900/50 border-red-700 animate-shake">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-10/12 mx-auto py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition mt-2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                <span>Entrar</span>
              )}
            </Button>
          </form>
          <div style={{ marginTop: 16, minHeight: 24, textAlign: 'center', color: msg.includes('sucesso') ? '#22c55e' : '#f87171' }}>{msg}</div>
        </div>
        {/* Lado direito: Imagem com fade */}
        <div className="hidden md:block w-1/2 h-full relative">
          <img
            src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80"
            alt="Paisagem noturna"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/0 pointer-events-none" />
        </div>
        {/* Engrenagem flutuante para login do criador */}
        <div
          onClick={() => navigate('/criador-login')}
          className="absolute bottom-6 right-6 z-50 cursor-pointer group"
          aria-label="Acessar login do criador"
          tabIndex={0}
          role="button"
        >
          <Settings className="h-8 w-8 text-white drop-shadow-lg opacity-80 transition-transform duration-300 group-hover:rotate-180 group-focus:rotate-180" />
        </div>
      </div>
    </div>
  )
}

export default LoginUnificado 