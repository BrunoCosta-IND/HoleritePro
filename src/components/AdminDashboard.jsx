import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/utils'
import { 
  Building2, 
  Users, 
  FileText, 
  Upload, 
  UserPlus, 
  BarChart3,
  Sun,
  Moon,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Crown,
  LogOut,
  User,
  Settings,
  Shield
} from 'lucide-react'

const AdminDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  
  // Estados para dados reais
  const [empresaConfig, setEmpresaConfig] = useState({
    nome: 'Sistema de Gestão de Holerites',
    logo: null
  })

  const [funcionalidadesPRO, setFuncionalidadesPRO] = useState({
    webhookWhatsApp: false,
    relatorioAssinaturas: false
  })

  const [dashboardData, setDashboardData] = useState({
    totalFuncionarios: 0,
    holeritesEnviados: 0,
    holeritesAssinados: 0,
    ultimoUpload: 'N/A',
    ultimosUploads: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDadosReais()
  }, [])

  const carregarDadosReais = async () => {
    try {
      setLoading(true)

      // Configuração padrão da empresa
      setEmpresaConfig({
        nome: 'Sistema de Gestão de Holerites',
        logo: null
      })

      // 2. Carregar funcionalidades PRO
      const { data: funcData, error: funcError } = await supabase
        .from('funcionalidades_pro')
        .select('*')
        .single()

      if (funcData && !funcError) {
        setFuncionalidadesPRO({
          webhookWhatsApp: funcData.webhook_whatsapp || false,
          relatorioAssinaturas: funcData.relatorio_assinaturas || false
        })
      }

      // 3. Contar funcionários
      const { count: totalFuncionarios, error: funcCountError } = await supabase
        .from('funcionarios')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)

      // 4. Contar holerites enviados no mês atual
      const mesAtual = new Date().getMonth() + 1
      const anoAtual = new Date().getFullYear()
      
      const { count: holeritesEnviados, error: holeritesError } = await supabase
        .from('holerite')
        .select('*', { count: 'exact', head: true })
        .eq('mes', mesAtual)
        .eq('ano', anoAtual)

      // 5. Contar holerites assinados
      const { count: holeritesAssinados, error: assinadosError } = await supabase
        .from('holerite')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'assinado')

      // 6. Buscar último upload
      const { data: ultimosUploads, error: uploadsError } = await supabase
        .from('uploads_historico')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

      setDashboardData({
        totalFuncionarios: totalFuncionarios || 0,
        holeritesEnviados: holeritesEnviados || 0,
        holeritesAssinados: holeritesAssinados || 0,
        ultimoUpload: ultimosUploads && ultimosUploads.length > 0 
          ? formatarData(ultimosUploads[0].created_at) 
          : 'N/A',
        ultimosUploads: processarUploadsRecentes(ultimosUploads || [])
      })

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const processarUploadsRecentes = (uploads) => {
    return uploads.map(upload => ({
      nome: upload.nome_arquivo || 'Arquivo',
      data: formatarData(upload.created_at),
      status: `${upload.holerites_processados || 0}/${upload.total_arquivos || 0}`
    }))
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMonthName = (mes) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return meses[mes - 1] || 'Desconhecido'
  }

  const handleNavigation = (route) => {
    console.log('🎯 Navegando para:', route)
    navigate(route)
  }

  // Debug: verificar se o componente está renderizando
  console.log('🔍 AdminDashboard renderizando - Cards visíveis:', {
    empresaConfig,
    funcionalidadesPRO,
    dashboardData
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{empresaConfig.nome}</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestão de Holerites</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/configuracoes')}
                title="Configurações"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {/* Botão de sair */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/')}
                title="Sair"
                className="ml-2"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-8">
        {/* Cards informativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de funcionários */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários Cadastrados</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalFuncionarios}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Funcionários ativos
              </p>
            </CardContent>
          </Card>

          {/* Holerites enviados */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holerites Enviados no Mês</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.holeritesEnviados}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Último upload: {dashboardData.ultimoUpload}
              </p>
            </CardContent>
          </Card>

          {/* Holerites assinados - Condicional baseado nas funcionalidades PRO */}
          {funcionalidadesPRO.relatorioAssinaturas ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Holerites Assinados</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.holeritesAssinados}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  De {dashboardData.holeritesEnviados} enviados
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Relatórios PRO</CardTitle>
                <Crown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Função disponível apenas na versão PRO. Entre em contato com o suporte para desbloquear este recurso.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status geral */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativo</div>
              <p className="text-xs text-muted-foreground mt-1">
                Última sincronização: hoje
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Adicionar funcionário */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" 
                onClick={() => handleNavigation('/admin/funcionarios/cadastrar')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Adicionar Funcionário</CardTitle>
                  <CardDescription>
                    Cadastrar novo funcionário no sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <p className="text-sm text-muted-foreground flex-grow">
                Cadastre funcionários com CPF, nome, cargo e WhatsApp para recebimento de holerites.
              </p>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                style={{ borderColor: empresaConfig.corBotoes, color: empresaConfig.corBotoes }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Funcionário
              </Button>
            </CardContent>
          </Card>

          {/* Cadastrar Administrador */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" 
                onClick={() => handleNavigation('/admin/admins/cadastrar')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Cadastrar Administrador</CardTitle>
                  <CardDescription>
                    Criar nova conta de administrador
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <p className="text-sm text-muted-foreground flex-grow">
                Crie contas de administrador com acesso completo ao sistema de gestão.
              </p>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                style={{ borderColor: empresaConfig.corBotoes, color: empresaConfig.corBotoes }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Criar Admin
              </Button>
            </CardContent>
          </Card>

          {/* Upload de holerites */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleNavigation('/admin/holerites/upload')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Upload de Holerites</CardTitle>
                  <CardDescription>
                    Enviar holerites em lote
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <p className="text-sm text-muted-foreground flex-grow">
                Faça upload de múltiplos arquivos PDF. O sistema identifica automaticamente cada funcionário.
              </p>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                style={{ borderColor: empresaConfig.corBotoes, color: empresaConfig.corBotoes }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Enviar Holerites
              </Button>
            </CardContent>
          </Card>

          {/* Gerar relatórios - Condicional */}
          {funcionalidadesPRO.relatorioAssinaturas ? (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Gerar Relatórios</CardTitle>
                    <CardDescription>
                      Relatórios de assinaturas
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-sm text-muted-foreground flex-grow">
                  Visualize quais funcionários assinaram os holerites e gere relatórios detalhados.
                </p>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  style={{ borderColor: empresaConfig.corBotoes, color: empresaConfig.corBotoes }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Relatórios
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300">Relatórios PRO</CardTitle>
                    <CardDescription className="text-yellow-600 dark:text-yellow-400">
                      Recurso não disponível
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <Alert className="bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700 flex-grow">
                  <Crown className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    Este recurso está disponível apenas na versão PRO. Entre em contato com o suporte para desbloquear.
                  </AlertDescription>
                </Alert>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  disabled
                  style={{ borderColor: empresaConfig.corBotoes, color: empresaConfig.corBotoes, opacity: 0.5 }}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Versão PRO
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Últimos uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Últimos Uploads</span>
            </CardTitle>
            <CardDescription>
              Histórico dos 3 últimos envios de holerites
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.ultimosUploads.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.ultimosUploads.map((upload, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{upload.nome}</p>
                        <p className="text-xs text-muted-foreground">Enviado em {upload.data}</p>
                      </div>
                    </div>
                    <Badge variant={upload.status.includes('0/') ? 'secondary' : 'default'}>
                      {upload.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum upload realizado ainda</p>
                <p className="text-sm">Faça o primeiro upload de holerites para ver o histórico aqui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminDashboard

