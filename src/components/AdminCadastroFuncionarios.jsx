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
    nome: 'Minha Empresa Personalizada',
    corBotoes: '#ff6b35',
    limiteFuncionarios: 50 // Limite configurado pelo Criador
  })

  // Lista de funcionários existentes (simulado)
  const [funcionariosExistentes, setFuncionariosExistentes] = useState([])

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
    // Carregar configurações do localStorage
    const configSalva = localStorage.getItem('empresaConfig')
    if (configSalva) {
      setEmpresaConfig(prev => ({ ...prev, ...JSON.parse(configSalva) }))
    }

    // Buscar funcionários do Baserow
    fetchFuncionarios()
  }, [])

  // Buscar funcionários do Baserow
  const fetchFuncionarios = async () => {
    try {
      const res = await fetch(BASEROW_URL, {
        headers: { Authorization: `Token ${BASEROW_TOKEN}` }
      })
      const data = await res.json()
      setFuncionariosExistentes(data.results || [])
    } catch (err) {
      setErroSupabase('Erro ao buscar funcionários do banco.')
    }
  }

  // Máscara para WhatsApp
  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  // Função para formatar CPF
  function formatCPF(value) {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d+)/, '$1.$2');
    if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
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
      formattedValue = formatCPF(value)
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
    const senha = gerarSenha()
    setSenhaGerada(senha)
    const payload = {
      nome: formData.nomeCompleto,
      email: formData.email,
      senha: senha,
      cpf: formData.cpf.replace(/\D/g, ''),
      whatsapp: formData.whatsapp,
      cargo: formData.cargo
    }
    try {
      let insertResult;
      if (formData.tipo === 'admin') {
        insertResult = await supabase.from('usuarios').insert([{ ...payload, tipo: 'admin' }]);
      } else {
        insertResult = await supabase.from('funcionarios').insert([payload]);
      }
      const { data, error } = insertResult;
      console.log('Supabase insert:', insertResult);
      if (!error) {
        setFormData({ nomeCompleto: '', cpf: '', whatsapp: '', cargo: '', tipo: 'comum', email: '' });
        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setErroSupabase('Erro ao cadastrar usuário: ' + (error.message || ''));
        setIsLoading(false);
      }
    } catch (err) {
      setErroSupabase('Erro de conexão com o Supabase.');
      setIsLoading(false);
    }
  }

  // Função para resetar senha
  const handleResetSenha = async (funcionario) => {
    setErroSupabase('')
    setSenhaResetada('')
    setEmailResetado('')
    const novaSenha = gerarSenha()
    try {
      const res = await fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_FUNCIONARIOS}/${funcionario.id}/?user_field_names=true`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senha: novaSenha })
      })
      if (!res.ok) {
        setErroSupabase('Erro ao resetar senha.')
        return
      }
      setSenhaResetada(novaSenha)
      setEmailResetado(funcionario.email)
      fetchFuncionarios()
    } catch (err) {
      setErroSupabase('Erro de conexão com o Baserow.')
    }
  }

  // Função para apagar funcionário
  const handleDeleteFuncionario = async (funcionario) => {
    try {
      const res = await fetch(`https://api.baserow.io/api/database/rows/table/${TABLE_FUNCIONARIOS}/${funcionario.id}/?user_field_names=true`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${BASEROW_TOKEN}` }
      })
      if (!res.ok) {
        setErroSupabase('Erro ao apagar funcionário.')
        return
      }
      fetchFuncionarios()
    } catch (err) {
      setErroSupabase('Erro de conexão com o Baserow.')
    }
  }

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

      <div className="w-full flex flex-col items-center">
        <div className="max-w-5xl w-full">
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
                    maxLength={14}
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

                {/* Tipo de Cadastro */}
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Cadastro *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comum">Comum</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
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
            <div className="w-full mt-8">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Funcionários Cadastrados</span>
                  </CardTitle>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Buscar funcionário..."
                      value={busca}
                      onChange={e => setBusca(e.target.value)}
                      className="rounded-lg px-3 py-1 bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm"
                      style={{ minWidth: 200 }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full">
                    <table className="w-full text-sm text-left text-gray-200">
                      <thead className="bg-zinc-800">
                        <tr>
                          <th className="px-4 py-2">Nome</th>
                          <th className="px-4 py-2">CPF</th>
                          <th className="px-4 py-2">WhatsApp</th>
                          <th className="px-4 py-2">Cargo</th>
                          <th className="px-4 py-2">Tipo</th>
                          <th className="px-4 py-2 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {funcionariosExistentes.filter(f => {
                          const termo = busca.toLowerCase()
                          return (
                            f.nome?.toLowerCase().includes(termo) ||
                            f.cpf?.toLowerCase().includes(termo) ||
                            f.whatsapp?.toLowerCase().includes(termo) ||
                            f.cargo?.toLowerCase().includes(termo) ||
                            f.tipo?.toLowerCase().includes(termo) ||
                            f.email?.toLowerCase().includes(termo)
                          )
                        }).map((f, idx) => (
                          <tr key={f.cpf + idx} className="border-b border-zinc-700">
                            <td className="px-4 py-2">{f.nome || f.nomeCompleto}</td>
                            <td className="px-4 py-2">{f.cpf}</td>
                            <td className="px-4 py-2">{f.whatsapp || '-'}</td>
                            <td className="px-4 py-2">{f.cargo || '-'}</td>
                            <td className="px-4 py-2">{f.tipo || 'comum'}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                className="text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded transition"
                                title="Apagar funcionário"
                                onClick={() => handleDeleteFuncionario(f)}
                              >
                                Apagar
                              </button>
                              <button
                                type="button"
                                className="text-yellow-400 hover:text-yellow-600 font-bold px-2 py-1 rounded transition ml-2"
                                title="Resetar senha"
                                onClick={() => handleResetSenha(f)}
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
            </div>
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

