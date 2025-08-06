import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Settings,
  Webhook,
  TestTube,
  CheckCircle,
  AlertTriangle,
  Sun,
  Moon,
  Globe,
  Shield,
  Database
} from 'lucide-react'
import { supabase } from '@/lib/utils'

const AdminConfiguracoes = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const [acessoNegado, setAcessoNegado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [testando, setTestando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  // Estado para configurações do webhook
  const [configuracoes, setConfiguracoes] = useState({
    webhook: {
      n8n_url: '',
      ativo: false,
      eventos: {
        holerite_enviado: true,
        holerite_assinado: true,
        funcionario_cadastrado: false
      }
    }
  })

  useEffect(() => {
    verificarAcesso()
  }, [])

  useEffect(() => {
    if (!loading && !acessoNegado) {
      carregarConfiguracoes()
    }
  }, [loading, acessoNegado])

  const verificarAcesso = () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}')
    if (!usuario.tipo || usuario.tipo !== 'admin') {
      setAcessoNegado(true)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

      const carregarConfiguracoes = async () => {
      try {
        // Carregar configurações do webhook
        const { data: webhookData, error: webhookError } = await supabase
          .from('webhook_config')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)

        if (webhookData && webhookData.length > 0 && !webhookError) {
          const config = webhookData[0]
        
        const novasConfiguracoes = {
          webhook: {
            n8n_url: config.n8n_url || '',
            ativo: config.ativo !== null ? config.ativo : false,
            eventos: {
              holerite_enviado: config.holerite_enviado !== null ? config.holerite_enviado : true,
              holerite_assinado: config.holerite_assinado !== null ? config.holerite_assinado : true,
              funcionario_cadastrado: config.funcionario_cadastrado !== null ? config.funcionario_cadastrado : false
            }
          }
        }
        
        setConfiguracoes(novasConfiguracoes)
      } else {
        // Manter os valores padrão do estado inicial
      }
    } catch (error) {
      // Erro silencioso
    }
  }

  const handleInputChange = (secao, campo, valor) => {
    setConfiguracoes(prev => {
      const novasConfig = {
        ...prev,
        [secao]: {
          ...prev[secao],
          [campo]: valor
        }
      }
      return novasConfig
    })
  }

  const handleEventoChange = (evento, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      webhook: {
        ...prev.webhook,
        eventos: {
          ...prev.webhook.eventos,
          [evento]: valor
        }
      }
    }))
  }

  const salvarConfiguracoes = async () => {
    try {
      setSalvando(true)
      setMensagem(null)

      // Primeiro, verificar se já existe um registro
      const { data: existingData, error: selectError } = await supabase
        .from('webhook_config')
        .select('id')
        .limit(1)

      if (selectError) {
        throw new Error(`Erro ao verificar dados: ${selectError.message}`)
      }

      let result
      if (existingData && existingData.length > 0) {
        // Atualizar registro existente
        result = await supabase
          .from('webhook_config')
          .update({
            n8n_url: configuracoes.webhook.n8n_url,
            ativo: configuracoes.webhook.ativo,
            holerite_enviado: configuracoes.webhook.eventos.holerite_enviado,
            holerite_assinado: configuracoes.webhook.eventos.holerite_assinado,
            funcionario_cadastrado: configuracoes.webhook.eventos.funcionario_cadastrado
          })
          .eq('id', existingData[0].id)
          .select()
      } else {
        // Inserir novo registro
        result = await supabase
          .from('webhook_config')
          .insert({
            n8n_url: configuracoes.webhook.n8n_url,
            ativo: configuracoes.webhook.ativo,
            holerite_enviado: configuracoes.webhook.eventos.holerite_enviado,
            holerite_assinado: configuracoes.webhook.eventos.holerite_assinado,
            funcionario_cadastrado: configuracoes.webhook.eventos.funcionario_cadastrado
          })
          .select()
      }

      if (result.error) {
        throw new Error(`Erro ao salvar configurações: ${result.error.message}`)
      }

      setMensagem({
        tipo: 'sucesso',
        titulo: 'Configurações salvas!',
        descricao: 'As configurações foram salvas com sucesso.'
      })

    } catch (error) {
      setMensagem({
        tipo: 'erro',
        titulo: 'Erro ao salvar',
        descricao: error.message || 'Erro ao salvar configurações.'
      })
    } finally {
      setSalvando(false)
    }
  }

  const testarWebhook = async () => {
    if (!configuracoes.webhook.n8n_url) {
      setMensagem({
        tipo: 'erro',
        titulo: 'URL não configurada',
        descricao: 'Configure a URL do webhook antes de testar.'
      })
      return
    }

    try {
      setTestando(true)
      setMensagem(null)

      const response = await fetch(configuracoes.webhook.n8n_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evento: 'teste',
          timestamp: new Date().toISOString(),
          mensagem: 'Teste de conexão do sistema de holerites'
        })
      })

      if (response.ok) {
        setMensagem({
          tipo: 'sucesso',
          titulo: 'Webhook funcionando!',
          descricao: 'Conexão com n8n estabelecida com sucesso.'
        })
      } else {
        setMensagem({
          tipo: 'erro',
          titulo: 'Erro no webhook',
          descricao: `Erro ${response.status}: ${response.statusText}`
        })
      }
    } catch (error) {
      setMensagem({
        tipo: 'erro',
        titulo: 'Erro de conexão',
        descricao: 'Não foi possível conectar com o webhook. Verifique a URL.'
      })
    } finally {
      setTestando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (acessoNegado) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acesso Negado</CardTitle>
            <CardDescription className="text-center">
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
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
              <div>
                <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                <p className="text-sm text-muted-foreground">Gerencie as configurações do sistema</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
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
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Mensagens */}
          {mensagem && (
            <Alert className={mensagem.tipo === 'sucesso' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}>
              <div className="flex items-center space-x-2">
                {mensagem.tipo === 'sucesso' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={mensagem.tipo === 'sucesso' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                  <strong>{mensagem.titulo}</strong> - {mensagem.descricao}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Configurações do Webhook */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Webhook className="h-5 w-5 text-blue-500" />
                <CardTitle>Configurações do Webhook n8n</CardTitle>
              </div>
              <CardDescription>
                Configure a integração com n8n para automação de processos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* URL do Webhook */}
              <div className="space-y-2">
                <Label htmlFor="n8n_url">URL do Webhook n8n</Label>
                <Input
                  id="n8n_url"
                  type="url"
                  placeholder="https://seu-n8n.com/webhook/holerites"
                  value={configuracoes.webhook.n8n_url}
                  onChange={(e) => handleInputChange('webhook', 'n8n_url', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL do webhook do n8n que receberá os eventos do sistema
                </p>
              </div>

              {/* Status do Webhook */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="webhook_ativo"
                  checked={configuracoes.webhook.ativo}
                  onChange={(e) => handleInputChange('webhook', 'ativo', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="webhook_ativo">Ativar webhook</Label>
                <Badge variant={configuracoes.webhook.ativo ? "default" : "secondary"}>
                  {configuracoes.webhook.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              {/* Eventos */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Eventos que disparam o webhook:</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="holerite_enviado"
                      checked={configuracoes.webhook.eventos.holerite_enviado}
                      onChange={(e) => handleEventoChange('holerite_enviado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="holerite_enviado">Holerite enviado</Label>
                    <Badge variant="outline">Quando um holerite é enviado para o funcionário</Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="holerite_assinado"
                      checked={configuracoes.webhook.eventos.holerite_assinado}
                      onChange={(e) => handleEventoChange('holerite_assinado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="holerite_assinado">Holerite assinado</Label>
                    <Badge variant="outline">Quando um funcionário assina o holerite</Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="funcionario_cadastrado"
                      checked={configuracoes.webhook.eventos.funcionario_cadastrado}
                      onChange={(e) => handleEventoChange('funcionario_cadastrado', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="funcionario_cadastrado">Funcionário cadastrado</Label>
                    <Badge variant="outline">Quando um novo funcionário é cadastrado</Badge>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={testarWebhook}
                  disabled={testando || !configuracoes.webhook.n8n_url}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <TestTube className="h-4 w-4" />
                  <span>{testando ? 'Testando...' : 'Testar Conexão'}</span>
                </Button>

                <Button
                  onClick={salvarConfiguracoes}
                  disabled={salvando}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{salvando ? 'Salvando...' : 'Salvar Configurações'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-500" />
                <CardTitle>Informações do Sistema</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Versão do Sistema</Label>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status do Banco</Label>
                  <Badge variant="default" className="bg-green-500">Conectado</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminConfiguracoes 