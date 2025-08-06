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
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react'
import { supabase } from '@/lib/utils'

const AdminCadastroAdmins = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  
  // TODOS OS HOOKS DEVEM SER DECLARADOS ANTES DE QUALQUER RETORNO CONDICIONAL
  const [acessoNegado, setAcessoNegado] = useState(false)
  const [adminsExistentes, setAdminsExistentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [erroSupabase, setErroSupabase] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [busca, setBusca] = useState('')

  // Verificação de permissão de administrador
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    if (!usuarioLogado || usuarioLogado.tipo !== 'admin') {
      setAcessoNegado(true)
    }
  }, [])

  // Carregar administradores quando componente montar
  useEffect(() => {
    if (!acessoNegado) {
      fetchAdmins()
    }
  }, [acessoNegado])

  // Buscar administradores existentes
  const fetchAdmins = async () => {
    try {
      // Buscar apenas na tabela 'funcionarios'
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('tipo', 'admin')
        .order('created_at', { ascending: false })

      if (error) {
        setAdminsExistentes([])
      } else {
        setAdminsExistentes(data || [])
      }
    } catch (error) {
      setAdminsExistentes([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    let processedValue = value
    
    // Formatar CPF automaticamente
    if (field === 'cpf') {
      // Remover todos os caracteres não numéricos
      const cpfLimpo = value.replace(/\D/g, '')
      // Aplicar máscara: 000.000.000-00
      if (cpfLimpo.length <= 3) {
        processedValue = cpfLimpo
      } else if (cpfLimpo.length <= 6) {
        processedValue = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`
      } else if (cpfLimpo.length <= 9) {
        processedValue = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`
      } else {
        processedValue = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
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

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else {
      // Remover caracteres não numéricos para validação
      const cpfLimpo = formData.cpf.replace(/\D/g, '')
      
      if (cpfLimpo.length !== 11) {
        newErrors.cpf = 'CPF deve ter 11 dígitos'
      } else if (!validarCPF(cpfLimpo)) {
        newErrors.cpf = 'CPF inválido'
      }
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

  // Função para validar CPF (versão simplificada e confiável)
  const validarCPF = (cpf) => {
    // Remover caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    if (cpfLimpo.length !== 11) {
      return false
    }
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return false
    }
    
    // Algoritmo de validação de CPF
    let soma = 0
    let peso = 10
    
    // Primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * peso
      peso--
    }
    
    let digito = 11 - (soma % 11)
    if (digito > 9) digito = 0
    
    if (parseInt(cpfLimpo.charAt(9)) !== digito) {
      return false
    }
    
    // Segundo dígito verificador
    soma = 0
    peso = 11
    
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * peso
      peso--
    }
    
    digito = 11 - (soma % 11)
    if (digito > 9) digito = 0
    
    if (parseInt(cpfLimpo.charAt(10)) !== digito) {
      return false
    }
    
    return true
  }

  // Função para testar CPFs conhecidos
  const testarCPF = () => {
    const cpfsTeste = [
      '111.444.777-35', // CPF válido conhecido
      '123.456.789-09', // CPF inválido
      '000.000.000-00'  // CPF inválido (todos iguais)
    ]
    
    console.log('🧪 Testando validação de CPF...')
    cpfsTeste.forEach(cpf => {
      console.log(`Testando: ${cpf} → ${validarCPF(cpf) ? 'VÁLIDO' : 'INVÁLIDO'}`)
    })
  }

  // Testar CPF quando componente montar
  useEffect(() => {
    testarCPF()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErroSupabase('')
    setShowSuccess(false)

    try {
      // Verificar se email já existe na tabela funcionarios
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

      // Verificar se CPF já existe na tabela funcionarios
      const cpfLimpo = formData.cpf.replace(/\D/g, '')
      const { data: existingCPF, error: checkCPFError } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('cpf', cpfLimpo)
        .single()

      if (existingCPF) {
        setErroSupabase('Este CPF já está cadastrado')
        setIsLoading(false)
        return
      }

      // Criar novo administrador na tabela funcionarios
      const { data, error } = await supabase
        .from('funcionarios')
        .insert([
          {
            nome: formData.nomeCompleto,
            email: formData.email,
            cpf: cpfLimpo,
            senha: formData.senha,
            whatsapp: '(00) 00000-0000',
            cargo: 'Administrador',
            tipo: 'admin'
          }
        ])
        .select()

      if (error) {
        setErroSupabase('Erro ao criar administrador. Tente novamente.')
      } else {
        setShowSuccess(true)
        setFormData({
          nomeCompleto: '',
          email: '',
          cpf: '',
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
      setErroSupabase('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAdmin = async (admin) => {
    try {
      // Excluir da tabela funcionarios
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', admin.id)

      if (error) {
        return
      }
      
      fetchAdmins()
    } catch (error) {
      // Erro silencioso
    }
  }

  const adminsFiltrados = adminsExistentes.filter(admin =>
    admin.nome.toLowerCase().includes(busca.toLowerCase()) ||
    admin.email.toLowerCase().includes(busca.toLowerCase())
  )

  if (acessoNegado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-zinc-900 p-8 rounded-xl shadow-xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Acesso negado</h1>
          <p className="text-gray-300">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cadastro de Administradores</h1>
                <p className="text-sm text-muted-foreground">Gerencie as contas de administrador</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de cadastro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Novo Administrador</span>
              </CardTitle>
              <CardDescription>
                Cadastre um novo administrador no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome Completo */}
                <div>
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    type="text"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                    placeholder="Digite o nome completo"
                    className={errors.nomeCompleto ? 'border-red-500' : ''}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-sm text-red-500 mt-1">{errors.nomeCompleto}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="admin@empresa.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    className={errors.cpf ? 'border-red-500' : ''}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <Label htmlFor="senha">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
                      placeholder="Digite a senha"
                      className={`pr-10 ${errors.senha ? 'border-red-500' : ''}`}
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
                    <p className="text-sm text-red-500 mt-1">{errors.senha}</p>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      placeholder="Confirme a senha"
                      className={`pr-10 ${errors.confirmarSenha ? 'border-red-500' : ''}`}
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
                    <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha}</p>
                  )}
                </div>

                {/* Botão de envio */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
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

                {/* Mensagens de feedback */}
                {showSuccess && (
                  <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      Administrador criado com sucesso!
                    </AlertDescription>
                  </Alert>
                )}

                {erroSupabase && (
                  <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {erroSupabase}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Lista de administradores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Administradores Cadastrados</span>
                <Badge variant="secondary">{adminsExistentes.length}</Badge>
              </CardTitle>
              <CardDescription>
                Gerencie os administradores existentes
              </CardDescription>
              
              {/* Busca */}
              <div className="mt-4">
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Carregando administradores...</p>
                </div>
              ) : adminsFiltrados.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {adminsFiltrados.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{admin.nome}</p>
                            <p className="text-xs text-muted-foreground">{admin.email}</p>
                            <p className="text-xs text-muted-foreground">{admin.cargo || 'Administrador'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          Admin
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum administrador cadastrado</p>
                  <p className="text-sm">Cadastre o primeiro administrador usando o formulário ao lado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminCadastroAdmins 