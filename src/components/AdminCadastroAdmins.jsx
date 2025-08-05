import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Shield,
  Building2,
  CheckCircle,
  AlertTriangle,
  Users,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/utils'

const AdminCadastroAdmins = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const [acessoNegado, setAcessoNegado] = useState(false)
  const [verificando, setVerificando] = useState(true)
  
  // Verificação de permissão de administrador
  useEffect(() => {
    console.log('🔍 Verificando permissão de admin...')
    
    try {
      const usuarioLogado = localStorage.getItem('usuarioLogado')
      console.log('📋 Dados do localStorage:', usuarioLogado)
      
      if (!usuarioLogado) {
        console.log('❌ Nenhum usuário logado')
        setAcessoNegado(true)
        setVerificando(false)
        return
      }
      
      const dados = JSON.parse(usuarioLogado)
      console.log('👤 Dados do usuário:', dados)
      
      if (!dados || dados.tipo !== 'admin') {
        console.log('❌ Usuário não é admin:', dados?.tipo)
        setAcessoNegado(true)
      } else {
        console.log('✅ Usuário é admin - acesso permitido')
        setAcessoNegado(false)
      }
    } catch (error) {
      console.error('❌ Erro ao verificar permissão:', error)
      setAcessoNegado(true)
    } finally {
      setVerificando(false)
    }
  }, [])

  // Mostrar loading enquanto verifica
  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-zinc-900 p-8 rounded-xl shadow-xl text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <h1 className="text-xl font-semibold text-white mb-2">Verificando permissão...</h1>
          <p className="text-gray-300">Aguarde enquanto verificamos seu acesso.</p>
        </div>
      </div>
    )
  }

  if (acessoNegado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-zinc-900 p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso negado</h1>
          <p className="text-gray-300 mb-4">Você não tem permissão para acessar esta página.</p>
          <Button 
            onClick={() => navigate('/admin')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Lista de administradores existentes
  const [adminsExistentes, setAdminsExistentes] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })

  // Estados de controle
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [erroSupabase, setErroSupabase] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Buscar administradores existentes
  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('tipo', 'admin')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar administradores:', error)
        setAdminsExistentes([])
      } else {
        setAdminsExistentes(data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar administradores:', error)
      setAdminsExistentes([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória'
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme a senha'
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErroSupabase('')

    try {
      // Verificar se email já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        setErroSupabase('Este email já está cadastrado')
        setIsLoading(false)
        return
      }

      // Criar novo administrador
      const { data, error } = await supabase
        .from('funcionarios')
        .insert([
          {
            nome: formData.nomeCompleto,
            email: formData.email,
            senha: formData.senha,
            tipo: 'admin',
            cargo: 'Administrador'
          }
        ])
        .select()

      if (error) {
        console.error('Erro ao criar administrador:', error)
        setErroSupabase('Erro ao criar administrador. Tente novamente.')
      } else {
        console.log('✅ Administrador criado com sucesso:', data)
        setShowSuccess(true)
        setFormData({
          nomeCompleto: '',
          email: '',
          senha: '',
          confirmarSenha: ''
        })
        
        // Recarregar lista de administradores
        fetchAdmins()
        
        // Esconder mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      setErroSupabase('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAdmin = async (admin) => {
    if (!confirm(`Tem certeza que deseja excluir o administrador ${admin.nome}?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', admin.id)

      if (error) {
        console.error('Erro ao excluir administrador:', error)
        alert('Erro ao excluir administrador')
      } else {
        console.log('✅ Administrador excluído com sucesso')
        fetchAdmins()
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      alert('Erro inesperado ao excluir administrador')
    }
  }

  const handleVoltar = () => {
    navigate('/admin')
  }

  const adminsFiltrados = adminsExistentes.filter(admin =>
    admin.nome.toLowerCase().includes(busca.toLowerCase()) ||
    admin.email.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cadastro de Administradores
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gerencie contas de administrador
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleVoltar}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de cadastro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Novo Administrador</span>
              </CardTitle>
              <CardDescription>
                Preencha os dados para criar uma nova conta de administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome Completo */}
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nomeCompleto"
                      type="text"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                      className={`pl-10 ${errors.nomeCompleto ? 'border-red-500' : ''}`}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  {errors.nomeCompleto && (
                    <p className="text-sm text-red-500">{errors.nomeCompleto}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Digite o email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
                      className={`pr-10 ${errors.senha ? 'border-red-500' : ''}`}
                      placeholder="Digite a senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.senha && (
                    <p className="text-sm text-red-500">{errors.senha}</p>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      className={`pr-10 ${errors.confirmarSenha ? 'border-red-500' : ''}`}
                      placeholder="Confirme a senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-sm text-red-500">{errors.confirmarSenha}</p>
                  )}
                </div>

                {/* Botão de envio */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Administrador
                    </>
                  )}
                </Button>
              </form>

              {/* Mensagens de feedback */}
              {showSuccess && (
                <Alert className="mt-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Administrador criado com sucesso!
                  </AlertDescription>
                </Alert>
              )}

              {erroSupabase && (
                <Alert className="mt-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {erroSupabase}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Lista de administradores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Administradores Existentes</span>
              </CardTitle>
              <CardDescription>
                Gerencie as contas de administrador do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="mb-4">
                <Input
                  placeholder="Buscar administradores..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Lista */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Carregando...</p>
                  </div>
                ) : adminsFiltrados.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {busca ? 'Nenhum administrador encontrado' : 'Nenhum administrador cadastrado'}
                    </p>
                  </div>
                ) : (
                  adminsFiltrados.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {admin.nome}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          Admin
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAdmin(admin)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminCadastroAdmins 