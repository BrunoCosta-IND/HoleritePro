import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  X, 
  User, 
  Phone, 
  Building2,
  Sun,
  Moon,
  CheckCircle,
  AlertTriangle,
  Users,
  CreditCard
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { supabase } from '../lib/supabaseClient'

const AdminCadastroFuncionarios = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  
  // Configurações da empresa
  const [empresaConfig, setEmpresaConfig] = useState({
    nome: 'Minha Empresa Personalizada',
    corBotoes: '#ff6b35',
    limiteFuncionarios: 50 // Limite configurado pelo Criador
  })

  // Lista de funcionários existentes (simulado)
  const [funcionariosExistentes, setFuncionariosExistentes] = useState([
    { cpf: '123.456.789-00', nome: 'João Silva' },
    { cpf: '987.654.321-00', nome: 'Maria Santos' }
  ])

  // Dados do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    whatsapp: '',
    cargo: '',
    status: 'Ativo',
    email: ''
  })

  // Estados de controle
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLimitAlert, setShowLimitAlert] = useState(false)
  const [senhaGerada, setSenhaGerada] = useState('')
  const [erroSupabase, setErroSupabase] = useState('')
  const [senhaResetada, setSenhaResetada] = useState('')
  const [emailResetado, setEmailResetado] = useState('')

  useEffect(() => {
    // Carregar configurações do localStorage
    const configSalva = localStorage.getItem('empresaConfig')
    if (configSalva) {
      setEmpresaConfig(prev => ({ ...prev, ...JSON.parse(configSalva) }))
    }

    // Buscar funcionários do Supabase
    const fetchFuncionarios = async () => {
      const { data, error } = await supabase.from('funcionarios').select('*')
      if (!error && data) {
        setFuncionariosExistentes(data)
      }
    }
    fetchFuncionarios()

    // Verificar se atingiu o limite
    // (isso será atualizado após buscar do Supabase)
    // eslint-disable-next-line
  }, [])

  // Máscara para WhatsApp
  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  // Validação de CPF
  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '')
    if (numbers.length !== 11) return false
    
    // Verificar se não é uma sequência de números iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false
    
    // Algoritmo de validação do CPF
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(numbers.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    return remainder === parseInt(numbers.charAt(10))
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cpf') {
      formattedValue = value.replace(/\D/g, '') // Aceita só números
    } else if (field === 'whatsapp') {
      formattedValue = formatWhatsApp(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar nome completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório'
    } else if (formData.nomeCompleto.trim().length < 3) {
      newErrors.nomeCompleto = 'Nome deve ter pelo menos 3 caracteres'
    }

    // Validar CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    } else if (funcionariosExistentes.some(f => f.cpf === formData.cpf)) {
      newErrors.cpf = 'CPF já cadastrado no sistema'
    }

    // Validar WhatsApp
    if (!formData.whatsapp) {
      newErrors.whatsapp = 'WhatsApp é obrigatório'
    } else {
      const numbers = formData.whatsapp.replace(/\D/g, '')
      if (numbers.length < 10 || numbers.length > 11) {
        newErrors.whatsapp = 'WhatsApp deve ter 10 ou 11 dígitos'
      }
    }

    // Validar cargo
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'Cargo é obrigatório'
    }

    // Validar e-mail
    if (!formData.email || !/.+@.+\..+/.test(formData.email)) {
      newErrors.email = 'E-mail válido é obrigatório'
    }

    // Verificar limite de funcionários
    if (funcionariosExistentes.length >= empresaConfig.limiteFuncionarios) {
      newErrors.limite = 'Limite máximo de funcionários atingido para este plano'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const gerarSenha = () => {
    // Gera uma senha aleatória de 8 caracteres
    return nanoid(8)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErroSupabase('')

    // Gerar senha aleatória
    const senha = gerarSenha()
    setSenhaGerada(senha)

    // Definir e-mail para cadastro (usar o campo de e-mail real)
    const email = formData.email
    if (!email) {
      setErroSupabase('E-mail é obrigatório para cadastro no Supabase.')
      setIsLoading(false)
      return
    }

    // Cadastro no Supabase Auth
    const { data: signUpData, error: supabaseError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome: formData.nomeCompleto,
          cpf: formData.cpf,
          whatsapp: formData.whatsapp,
          cargo: formData.cargo,
          status: formData.status
        }
      }
    })
    if (supabaseError) {
      setErroSupabase('Erro ao cadastrar funcionário no Supabase: ' + supabaseError.message)
      setIsLoading(false)
      return
    }

    // Cadastro na tabela funcionarios
    const { error: insertError } = await supabase
      .from('funcionarios')
      .insert([
        {
          email,
          nome: formData.nomeCompleto,
          cpf: formData.cpf,
          whatsapp: formData.whatsapp,
          cargo: formData.cargo,
          status: formData.status
        }
      ])
    if (insertError) {
      setErroSupabase('Funcionário criado no Auth, mas falhou ao salvar na tabela funcionarios: ' + insertError.message)
      setIsLoading(false)
      return
    }

    // Simular salvamento local
    setTimeout(() => {
      setFuncionariosExistentes(prev => [...prev, {
        cpf: formData.cpf,
        nome: formData.nomeCompleto,
        whatsapp: formData.whatsapp,
        cargo: formData.cargo,
        status: formData.status,
        senha,
        email
      }])

      // Limpar formulário
      setFormData({
        nomeCompleto: '',
        cpf: '',
        whatsapp: '',
        cargo: '',
        status: 'Ativo',
        email: ''
      })

      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }, 1000)
  }

  // Função para resetar senha
  const handleResetSenha = async (email) => {
    setErroSupabase('')
    setSenhaResetada('')
    setEmailResetado('')
    const novaSenha = gerarSenha()
    try {
      const response = await fetch('http://localhost:3001/api/resetar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, novaSenha }),
      })
      const result = await response.json()
      if (!response.ok) {
        setErroSupabase('Erro ao resetar senha: ' + result.error)
        return
      }
      setSenhaResetada(novaSenha)
      setEmailResetado(email)
    } catch (err) {
      setErroSupabase('Erro de conexão com o backend.')
    }
  }

  // Função para apagar funcionário
  const handleDeleteFuncionario = async (cpf) => {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('cpf', cpf);

    if (!error) {
      setFuncionariosExistentes(prev => prev.filter(f => f.cpf !== cpf));
    } else {
      alert('Erro ao apagar funcionário: ' + error.message);
    }
  };

  const funcionariosRestantes = empresaConfig.limiteFuncionarios - funcionariosExistentes.length

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
                onClick={() => navigate('/admin-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cadastro de Funcionários</h1>
                <p className="text-sm text-muted-foreground">Adicionar novo funcionário ao sistema</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{funcionariosRestantes} vagas restantes</span>
              </Badge>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Alerta de limite */}
          {showLimitAlert && (
            <Alert className="mb-6 bg-red-900/50 border-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                Limite máximo de funcionários atingido para este plano. Contate o suporte para expandir.
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de sucesso */}
          {showSuccess && (
            <Alert className="mb-6 bg-green-900/50 border-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">
                Funcionário cadastrado com sucesso! Um link de primeiro acesso será enviado via WhatsApp.<br />
                <span className="font-bold">Senha gerada: {senhaGerada}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de erro do Supabase */}
          {erroSupabase && (
            <Alert className="mb-6 bg-red-900/50 border-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {erroSupabase}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensagem de senha resetada */}
          {senhaResetada && emailResetado && (
            <Alert className="mb-6 bg-yellow-900/50 border-yellow-700">
              <AlertDescription className="text-yellow-200">
                Senha resetada para <b>{emailResetado}</b>: <span className="font-bold">{senhaResetada}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Dados do Funcionário</span>
              </CardTitle>
              <CardDescription>
                Preencha as informações do funcionário. Ele receberá um link via WhatsApp para validar os dados e criar sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome completo */}
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    placeholder="Digite o nome completo do funcionário"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                    className={errors.nomeCompleto ? 'border-red-500' : ''}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-sm text-red-500">{errors.nomeCompleto}</p>
                  )}
                </div>

                {/* CPF */}
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="Digite o CPF (apenas números)"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    maxLength={11}
                    className={errors.cpf ? 'border-red-500' : ''}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500">{errors.cpf}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      maxLength={15}
                      className={`pl-10 ${errors.whatsapp ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-sm text-red-500">{errors.whatsapp}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Obrigatório para recebimento de notificações sobre holerites
                  </p>
                </div>

                {/* Cargo */}
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    placeholder="Ex: Analista, Gerente, Assistente..."
                    value={formData.cargo}
                    onChange={(e) => handleInputChange('cargo', e.target.value)}
                    className={errors.cargo ? 'border-red-500' : ''}
                  />
                  {errors.cargo && (
                    <p className="text-sm text-red-500">{errors.cargo}</p>
                  )}
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    placeholder="Digite o e-mail real do funcionário"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Erro de limite */}
                {errors.limite && (
                  <Alert className="bg-red-900/50 border-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      {errors.limite}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || showLimitAlert}
                    className="flex-1"
                    style={{ backgroundColor: empresaConfig.corBotoes }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Cadastrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Salvar Funcionário</span>
                      </div>
                    )}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => navigate('/admin-dashboard')}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Funcionários Cadastrados */}
          {funcionariosExistentes.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Funcionários Cadastrados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-200">
                    <thead className="bg-zinc-800">
                      <tr>
                        <th className="px-4 py-2">Nome</th>
                        <th className="px-4 py-2">CPF</th>
                        <th className="px-4 py-2">WhatsApp</th>
                        <th className="px-4 py-2">Cargo</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funcionariosExistentes.map((f, idx) => (
                        <tr key={f.cpf + idx} className="border-b border-zinc-700">
                          <td className="px-4 py-2">{f.nome || f.nomeCompleto}</td>
                          <td className="px-4 py-2">{f.cpf}</td>
                          <td className="px-4 py-2">{f.whatsapp || '-'}</td>
                          <td className="px-4 py-2">{f.cargo || '-'}</td>
                          <td className="px-4 py-2">{f.status || 'Ativo'}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              className="text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded transition"
                              title="Apagar funcionário"
                              onClick={() => handleDeleteFuncionario(f.cpf)}
                            >
                              Apagar
                            </button>
                            <button
                              type="button"
                              className="text-yellow-400 hover:text-yellow-600 font-bold px-2 py-1 rounded transition ml-2"
                              title="Resetar senha"
                              onClick={() => handleResetSenha(f.email)}
                            >
                              Resetar Senha
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações adicionais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Informações do Plano</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Funcionários Cadastrados</p>
                  <p className="text-muted-foreground">{funcionariosExistentes.length} de {empresaConfig.limiteFuncionarios}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Vagas Restantes</p>
                  <p className="text-muted-foreground">{funcionariosRestantes} funcionários</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Custo Mensal</p>
                  <p className="text-muted-foreground">R$ {funcionariosExistentes.length * 5},00/mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminCadastroFuncionarios

