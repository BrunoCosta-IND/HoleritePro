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
  CreditCard,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/utils'

const AdminCadastroFuncionarios = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const [acessoNegado, setAcessoNegado] = useState(false)
  
  // Verificação de permissão de administrador
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    if (!usuarioLogado || usuarioLogado.tipo !== 'admin') {
      setAcessoNegado(true)
    }
  }, [])

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

  // Configurações da empresa
  const [empresaConfig, setEmpresaConfig] = useState({
    nome: 'Sistema de Gestão de Holerites',
    corBotoes: '#ff6b35',
    limiteFuncionarios: 50
  })

  // Lista de funcionários existentes
  const [funcionariosExistentes, setFuncionariosExistentes] = useState([])
  const [loading, setLoading] = useState(true)

  // Dados do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    whatsapp: '',
    cargo: '',
    tipo: 'comum',
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
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarConfiguracoes()
    fetchFuncionarios()
  }, [])

  // Carregar configurações da empresa
  const carregarConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from('empresa_config')
        .select('*')
        .single()

      if (data && !error) {
        setEmpresaConfig({
          nome: data.nome || 'Sistema de Gestão de Holerites',
          corBotoes: data.cor_botoes || '#ff6b35',
          limiteFuncionarios: data.limite_funcionarios || 50
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  // Buscar funcionários do Supabase
  const fetchFuncionarios = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome')

      if (error) {
        console.error('Erro ao buscar funcionários:', error)
        setErroSupabase('Erro ao carregar funcionários')
      } else {
        setFuncionariosExistentes(data || [])
      }
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error)
      setErroSupabase('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  // Função para formatar WhatsApp
  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  // Função para formatar CPF
  function formatCPF(value) {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  // Função para validar CPF
  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return false
    
    // Para testes, aceita CPFs válidos
    return true
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value

    if (field === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (field === 'whatsapp') {
      formattedValue = formatWhatsApp(value)
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    // Limpar erro do campo
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

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }

    if (!formData.cargo.trim()) {
      newErrors.cargo = 'Cargo é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const gerarSenha = () => {
    const senha = Math.random().toString(36).slice(-8)
    setSenhaGerada(senha)
    return senha
  }

  // Função para enviar webhook quando funcionário for cadastrado
  const enviarWebhookFuncionarioCadastrado = async (funcionario) => {
    try {
      console.log('Verificando configurações do webhook...')
      
      // Buscar configurações do webhook
      const { data: webhookConfig, error: webhookError } = await supabase
        .from('webhook_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (webhookError) {
        console.error('Erro ao buscar configurações do webhook:', webhookError)
        return
      }

      if (!webhookConfig || webhookConfig.length === 0) {
        console.log('Nenhuma configuração de webhook encontrada')
        return
      }

      const config = webhookConfig[0]
      
      // Verificar se webhook está ativo e se evento de funcionário cadastrado está habilitado
      if (!config.ativo || !config.funcionario_cadastrado) {
        console.log('Webhook inativo ou evento de funcionário cadastrado desabilitado')
        return
      }

      if (!config.n8n_url) {
        console.log('URL do webhook não configurada')
        return
      }

      console.log('Enviando webhook para funcionário cadastrado...')
      
      const payload = {
        evento: 'funcionario_cadastrado',
        timestamp: new Date().toISOString(),
        funcionario: {
          nome: funcionario.nome,
          telefone: funcionario.whatsapp,
          cpf: funcionario.cpf,
          cargo: funcionario.cargo,
          email: funcionario.email
        },
        sistema: 'gestao-holerites'
      }

      console.log('Payload do webhook:', payload)

      const response = await fetch(config.n8n_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log('✅ Webhook enviado com sucesso para funcionário cadastrado')
      } else {
        console.error('❌ Erro ao enviar webhook:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('❌ Erro ao enviar webhook:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Verificar limite de funcionários
    if (funcionariosExistentes.length >= empresaConfig.limiteFuncionarios) {
      setShowLimitAlert(true)
      return
    }

    setIsLoading(true)
    setErroSupabase('')

    try {
      const senha = gerarSenha()
      
      // Verificar se CPF já existe
      const { data: funcionarioExistente, error: checkError } = await supabase
        .from('funcionarios')
        .select('cpf')
        .eq('cpf', formData.cpf)
        .single()

      if (funcionarioExistente) {
        setErrors({ cpf: 'CPF já cadastrado' })
        setIsLoading(false)
        return
      }

      // Verificar se email já existe
      const { data: emailExistente, error: emailCheckError } = await supabase
        .from('funcionarios')
        .select('email')
        .eq('email', formData.email)
        .single()

      if (emailExistente) {
        setErrors({ email: 'E-mail já cadastrado' })
        setIsLoading(false)
        return
      }

      // Preparar dados para inserção
      const dadosFuncionario = {
        nome: formData.nomeCompleto.trim(),
        cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
        whatsapp: formData.whatsapp,
        cargo: formData.cargo.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: senha,
        tipo: 'comum',
        ativo: true
      }

      console.log('Tentando inserir funcionário:', dadosFuncionario)

      // Inserir funcionário
      const { data, error } = await supabase
        .from('funcionarios')
        .insert([dadosFuncionario])
        .select()

      if (error) {
        console.error('Erro detalhado ao cadastrar funcionário:', error)
        
        // Mensagens de erro mais específicas
        let mensagemErro = 'Erro ao cadastrar funcionário'
        
        if (error.code === '23505') {
          if (error.message.includes('cpf')) {
            mensagemErro = 'CPF já está cadastrado no sistema'
          } else if (error.message.includes('email')) {
            mensagemErro = 'E-mail já está cadastrado no sistema'
          } else {
            mensagemErro = 'Dados duplicados encontrados'
          }
        } else if (error.code === '23514') {
          mensagemErro = 'Dados inválidos. Verifique os campos obrigatórios'
        } else if (error.code === '42P01') {
          mensagemErro = 'Erro de configuração do banco de dados'
        } else if (error.message) {
          mensagemErro = `Erro: ${error.message}`
        }
        
        setErroSupabase(mensagemErro)
      } else {
        console.log('Funcionário cadastrado com sucesso:', data)
        
        // Enviar webhook para funcionário cadastrado
        if (data && data.length > 0) {
          await enviarWebhookFuncionarioCadastrado(data[0])
        }
        
        setShowSuccess(true)
        setSenhaGerada(senha)
        setFormData({
          nomeCompleto: '',
          cpf: '',
          whatsapp: '',
          cargo: '',
          tipo: 'comum',
          email: ''
        })
        
        // Recarregar lista de funcionários
        await fetchFuncionarios()
      }
    } catch (error) {
      console.error('Erro geral ao cadastrar funcionário:', error)
      setErroSupabase(`Erro de conexão: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSenha = async (funcionario) => {
    try {
      const novaSenha = Math.random().toString(36).slice(-8)
      
      const { error } = await supabase
        .from('funcionarios')
        .update({ senha: novaSenha })
        .eq('id', funcionario.id)

      if (error) {
        console.error('Erro ao resetar senha:', error)
        setErroSupabase('Erro ao resetar senha')
      } else {
        setSenhaResetada(novaSenha)
        setEmailResetado(funcionario.email)
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      setErroSupabase('Erro de conexão')
    }
  }

  const handleDeleteFuncionario = async (funcionario) => {
    if (!confirm(`Tem certeza que deseja excluir ${funcionario.nome}?`)) return

    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', funcionario.id)

      if (error) {
        console.error('Erro ao excluir funcionário:', error)
        setErroSupabase('Erro ao excluir funcionário')
      } else {
        await fetchFuncionarios()
      }
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error)
      setErroSupabase('Erro de conexão')
    }
  }

  // Filtrar funcionários por busca
  const funcionariosFiltrados = funcionariosExistentes.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    funcionario.cpf.includes(busca) ||
    funcionario.email.toLowerCase().includes(busca.toLowerCase())
  )

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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cadastro de Funcionários</h1>
                <p className="text-sm text-muted-foreground">Gerencie os funcionários do sistema</p>
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
                <User className="h-5 w-5 text-blue-500" />
                <span>Novo Funcionário</span>
              </CardTitle>
              <CardDescription>
                Cadastre um novo funcionário no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome completo */}
                <div>
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                    placeholder="Digite o nome completo"
                    className={errors.nomeCompleto ? 'border-red-500' : ''}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-sm text-red-500 mt-1">{errors.nomeCompleto}</p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength="14"
                    className={errors.cpf ? 'border-red-500' : ''}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>
                  )}
                </div>

                {/* E-mail */}
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="funcionario@empresa.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Cargo */}
                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleInputChange('cargo', e.target.value)}
                    placeholder="Ex: Desenvolvedor, Designer, Analista"
                    className={errors.cargo ? 'border-red-500' : ''}
                  />
                  {errors.cargo && (
                    <p className="text-sm text-red-500 mt-1">{errors.cargo}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="(11) 99999-9999"
                    maxLength="15"
                    className={errors.whatsapp ? 'border-red-500' : ''}
                  />
                  {errors.whatsapp && (
                    <p className="text-sm text-red-500 mt-1">{errors.whatsapp}</p>
                  )}
                </div>

                {/* Botão de cadastro */}
                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={isLoading}
                  style={{ backgroundColor: empresaConfig.corBotoes }}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Cadastrar Funcionário
                    </>
                  )}
                </Button>

                {/* Alertas */}
                {erroSupabase && (
                  <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {erroSupabase}
                    </AlertDescription>
                  </Alert>
                )}

                {showSuccess && senhaGerada && (
                  <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      Funcionário cadastrado com sucesso! Senha gerada: <strong>{senhaGerada}</strong>
                    </AlertDescription>
                  </Alert>
                )}

                {showLimitAlert && (
                  <Alert className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                      Limite de funcionários atingido. Entre em contato com o suporte para aumentar o limite.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Lista de funcionários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <span>Funcionários Cadastrados</span>
                <Badge variant="secondary">{funcionariosExistentes.length}/{empresaConfig.limiteFuncionarios}</Badge>
              </CardTitle>
              <CardDescription>
                Gerencie os funcionários existentes
              </CardDescription>
              
              {/* Busca */}
              <div className="mt-4">
                <Input
                  placeholder="Buscar por nome, CPF ou e-mail..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Carregando funcionários...</p>
                </div>
              ) : funcionariosFiltrados.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {funcionariosFiltrados.map((funcionario) => (
                    <div key={funcionario.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{funcionario.nome}</p>
                            <p className="text-xs text-muted-foreground">{funcionario.cargo}</p>
                            <p className="text-xs text-muted-foreground">{funcionario.cpf}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetSenha(funcionario)}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFuncionario(funcionario)}
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
                  <p>Nenhum funcionário cadastrado</p>
                  <p className="text-sm">Cadastre o primeiro funcionário usando o formulário ao lado</p>
                </div>
              )}

              {/* Alerta de senha resetada */}
              {senhaResetada && emailResetado && (
                <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Senha resetada para {emailResetado}: <strong>{senhaResetada}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminCadastroFuncionarios

