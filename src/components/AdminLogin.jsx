import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Settings, Mail, Lock } from 'lucide-react'
import { supabase } from '@/lib/utils'

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

    // Verifica se é e-mail (admin) ou CPF (funcionário)
    const isEmail = usuario.includes('@')

    if (isEmail) {
      // Login de admin pelo e-mail
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', usuario)
        .eq('senha', senha) // Em produção, use senha criptografada!
        .eq('tipo', 'admin')
        .single()
      if (error || !data) {
        setError('E-mail ou senha incorretos.')
        setIsLoading(false)
        setMsg('')
        return
      }
      setMsg('Login realizado com sucesso! Bem-vindo, ' + data.nome)
      localStorage.setItem('usuarioLogado', JSON.stringify({ ...data, tipo: 'admin' }))
      setTimeout(() => {
        navigate('/admin-dashboard')
      }, 1000)
      setIsLoading(false)
      return
    } else {
      // Login de funcionário pelo CPF
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('cpf', usuario)
        .eq('senha', senha)
        .single()
      if (error || !data) {
        setError('CPF ou senha incorretos.')
        setIsLoading(false)
        setMsg('')
        return
      }
      setMsg('Login realizado com sucesso! Bem-vindo, ' + data.nome)
      localStorage.setItem('usuarioLogado', JSON.stringify({ ...data, tipo: 'funcionario' }))
      setTimeout(() => {
        navigate('/funcionario-dashboard')
      }, 1000)
      setIsLoading(false)
      return
    }
  }

  const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />
      {/* Formulário centralizado */}
      <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl bg-black/70 p-10 flex flex-col items-center">
        {/* Logo e nome */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <span className="text-lg font-semibold text-white tracking-wide">Gestão Holerites</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Acessar sua conta</h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
          {/* Campo de e-mail/CPF */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="E-mail (Admin) ou CPF (Funcionário)"
              value={formData.usuario}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/60 text-white border border-slate-700 focus:border-blue-500 focus:ring-0 focus:outline-none placeholder:text-slate-400"
            />
          </div>
          {/* Campo de senha */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-slate-200 p-0"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </Button>
            <input
              id="senha"
              name="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/60 text-white border border-slate-700 focus:border-blue-500 focus:ring-0 focus:outline-none placeholder:text-slate-400"
            />
          </div>
          {/* Checkbox lembrar login e senha */}
          <div className="flex items-center space-x-2">
            <input
              id="lembrar"
              type="checkbox"
              checked={lembrar}
              onChange={e => setLembrar(e.target.checked)}
              className="accent-blue-500 w-4 h-4 rounded"
            />
            <Label htmlFor="lembrar" className="text-gray-300 cursor-pointer select-none text-sm">
              Lembrar login e senha
            </Label>
          </div>
          {/* Mensagem de erro */}
          {error && (
            <Alert className="bg-red-900/50 border-red-700 animate-shake">
              <AlertDescription className="text-red-200 text-center">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {/* Botão entrar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2 justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verificando...</span>
              </div>
            ) : (
              <span>Entrar</span>
            )}
          </Button>
          {/* Mensagem de sucesso */}
          {msg && (
            <div
              className={`w-full mt-2 font-bold text-base text-center ${msg.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}
              style={{ minHeight: 24 }}
            >
              {msg}
            </div>
          )}
        </form>
        {/* Rodapé */}
        <div className="w-full text-center mt-8 text-xs text-gray-500">© 2024, Gestão Holerites</div>
      </div>
    </div>
  )
}

export default LoginUnificado 