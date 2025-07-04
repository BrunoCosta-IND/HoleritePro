import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  LogOut,
  Sun,
  Moon,
  Calendar,
  Building2
} from 'lucide-react'
import { supabase } from '@/lib/utils'

const FuncionarioDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const [funcionario, setFuncionario] = useState(null)
  const [holerites, setHolerites] = useState([])

  useEffect(() => {
    // Verificar se o funcionário está logado
    const usuarioLogado = localStorage.getItem('usuarioLogado')
    if (!usuarioLogado) {
      navigate('/funcionario-login')
      return
    }
    const dadosUsuario = JSON.parse(usuarioLogado)
    if (dadosUsuario.tipo !== 'funcionario') {
      navigate('/')
      return
    }
    setFuncionario(dadosUsuario)

    // Buscar holerites do Supabase para o CPF do funcionário
    const fetchHolerites = async () => {
      const { data, error } = await supabase
        .from('holerite')
        .select('*')
        .eq('cpf', dadosUsuario.cpf)
        .order('ano', { ascending: false })
        .order('mes', { ascending: false })
      console.log('CPF logado:', dadosUsuario.cpf)
      console.log('Holerites retornados:', data)
      if (!error && data) {
        setHolerites(data)
      } else {
        setHolerites([])
      }
    }
    fetchHolerites()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('funcionarioLogado')
    navigate('/funcionario-login')
  }

  const handleVisualizarHolerite = (holerite) => {
    if (holerite.status === 'pendente') {
      // Redirecionar para tela de assinatura
      navigate(`/funcionario/holerite/${holerite.id}`)
    } else {
      // Visualizar PDF
      window.open(holerite.file_url, '_blank')
    }
  }

  const handleDownloadHolerite = (holerite) => {
    if (holerite.status === 'assinado') {
      // Download do PDF
      window.open(holerite.file_url, '_blank')
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'pendente') {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Assinado
        </Badge>
      )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!funcionario) {
    return <div>Carregando...</div>
  }

  const holeritePendente = holerites.find(h => h.status === 'pendente')
  const holeritesAssinados = holerites.filter(h => h.status === 'assinado')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e título */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Portal do Funcionário
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bem-vindo, {funcionario.nome}
                </p>
              </div>
            </div>

            {/* Ações do header */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Alerta para holerite pendente */}
          {holeritePendente && (
            <Alert className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <div className="flex items-center justify-between">
                  <span>
                    Você tem um novo holerite de <strong>{holeritePendente.mes}/{holeritePendente.ano}</strong> aguardando sua assinatura.
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleVisualizarHolerite(holeritePendente)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white ml-4"
                  >
                    Visualizar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Holerites</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{holerites.length}</div>
                <p className="text-xs text-muted-foreground">
                  Documentos disponíveis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {holerites.filter(h => h.status === 'pendente').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Aguardando assinatura
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assinados</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {holeritesAssinados.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Documentos confirmados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de holerites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Meus Holerites</span>
              </CardTitle>
              <CardDescription>
                Visualize e gerencie seus holerites mensais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holerites.map((holerite) => (
                  <div
                    key={holerite.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Holerite {holerite.mes}/{holerite.ano}
                          </h3>
                          {getStatusBadge(holerite.status)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Enviado em {formatDate(holerite.dataEnvio)}</span>
                          </div>
                          
                          {holerite.dataAssinatura && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Assinado em {formatDate(holerite.dataAssinatura)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVisualizarHolerite(holerite)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>
                          {holerite.status === 'pendente' ? 'Assinar' : 'Visualizar'}
                        </span>
                      </Button>
                      
                      {holerite.status === 'assinado' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadHolerite(holerite)}
                          className="flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informações do funcionário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Meus Dados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nome Completo
                  </label>
                  <p className="text-gray-900 dark:text-white">{funcionario.nome}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    CPF
                  </label>
                  <p className="text-gray-900 dark:text-white">{funcionario.cpf}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default FuncionarioDashboard

