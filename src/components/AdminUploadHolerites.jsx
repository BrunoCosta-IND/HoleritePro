import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Sun,
  Moon,
  MessageSquare,
  Crown,
  Trash2,
  Send,
  RefreshCw
} from 'lucide-react'
import { supabase, formatFileSize, generateUniqueFileName } from '@/lib/utils'

const AdminUploadHolerites = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // Configurações da empresa
  const [empresaConfig, setEmpresaConfig] = useState({
    nome: 'Sistema de Gestão de Holerites',
    corBotoes: '#ff6b35'
  })

  // Funcionalidades PRO
  const [funcionalidadesPRO, setFuncionalidadesPRO] = useState({
    webhookWhatsApp: false,
    relatorioAssinaturas: false
  })

  // Estados do upload
  const [arquivos, setArquivos] = useState([])
  const [webhookUrl, setWebhookUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')
  const [mes, setMes] = useState('')
  const [ano, setAno] = useState('')
  const [uploadAttempts, setUploadAttempts] = useState(0)

  // Lista de funcionários (carregada do Supabase)
  const [funcionarios, setFuncionarios] = useState([])
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false)
  const [erroFuncionarios, setErroFuncionarios] = useState('')

  const [webhookN8n, setWebhookN8n] = useState("")
  const [pdfN8n, setPdfN8n] = useState(null)
  const [n8nUploads, setN8nUploads] = useState([])

  // Adicionar estados para feedback geral
  const [uploadFeedback, setUploadFeedback] = useState(null)

  useEffect(() => {
    carregarConfiguracoes()
    fetchFuncionarios()
  }, [])

  // Carregar configurações da empresa
  const carregarConfiguracoes = async () => {
    try {
      const { data: configData, error: configError } = await supabase
        .from('empresa_config')
        .select('*')
        .single()

      if (configData && !configError) {
        setEmpresaConfig({
          nome: configData.nome || 'Sistema de Gestão de Holerites',
          corBotoes: configData.cor_botoes || '#ff6b35'
        })
      }

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
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  // Buscar funcionários do Supabase
  const fetchFuncionarios = async () => {
    setLoadingFuncionarios(true)
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('ativo', true)
        .order('nome')

      if (!error && data) {
        setFuncionarios(data)
        setErroFuncionarios('')
        console.log('Total de funcionários carregados do Supabase:', data.length)
      } else {
        setFuncionarios([])
        setErroFuncionarios('Erro ao buscar funcionários: ' + (error?.message || error))
        console.log('Erro ao buscar funcionários:', error)
      }
    } catch (err) {
      setFuncionarios([])
      setErroFuncionarios('Erro ao buscar funcionários: ' + err.message)
      console.log('Erro ao buscar funcionários:', err)
    } finally {
      setLoadingFuncionarios(false)
    }
  }

  // Função para normalizar nomes (remover acentos e caracteres especiais)
  const normalizarNome = (nome) => {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Função para identificar funcionário pelo nome do arquivo
  const identificarFuncionario = (nomeArquivo) => {
    const nomeLimpo = normalizarNome(nomeArquivo)
    
    return funcionarios.find(funcionario => {
      const nomeFuncionario = normalizarNome(funcionario.nome)
      return nomeLimpo.includes(nomeFuncionario) || nomeFuncionario.includes(nomeLimpo)
    })
  }

  // Função para extrair mês e ano do nome do arquivo
  const extrairMesAno = (nomeArquivo) => {
    const meses = [
      'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ]
    
    const nomeLower = nomeArquivo.toLowerCase()
    
    // Procurar por mês no nome
    for (let i = 0; i < meses.length; i++) {
      if (nomeLower.includes(meses[i])) {
        const mes = i + 1
        
        // Procurar por ano (4 dígitos)
        const anoMatch = nomeArquivo.match(/\b(20\d{2})\b/)
        const ano = anoMatch ? parseInt(anoMatch[1]) : new Date().getFullYear()
        
        return { mes, ano }
      }
    }
    
    // Se não encontrar, usar data atual
    const hoje = new Date()
    return { mes: hoje.getMonth() + 1, ano: hoje.getFullYear() }
  }

  // Função para extrair CPF do nome do arquivo
  function extractCPF(filename) {
    console.log('Extraindo CPF do arquivo:', filename)
    
    // Tentar diferentes padrões de CPF
    const patterns = [
      /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/,  // 123.456.789-01
      /\b(\d{11})\b/,                          // 12345678901
      /\b(\d{3}\d{3}\d{3}\d{2})\b/            // 12345678901 (sem pontos)
    ]
    
    for (const pattern of patterns) {
      const match = filename.match(pattern)
      if (match) {
        const cpf = match[1].replace(/\D/g, '')
        console.log('CPF encontrado:', cpf)
        return cpf
      }
    }
    
    console.log('CPF não encontrado no arquivo:', filename)
    return null
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    
    const novosArquivos = files.map(file => {
      const id = Math.random().toString(36).substr(2, 9)
      const funcionario = identificarFuncionario(file.name)
      const { mes, ano } = extrairMesAno(file.name)
      const cpf = extractCPF(file.name) || (funcionario ? funcionario.cpf : null)
      
      return {
        id,
        file,
        nome: file.name,
        tamanho: file.size,
        funcionario: funcionario || null,
        cpf: cpf,
        mes: mes,
        ano: ano,
        status: 'pendente',
        erro: null
      }
    })
    
    setArquivos(prev => [...prev, ...novosArquivos])
  }

  const removeArquivo = (id) => {
    setArquivos(prev => prev.filter(arquivo => arquivo.id !== id))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (arquivos.length === 0) {
      setError('Selecione pelo menos um arquivo para upload')
      return
    }

    // Prevenir múltiplos cliques
    if (isUploading) {
      return
    }

    // Proteção adicional contra múltiplos cliques
    setUploadAttempts(prev => prev + 1)
    if (uploadAttempts > 0) {
      return
    }

    setIsUploading(true)
    setError('')
    setUploadProgress({})

    const atualizaStatus = (id, status, erro = '') => {
      setArquivos(prev => prev.map(arquivo => 
        arquivo.id === id ? { ...arquivo, status, erro } : arquivo
      ))
      setUploadProgress(prev => ({ ...prev, [id]: status }))
    }

    try {
      for (const arquivo of arquivos) {
        atualizaStatus(arquivo.id, 'enviando')

        try {
          // Gerar nome único para o arquivo
          const nomeUnico = generateUniqueFileName(
            arquivo.nome, 
            arquivo.cpf || 'sem_cpf', 
            arquivo.mes, 
            arquivo.ano
          )

          // Upload para o Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('holerites')
            .upload(nomeUnico, arquivo.file)

          if (uploadError) {
            throw new Error(uploadError.message)
          }

          // Obter URL pública do arquivo
          const { data: urlData } = supabase.storage
            .from('holerites')
            .getPublicUrl(nomeUnico)

          // Verificar se os dados estão corretos
          if (!arquivo.cpf || !arquivo.mes || !arquivo.ano) {
            throw new Error('Dados inválidos para inserção no banco')
          }

          // Inserir registro no banco de dados
          const { data: insertData, error: dbError } = await supabase
            .from('holerite')
            .insert([{
              cpf: arquivo.cpf,
              mes: arquivo.mes,
              ano: arquivo.ano,
              file_url: urlData.publicUrl,
              file_name: arquivo.nome,
              file_size: arquivo.tamanho,
              status: 'pendente'
            }])
            .select()

          if (dbError) {
            throw new Error(dbError.message)
          }
          
          // Enviar aviso de holerite pronto
          await enviarAvisoHoleritePronto(arquivo)
          
          // Enviar notificação push
          await enviarNotificacaoPush(arquivo)
          
          atualizaStatus(arquivo.id, 'sucesso')
        } catch (error) {
          atualizaStatus(arquivo.id, 'erro', error.message)
        }
      }

      setShowSuccess(true)
      setArquivos([])
      
      // Limpar após 5 segundos
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)

    } catch (error) {
      setError('Erro geral no upload: ' + error.message)
    } finally {
      setIsUploading(false)
      setUploadAttempts(0)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'sucesso': return 'text-green-500'
      case 'erro': return 'text-red-500'
      case 'enviando': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'sucesso': return 'Enviado com sucesso'
      case 'erro': return 'Erro no envio'
      case 'enviando': return 'Enviando...'
      default: return 'Pendente'
    }
  }

  // Função para enviar aviso de holerite pronto
  const enviarAvisoHoleritePronto = async (arquivo) => {
    try {
      // Buscar dados do funcionário
      const { data: funcionario, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('cpf', arquivo.cpf)
        .single()

      if (funcError || !funcionario) {
        throw new Error('Funcionário não encontrado')
      }

      // Verificar configurações do webhook
      const { data: webhookConfig, error: webhookError } = await supabase
        .from('webhook_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (webhookError) {
        return
      }

      if (!webhookConfig || webhookConfig.length === 0) {
        return
      }

      const config = webhookConfig[0]
      
      // Verificar se webhook está ativo e se evento de holerite enviado está habilitado
      if (!config.ativo || !config.holerite_enviado) {
        return
      }

      if (!config.n8n_url) {
        return
      }
      
      const payload = {
        evento: 'holerite_pronto',
        timestamp: new Date().toISOString(),
        aviso: {
          cpf: arquivo.cpf,
          nome: funcionario.nome,
          telefone: funcionario.whatsapp,
          email: funcionario.email,
          cargo: funcionario.cargo,
          mes: arquivo.mes,
          ano: arquivo.ano,
          mensagem: `Seu holerite de ${arquivo.mes}/${arquivo.ano} está pronto para visualização.`
        },
        sistema: 'gestao-holerites'
      }

      // Tentativa 1: Requisição direta
      try {
        const response = await fetch(config.n8n_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          await atualizarStatusHolerite(arquivo.cpf, arquivo.mes, arquivo.ano)
          return
        }
      } catch (error) {
        // Erro CORS, tentar proxy
      }

      // Tentativa 2: Proxy CORS
      try {
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${config.n8n_url}`
        
        const proxyResponse = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:5173'
          },
          body: JSON.stringify(payload)
        })

        if (proxyResponse.ok) {
          await atualizarStatusHolerite(arquivo.cpf, arquivo.mes, arquivo.ano)
          return
        }
      } catch (proxyError) {
        // Erro no proxy
      }
      
      // Mesmo com falha no webhook, atualizar status
      await atualizarStatusHolerite(arquivo.cpf, arquivo.mes, arquivo.ano)
    } catch (error) {
      console.error('❌ Erro ao enviar aviso de holerite pronto:', error)
      console.error('📋 Stack trace:', error.stack)
    }
  }

  // Função para enviar notificação push
  const enviarNotificacaoPush = async (arquivo) => {
    try {
      // Buscar dados do funcionário
      const { data: funcionario, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('cpf', arquivo.cpf)
        .single()

      if (funcError || !funcionario) {
        return
      }

      // Buscar subscription do funcionário
      const { data: subscription, error: subError } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', funcionario.id)
        .single()

      if (subError || !subscription) {
        return
      }

      // Verificar se é iOS
      const isIOS = subscription.platform === 'ios'
      
      if (isIOS) {
        // Para iOS, salvar notificação pendente para ser mostrada quando o app abrir
        await savePendingNotification(funcionario.id, payload)
        return
      }

      // Preparar payload da notificação
      const payload = {
        title: 'Novo Holerite Disponível! 📄',
        body: `Olá ${funcionario.nome}! Seu holerite de ${arquivo.mes}/${arquivo.ano} está pronto para visualização.`,
        icon: '/logo.png',
        badge: '/logo.png',
        data: {
          url: '/funcionario-dashboard',
          cpf: arquivo.cpf,
          mes: arquivo.mes,
          ano: arquivo.ano
        },
        actions: [
          {
            action: 'view',
            title: 'Ver Holerite',
            icon: '/logo.png'
          },
          {
            action: 'dismiss',
            title: 'Fechar',
            icon: '/logo.png'
          }
        ]
      }

      // Enviar notificação push via Supabase Edge Functions
      const { error: pushError } = await supabase.functions.invoke('send-push-notification', {
        body: {
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          payload: payload
        }
      })

      if (pushError) {
        console.error('Erro ao enviar notificação push:', pushError)
      }

    } catch (error) {
      console.error('Erro ao enviar notificação push:', error)
    }
  }

  // Função para salvar notificação pendente (iOS)
  const savePendingNotification = async (userId, payload) => {
    try {
      const notificationData = {
        user_id: userId,
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sent: false,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('pending_notifications')
        .insert(notificationData)

      if (error) {
        console.error('Erro ao salvar notificação pendente:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar notificação pendente:', error)
    }
  }

  // Função auxiliar para atualizar status
  const atualizarStatusHolerite = async (cpf, mes, ano) => {
    try {
      const { error: updateError } = await supabase
        .from('holerite')
        .update({ status: 'disponivel' })
        .eq('cpf', cpf)
        .eq('mes', mes)
        .eq('ano', ano)

      if (updateError) {
        console.error('Erro ao atualizar status do holerite:', updateError)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  // Buscar holerites existentes
  useEffect(() => {
    const fetchHolerites = async () => {
      try {
        const { data, error } = await supabase
          .from('holerite')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Erro ao buscar holerites:', error)
        }
      } catch (error) {
        console.error('Erro ao buscar holerites:', error)
      }
    }

    fetchHolerites()
  }, [])

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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Upload de Holerites</h1>
                <p className="text-sm text-muted-foreground">Envie holerites para os funcionários</p>
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
          {/* Área de upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-green-500" />
                <span>Selecionar Arquivos</span>
              </CardTitle>
              <CardDescription>
                Selecione os arquivos PDF dos holerites para upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Área de drop */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const files = Array.from(e.dataTransfer.files)
                  const novosArquivos = files.map(file => {
                    const id = Math.random().toString(36).substr(2, 9)
                    const funcionario = identificarFuncionario(file.name)
                    const { mes, ano } = extrairMesAno(file.name)
                    const cpf = extractCPF(file.name) || (funcionario ? funcionario.cpf : null)
                    
                    return {
                      id,
                      file,
                      nome: file.name,
                      tamanho: file.size,
                      funcionario: funcionario || null,
                      cpf: cpf,
                      mes: mes,
                      ano: ano,
                      status: 'pendente',
                      erro: null
                    }
                  })
                  setArquivos(prev => [...prev, ...novosArquivos])
                }}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Arraste arquivos aqui ou clique para selecionar</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Suporta arquivos PDF. O sistema identificará automaticamente o funcionário.
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivos
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Lista de arquivos selecionados */}
              {arquivos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Arquivos Selecionados ({arquivos.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {arquivos.map((arquivo) => (
                      <div key={arquivo.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{arquivo.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(arquivo.tamanho)} • {arquivo.mes}/{arquivo.ano}
                            </p>
                            {arquivo.funcionario && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                ✓ {arquivo.funcionario.nome}
                              </p>
                            )}
                            {arquivo.erro && (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                ✗ {arquivo.erro}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={arquivo.status === 'sucesso' ? 'default' : 'secondary'}
                            className={getStatusColor(arquivo.status)}
                          >
                            {getStatusText(arquivo.status)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArquivo(arquivo.id)}
                            disabled={isUploading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de upload */}
              {arquivos.length > 0 && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-6"
                  style={{ backgroundColor: empresaConfig.corBotoes }}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Holerites ({arquivos.length})
                    </>
                  )}
                </Button>
              )}

              {/* Alertas */}
              {error && (
                <Alert className="mt-4 border-red-500 bg-red-50 dark:bg-red-950/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {showSuccess && (
                <Alert className="mt-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Holerites enviados com sucesso! Os funcionários receberão notificações.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Informações e configurações */}
          <div className="space-y-6">
            {/* Status dos funcionários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Funcionários Disponíveis</span>
                </CardTitle>
                <CardDescription>
                  Funcionários cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingFuncionarios ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Carregando funcionários...</p>
                  </div>
                ) : erroFuncionarios ? (
                  <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      {erroFuncionarios}
                    </AlertDescription>
                  </Alert>
                ) : funcionarios.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {funcionarios.map((funcionario) => (
                      <div key={funcionario.id} className="flex items-center justify-between p-2 border border-border rounded">
                        <div>
                          <p className="font-medium text-sm">{funcionario.nome}</p>
                          <p className="text-xs text-muted-foreground">{funcionario.cargo}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {funcionario.cpf}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum funcionário cadastrado</p>
                    <p className="text-sm">Cadastre funcionários primeiro</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Funcionalidades PRO */}
            {!funcionalidadesPRO.webhookWhatsApp && (
              <Card className="border-dashed border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span>Webhook WhatsApp PRO</span>
                  </CardTitle>
                  <CardDescription className="text-yellow-600 dark:text-yellow-400">
                    Recurso não disponível
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700">
                    <Crown className="h-4 w-4" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      Este recurso está disponível apenas na versão PRO. Entre em contato com o suporte para desbloquear.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminUploadHolerites

