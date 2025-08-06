import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/utils'
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  RefreshCw,
  PieChart,
  Activity
} from 'lucide-react'

const AdminRelatorios = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    totalHolerites: 0,
    holeritesAssinados: 0,
    holeritesPendentes: 0,
    taxaAssinatura: 0,
    holeritesPorMes: [],
    funcionariosAtivos: 0,
    funcionariosInativos: 0,
    ultimosUploads: []
  })

  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes')
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1)
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())

  useEffect(() => {
    carregarEstatisticas()
  }, [periodoSelecionado, mesSelecionado, anoSelecionado])

  const carregarEstatisticas = async () => {
    try {
      setLoading(true)
      console.log('📊 Carregando estatísticas...')

      // 1. Estatísticas gerais de funcionários
      const { count: totalFuncionarios, error: funcError } = await supabase
        .from('funcionarios')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'funcionario')

      const { count: funcionariosAtivos, error: ativosError } = await supabase
        .from('funcionarios')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'funcionario')
        .eq('ativo', true)

      const { count: funcionariosInativos, error: inativosError } = await supabase
        .from('funcionarios')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'funcionario')
        .eq('ativo', false)

      // 2. Estatísticas de holerites
      let query = supabase
        .from('holerite')
        .select('*', { count: 'exact', head: true })

      if (periodoSelecionado === 'mes') {
        query = query.eq('mes', mesSelecionado).eq('ano', anoSelecionado)
      } else if (periodoSelecionado === 'ano') {
        query = query.eq('ano', anoSelecionado)
      }

      const { count: totalHolerites, error: holeritesError } = await query

      // 3. Holerites assinados
      let queryAssinados = supabase
        .from('holerite')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'assinado')

      if (periodoSelecionado === 'mes') {
        queryAssinados = queryAssinados.eq('mes', mesSelecionado).eq('ano', anoSelecionado)
      } else if (periodoSelecionado === 'ano') {
        queryAssinados = queryAssinados.eq('ano', anoSelecionado)
      }

      const { count: holeritesAssinados, error: assinadosError } = await queryAssinados

      // 4. Holerites pendentes
      let queryPendentes = supabase
        .from('holerite')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

      if (periodoSelecionado === 'mes') {
        queryPendentes = queryPendentes.eq('mes', mesSelecionado).eq('ano', anoSelecionado)
      } else if (periodoSelecionado === 'ano') {
        queryPendentes = queryPendentes.eq('ano', anoSelecionado)
      }

      const { count: holeritesPendentes, error: pendentesError } = await queryPendentes

      // 5. Taxa de assinatura
      const taxaAssinatura = totalHolerites > 0 ? ((holeritesAssinados / totalHolerites) * 100).toFixed(1) : 0

      // 6. Holerites por mês (últimos 12 meses)
      const { data: holeritesPorMes, error: mesError } = await supabase
        .from('holerite')
        .select('mes, ano, status')
        .gte('ano', anoSelecionado - 1)

      // 7. Últimos uploads
      const { data: ultimosUploads, error: uploadsError } = await supabase
        .from('holerite')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Processar dados por mês
      const dadosPorMes = processarDadosPorMes(holeritesPorMes || [])

      setStats({
        totalFuncionarios: totalFuncionarios || 0,
        totalHolerites: totalHolerites || 0,
        holeritesAssinados: holeritesAssinados || 0,
        holeritesPendentes: holeritesPendentes || 0,
        taxaAssinatura: parseFloat(taxaAssinatura),
        holeritesPorMes: dadosPorMes,
        funcionariosAtivos: funcionariosAtivos || 0,
        funcionariosInativos: funcionariosInativos || 0,
        ultimosUploads: ultimosUploads || []
      })

      console.log('✅ Estatísticas carregadas com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const processarDadosPorMes = (dados) => {
    const meses = []
    const nomesMeses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ]

    for (let i = 0; i < 12; i++) {
      const mes = ((new Date().getMonth() - 11 + i) + 12) % 12 + 1
      const ano = new Date().getFullYear() - Math.floor((11 - i) / 12)
      
      const holeritesMes = dados.filter(h => h.mes === mes && h.ano === ano)
      const assinados = holeritesMes.filter(h => h.status === 'assinado').length
      const total = holeritesMes.length

      meses.push({
        mes: nomesMeses[mes - 1],
        total,
        assinados,
        taxa: total > 0 ? ((assinados / total) * 100).toFixed(1) : 0
      })
    }

    return meses
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'assinado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'assinado':
        return 'Assinado'
      case 'pendente':
        return 'Pendente'
      default:
        return 'Desconhecido'
    }
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
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Relatórios e Estatísticas</h1>
                <p className="text-sm text-muted-foreground">Visualize dados e métricas do sistema</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={carregarEstatisticas}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
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

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Período:</span>
            <select
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
              className="px-3 py-1 border border-border rounded-md bg-background text-foreground"
            >
              <option value="mes">Mês Atual</option>
              <option value="ano">Ano Atual</option>
              <option value="todos">Todos</option>
            </select>
          </div>

          {periodoSelecionado === 'mes' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Mês:</span>
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
                className="px-3 py-1 border border-border rounded-md bg-background text-foreground"
              >
                <option value={1}>Janeiro</option>
                <option value={2}>Fevereiro</option>
                <option value={3}>Março</option>
                <option value={4}>Abril</option>
                <option value={5}>Maio</option>
                <option value={6}>Junho</option>
                <option value={7}>Julho</option>
                <option value={8}>Agosto</option>
                <option value={9}>Setembro</option>
                <option value={10}>Outubro</option>
                <option value={11}>Novembro</option>
                <option value={12}>Dezembro</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Carregando estatísticas...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cards de estatísticas principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalFuncionarios}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.funcionariosAtivos} ativos, {stats.funcionariosInativos} inativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Holerites Enviados</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalHolerites}</div>
                  <p className="text-xs text-muted-foreground">
                    {periodoSelecionado === 'mes' ? 'Este mês' : 'Este ano'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Assinatura</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.taxaAssinatura}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.holeritesAssinados} de {stats.totalHolerites} assinados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.holeritesPendentes}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando assinatura
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de evolução mensal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span>Evolução Mensal</span>
                </CardTitle>
                <CardDescription>
                  Taxa de assinatura dos últimos 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.holeritesPorMes.map((mes, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{mes.mes}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {mes.assinados}/{mes.total}
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${mes.taxa}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{mes.taxa}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Últimos uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span>Últimos Uploads</span>
                </CardTitle>
                <CardDescription>
                  Histórico dos últimos uploads de holerites
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.ultimosUploads.length > 0 ? (
                  <div className="space-y-3">
                    {stats.ultimosUploads.map((upload, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              Holerite {upload.mes}/{upload.ano}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {upload.funcionario_nome || 'Funcionário'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(upload.status)}>
                            {getStatusText(upload.status)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatarData(upload.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum upload encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminRelatorios 