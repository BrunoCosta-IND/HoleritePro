import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Settings, Mail, Lock } from 'lucide-react'
import { supabase } from '@/lib/utils'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useIOSNotifications } from '@/hooks/useIOSNotifications'

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
  // Pré-carregar credenciais salvas e sessão existente
  useEffect(() => {
    // Se já existe usuário logado, redirecionar
    const usuarioLogado = localStorage.getItem('usuarioLogado')
    if (usuarioLogado) {
      const dados = JSON.parse(usuarioLogado)
      if (dados?.tipo === 'admin') {
        navigate('/admin')
      } else if (dados?.tipo === 'funcionario') {
        navigate('/funcionario-dashboard')
      }
      return
    }

    // Preencher formulário com credenciais lembradas
    const lembrado = localStorage.getItem('loginUnificadoLembrar')
    if (lembrado) {
      try {
        const { usuario, senha } = JSON.parse(lembrado)
        setFormData({ usuario: usuario || '', senha: senha || '' })
        setLembrar(true)
      } catch {}
    }
  }, [navigate])
  
  // Hook para notificações push
  const { requestPermission, isSupported } = usePushNotifications()
  
  // Hook específico para iOS
  const { requestPermission: requestIOSPermission, isIOS } = useIOSNotifications()

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
      // Login de admin pelo e-mail - verificar em ambas as tabelas
      let data = null
      let error = null
      
      // Primeiro, tentar na tabela usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', usuario)
        .eq('senha', senha)
        .eq('tipo', 'admin')
        .single()
      
      if (userData) {
        data = userData
      } else {
        // Se não encontrou na tabela usuarios, tentar na tabela funcionarios
        const { data: funcData, error: funcError } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('email', usuario)
          .eq('senha', senha)
          .eq('tipo', 'admin')
          .single()
        
        if (funcData) {
          data = funcData
        } else {
          error = funcError || userError
        }
      }
      
      if (error || !data) {
        setError('E-mail ou senha incorretos.')
        setIsLoading(false)
        setMsg('')
        return
      }
      setMsg('Login realizado com sucesso! Bem-vindo, ' + data.nome)
      localStorage.setItem('usuarioLogado', JSON.stringify({ ...data, tipo: 'admin' }))
      setTimeout(() => {
        navigate('/admin')
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
      
      // Solicitar permissão de notificação para funcionários
      if (isIOS) {
        // Para iOS, usar hook específico
        try {
          await requestIOSPermission()
        } catch (error) {
          console.log('Erro ao solicitar permissão de notificação iOS:', error)
        }
      } else if (isSupported) {
        // Para outros dispositivos, usar hook padrão
        try {
          await requestPermission()
        } catch (error) {
          console.log('Erro ao solicitar permissão de notificação:', error)
        }
      }
      
      setTimeout(() => {
        navigate('/funcionario-dashboard')
      }, 1000)
      setIsLoading(false)
      return
    }
  }

  const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundUrl})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sistema de Holerites</h1>
              <p className="text-muted-foreground">Faça login para continuar</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {error && (
            <Alert className="mb-4 border-red-500/20 bg-red-500/10 text-red-600">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {msg && !error && (
            <Alert className="mb-4 border-green-500/20 bg-green-500/10 text-green-600">
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-sm font-medium">
                E-mail (Admin) ou CPF (Funcionário)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="admin@empresa.com ou 111.222.333-44"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lembrar"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="lembrar" className="text-sm text-muted-foreground">
                Lembrar de mim
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>


        </div>
      </div>
    </div>
  )
}

export default LoginUnificado 