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
    
    // Logs forçados para debug
    alert('Arquivos selecionados: ' + files.map(f => f.name).join(', '))
    console.log('=== DEBUG: ARQUIVOS SELECIONADOS ===')
    console.log('Arquivos selecionados:', files.map(f => f.name))
    console.log('Total de arquivos:', files.length)
    
    const novosArquivos = files.map(file => {
      const id = Math.random().toString(36).substr(2, 9)
      const funcionario = identificarFuncionario(file.name)
      const { mes, ano } = extrairMesAno(file.name)
      const cpf = extractCPF(file.name) || (funcionario ? funcionario.cpf : null)
      
      console.log('Processando arquivo:', {
        nome: file.name,
        funcionario: funcionario?.nome || 'Não encontrado',
        cpf: cpf,
        mes: mes,
        ano: ano
      })
      
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
    
    console.log('Arquivos processados:', novosArquivos.map(a => ({
      nome: a.nome,
      cpf: a.cpf,
      mes: a.mes,
      ano: a.ano
    })))
    
    setArquivos(prev => [...prev, ...novosArquivos])
  }

  const removeArquivo = (id) => {
    setArquivos(prev => prev.filter(arquivo => arquivo.id !== id))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    // Logs forçados para debug
    alert('INICIANDO UPLOAD - Arquivos: ' + arquivos.length)
    console.log('🚀 === INICIANDO UPLOAD ===')
    console.log('📁 Arquivos para upload:', arquivos.length)
    console.log('📋 Lista de arquivos:', arquivos.map(a => ({ nome: a.nome, cpf: a.cpf, mes: a.mes, ano: a.ano })))
    
    if (arquivos.length === 0) {
      console.error('❌ Nenhum arquivo selecionado')
      setError('Selecione pelo menos um arquivo para upload')
      return
    }

    // Prevenir múltiplos cliques
    if (isUploading) {
      console.warn('⚠️ Upload já em andamento, ignorando clique')
      return
    }

    // Proteção adicional contra múltiplos cliques
    setUploadAttempts(prev => prev + 1)
    if (uploadAttempts > 0) {
      console.warn('⚠️ Tentativa de upload bloqueada, já em andamento')
      return
    }

    console.log('✅ Iniciando processo de upload...')
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
      console.log('🔄 Iniciando upload de', arquivos.length, 'arquivos')
      
      for (const arquivo of arquivos) {
        console.log('📄 === PROCESSANDO ARQUIVO ===')
        console.log('📄 Nome do arquivo:', arquivo.nome)
        console.log('👤 CPF extraído:', arquivo.cpf)
        console.log('📅 Mês/Ano:', arquivo.mes + '/' + arquivo.ano)
        console.log('👨‍💼 Funcionário:', arquivo.funcionario?.nome || 'Não encontrado')
        
        atualizaStatus(arquivo.id, 'enviando')

        try {
          // Gerar nome único para o arquivo
          console.log('🔧 Gerando nome único...')
          const nomeUnico = generateUniqueFileName(
            arquivo.nome, 
            arquivo.cpf || 'sem_cpf', 
            arquivo.mes, 
            arquivo.ano
          )

          console.log('✅ Nome único gerado:', nomeUnico)

          // Upload para o Supabase Storage
          console.log('☁️ Iniciando upload para storage...')
          console.log('📦 Bucket: holerites')
          console.log('📄 Arquivo:', arquivo.file.name)
          console.log('📏 Tamanho:', arquivo.file.size, 'bytes')
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('holerites')
            .upload(nomeUnico, arquivo.file)

          if (uploadError) {
            console.error('❌ Erro no upload do storage:', uploadError)
            console.error('📋 Detalhes do erro:', {
              message: uploadError.message,
              statusCode: uploadError.statusCode,
              error: uploadError.error
            })
            throw new Error(uploadError.message)
          }

          console.log('✅ Upload para storage concluído')
          console.log('📊 Dados do upload:', uploadData)

          // Obter URL pública do arquivo
          console.log('🔗 Obtendo URL pública...')
          const { data: urlData } = supabase.storage
            .from('holerites')
            .getPublicUrl(nomeUnico)

          console.log('✅ URL pública obtida:', urlData.publicUrl)
          console.log('🔗 Dados da URL:', urlData)

          // Inserir registro no banco de dados
          console.log('💾 === INSERINDO NO BANCO ===')
          console.log('📊 Dados para inserção:', {
            cpf: arquivo.cpf,
            mes: arquivo.mes,
            ano: arquivo.ano,
            file_url: urlData.publicUrl,
            file_name: arquivo.nome,
            file_size: arquivo.tamanho,
            status: 'pendente'
          })

          // Verificar se os dados estão corretos
          console.log('🔍 Validando dados...')
          if (!arquivo.cpf || !arquivo.mes || !arquivo.ano) {
            console.error('❌ Dados inválidos para inserção:', {
              cpf: arquivo.cpf,
              mes: arquivo.mes,
              ano: arquivo.ano
            })
            throw new Error('Dados inválidos para inserção no banco')
          }
          console.log('✅ Dados válidos para inserção')

          console.log('🗄️ Executando INSERT no banco...')
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
            console.error('❌ Erro ao inserir no banco:', dbError)
            console.error('📋 Detalhes completos do erro:', {
              code: dbError.code,
              message: dbError.message,
              details: dbError.details,
              hint: dbError.hint,
              statusCode: dbError.statusCode
            })
            throw new Error(dbError.message)
          }

          console.log('✅ Registro inserido no banco com sucesso!')
          console.log('📊 Dados retornados:', insertData)
          
          // Enviar aviso de holerite pronto
          console.log('📢 === ENVIANDO WEBHOOK ===')
          await enviarAvisoHoleritePronto(arquivo)
          
          console.log('✅ Arquivo processado com sucesso!')
          atualizaStatus(arquivo.id, 'sucesso')
        } catch (error) {
          console.error('❌ Erro no processamento do arquivo:', arquivo.nome)
          console.error('📋 Detalhes do erro:', {
            message: error.message,
            stack: error.stack,
            arquivo: {
              nome: arquivo.nome,
              cpf: arquivo.cpf,
              mes: arquivo.mes,
              ano: arquivo.ano
            }
          })
          atualizaStatus(arquivo.id, 'erro', error.message)
        }
      }

      console.log('🎉 === UPLOAD CONCLUÍDO COM SUCESSO ===')
      setShowSuccess(true)
      setArquivos([])
      
      // Limpar após 5 segundos
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('❌ Erro geral no upload:', error)
      console.error('📋 Stack trace completo:', error.stack)
      setError('Erro geral no upload: ' + error.message)
    } finally {
      console.log('🏁 Finalizando upload, resetando estado')
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
      console.log('📢 Enviando aviso de holerite pronto para funcionário:', arquivo.cpf)
      
      // Buscar dados do funcionário
      console.log('👤 Buscando dados do funcionário...')
      const { data: funcionario, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('cpf', arquivo.cpf)
        .single()

      if (funcError || !funcionario) {
        console.error('❌ Funcionário não encontrado:', arquivo.cpf)
        console.error('📋 Erro na busca:', funcError)
        throw new Error('Funcionário não encontrado')
      }

      console.log('✅ Funcionário encontrado:', funcionario.nome)

      // Verificar configurações do webhook
      console.log('⚙️ Buscando configurações do webhook...')
      const { data: webhookConfig, error: webhookError } = await supabase
        .from('webhook_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (webhookError) {
        console.error('❌ Erro ao buscar configurações do webhook:', webhookError)
        return
      }

      if (!webhookConfig || webhookConfig.length === 0) {
        console.log('⚠️ Nenhuma configuração de webhook encontrada')
        return
      }

      const config = webhookConfig[0]
      console.log('✅ Configurações do webhook encontradas:', {
        ativo: config.ativo,
        holerite_enviado: config.holerite_enviado,
        n8n_url: config.n8n_url ? 'Configurada' : 'Não configurada'
      })
      
      // Verificar se webhook está ativo e se evento de holerite enviado está habilitado
      if (!config.ativo || !config.holerite_enviado) {
        console.log('⚠️ Webhook inativo ou evento de holerite enviado desabilitado')
        return
      }

      if (!config.n8n_url) {
        console.log('⚠️ URL do webhook não configurada')
        return
      }

      console.log('📤 Enviando aviso de holerite pronto...')
      
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

      console.log('📦 Payload do aviso:', payload)

      // Tentativa 1: Requisição direta
      console.log('🔄 Tentativa 1: Requisição direta')
      try {
        const response = await fetch(config.n8n_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })

        console.log('📡 Resposta do webhook:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })

        if (response.ok) {
          console.log('✅ Aviso de holerite pronto enviado com sucesso')
          await atualizarStatusHolerite(arquivo.cpf, arquivo.mes, arquivo.ano)
          return
        } else {
          console.log('❌ Erro na requisição direta:', response.status, response.statusText)
        }
      } catch (error) {
        console.log('❌ Erro CORS na requisição direta:', error.message)
      }

      // Tentativa 2: Proxy CORS
      console.log('🔄 Tentativa 2: Proxy CORS')
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
          console.log('✅ Aviso enviado com sucesso via proxy!')
          await atualizarStatusHolerite(arquivo.cpf, arquivo.mes, arquivo.ano)
          return
        } else {
          console.log('❌ Erro no proxy:', proxyResponse.status)
        }
      } catch (proxyError) {
        console.log('❌ Erro no proxy CORS:', proxyError.message)
      }

      // Se todas as tentativas falharam
      console.log('❌ Todas as tentativas de webhook falharam')
      console.log('💡 Dica: Configure CORS no servidor n8n ou use um proxy')
      
      // Mesmo com falha no webhook, atualizar status
      await atualizarStatusHolerite(arquivo.cpf, arquivo.mes, arquivo.ano)
    } catch (error) {
      console.error('❌ Erro ao enviar aviso de holerite pronto:', error)
      console.error('📋 Stack trace:', error.stack)
    }
  }

  // Função auxiliar para atualizar status
  const atualizarStatusHolerite = async (cpf, mes, ano) => {
    try {
      console.log('🔄 Atualizando status do holerite...')
      const { error: updateError } = await supabase
        .from('holerite')
        .update({ status: 'disponivel' })
        .eq('cpf', cpf)
        .eq('mes', mes)
        .eq('ano', ano)

      if (updateError) {
        console.error('❌ Erro ao atualizar status do holerite:', updateError)
      } else {
        console.log('✅ Status do holerite atualizado para disponivel')
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error)
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
        } else {
          console.log('Holerites carregados:', data)
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

