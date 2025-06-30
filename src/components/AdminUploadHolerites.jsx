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
  Send
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const AdminUploadHolerites = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // Configurações da empresa
  const [empresaConfig, setEmpresaConfig] = useState({
    nome: 'Minha Empresa Personalizada',
    corBotoes: '#ff6b35'
  })

  // Funcionalidades PRO
  const [funcionalidadesPRO, setFuncionalidadesPRO] = useState({
    webhookWhatsApp: false, // Desativado conforme teste anterior
    relatorioAssinaturas: true
  })

  // Estados do upload
  const [arquivos, setArquivos] = useState([])
  const [webhookUrl, setWebhookUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Lista de funcionários (carregada do Supabase)
  const [funcionarios, setFuncionarios] = useState([])
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true)

  useEffect(() => {
    // Carregar configurações do localStorage
    const configSalva = localStorage.getItem('empresaConfig')
    if (configSalva) {
      setEmpresaConfig(prev => ({ ...prev, ...JSON.parse(configSalva) }))
    }

    const funcionalidadesSalvas = localStorage.getItem('funcionalidadesPRO')
    if (funcionalidadesSalvas) {
      setFuncionalidadesPRO(JSON.parse(funcionalidadesSalvas))
    }

    // Carregar funcionários do Supabase
    carregarFuncionarios()
  }, [])

  const carregarFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('id, nome, cpf, email')
        .order('nome')

      if (error) {
        console.error('Erro ao carregar funcionários:', error)
        return
      }

      setFuncionarios(data || [])
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error)
    } finally {
      setLoadingFuncionarios(false)
    }
  }

  // Função para normalizar nomes (remover acentos, espaços, underlines, etc)
  const normalizarNome = (nome) => {
    if (!nome) return '';
    return nome
      .toUpperCase()
      .normalize('NFD')
      .replace(/[0-\u036f]/g, '') // Remove acentos
      .replace(/[^A-Z0-9]/g, ''); // Remove tudo que não seja letra maiúscula ou número
  }

  // Função para identificar funcionário pelo nome do arquivo
  const identificarFuncionario = (nomeArquivo) => {
    // Remove a extensão .pdf
    const nomeSemExtensao = nomeArquivo.replace(/\.pdf$/i, '')
    
    // Normaliza o nome do arquivo
    const nomeArquivoNormalizado = normalizarNome(nomeSemExtensao)
    
    // Procura o funcionário com nome correspondente
    const funcionarioEncontrado = funcionarios.find(funcionario => {
      const nomeFuncionarioNormalizado = normalizarNome(funcionario.nome)
      return nomeFuncionarioNormalizado === nomeArquivoNormalizado
    })
    
    return funcionarioEncontrado
  }

  // Função para extrair mês e ano do nome do arquivo
  const extrairMesAno = (nomeArquivo) => {
    // Tenta encontrar padrões tipo _JANEIRO_2024, _01_2024, _JAN_2024, etc
    const regex = /_(\w+)[ _-](\d{4})/i
    const match = nomeArquivo.match(regex)
    if (match) {
      let mes = match[1]
      let ano = match[2]
      // Normaliza mês para maiúsculo
      mes = mes.toUpperCase()
      return { mes, ano }
    }
    return { mes: 'Desconhecido', ano: 'Desconhecido' }
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== files.length) {
      setErrors({ files: 'Apenas arquivos PDF são aceitos' })
      return
    }

    // Identificar funcionários pelos nomes dos arquivos
    const novosArquivos = pdfFiles.map((file, index) => {
      const funcionario = identificarFuncionario(file.name)
      
      return {
        id: Date.now() + index,
        file,
        nome: file.name,
        tamanho: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        funcionario: funcionario,
        status: funcionario ? 'pendente' : 'erro',
        erro: funcionario ? null : 'Funcionário não encontrado'
      }
    })

    setArquivos(prev => [...prev, ...novosArquivos])
    setErrors({})
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeArquivo = (id) => {
    setArquivos(prev => prev.filter(arquivo => arquivo.id !== id))
  }

  const validateForm = () => {
    const newErrors = {}

    if (arquivos.length === 0) {
      newErrors.files = 'Selecione pelo menos um arquivo PDF'
    }

    // Verificar se há arquivos com erro (funcionário não encontrado)
    const arquivosComErro = arquivos.filter(arquivo => arquivo.status === 'erro')
    if (arquivosComErro.length > 0) {
      newErrors.files = `${arquivosComErro.length} arquivo(s) não puderam ser associados a funcionários. Verifique os nomes dos arquivos.`
    }

    if (funcionalidadesPRO.webhookWhatsApp && !webhookUrl.trim()) {
      newErrors.webhook = 'URL do Webhook é obrigatória quando a funcionalidade está ativa'
    }

    if (webhookUrl.trim() && !webhookUrl.startsWith('http')) {
      newErrors.webhook = 'URL do Webhook deve começar com http:// ou https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpload = async () => {
    if (!validateForm()) return

    setIsUploading(true)
    setUploadProgress({})

    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i]
      if (!arquivo.funcionario) continue // Pula arquivos sem funcionário

      // 1. Upload do PDF para o Storage
      // Gerar nome seguro para o arquivo
      const nomeArquivoSeguro = arquivo.nome
        .normalize('NFD')
        .replace(/[0-\u036f]/g, '') // remove acentos
        .replace(/[^A-Za-z0-9_.-]/g, '_'); // só letras, números, underline, ponto e traço

      // Gerar nome seguro para a pasta do funcionário
      let pastaFuncionario = arquivo.funcionario.nome
        .toUpperCase()
        .normalize('NFD')
        .replace(/[0-\u036f]/g, '') // remove acentos
        .replace(/[^A-Z0-9]/g, '_'); // só letras maiúsculas, números e underline

      if (!pastaFuncionario) pastaFuncionario = 'FUNCIONARIO_DESCONHECIDO';

      const storagePath = `${pastaFuncionario}/${nomeArquivoSeguro}`;

      // LOGS PARA DEPURAÇÃO
      console.log('Arquivo:', arquivo.file, 'É File?', arquivo.file instanceof File);
      console.log('Path:', storagePath);

      // LOGS PARA DEPURAÇÃO DE IDENTIFICAÇÃO
      console.log('Funcionários carregados:', funcionarios);
      console.log('Nome original arquivo:', arquivo.nome.replace(/\.pdf$/i, ''));
      console.log('Nome original funcionário:', arquivo.funcionario?.nome);
      const nomeArquivoNormalizado = normalizarNome(arquivo.nome.replace(/\.pdf$/i, ''));
      console.log('Nome arquivo normalizado:', nomeArquivoNormalizado);
      console.log('Nomes funcionários normalizados:', funcionarios.map(f => normalizarNome(f.nome)));

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('holerites')
        .upload(storagePath, arquivo.file, { upsert: true })

      if (uploadError) {
        setArquivos(prev => prev.map(a => a.id === arquivo.id ? { ...a, status: 'erro', erro: 'Erro ao fazer upload do PDF' } : a))
        continue
      }

      // 2. Gerar URL pública do PDF
      const { data: urlData } = supabase.storage.from('holerites').getPublicUrl(storagePath)
      const pdfUrl = urlData?.publicUrl || ''

      // 3. Extrair mês e ano do nome do arquivo
      const { mes, ano } = extrairMesAno(arquivo.nome)

      // 4. Inserir registro na tabela 'holerites'
      const { error: insertError } = await supabase
        .from('holerites')
        .insert([
          {
            user_id: arquivo.funcionario.id,
            mes,
            ano,
            salario_bruto: 0,
            descontos: 0,
            salario_liquido: 0,
            pdf_url: pdfUrl
          }
        ])

      if (insertError) {
        setArquivos(prev => prev.map(a => a.id === arquivo.id ? { ...a, status: 'erro', erro: 'Erro ao salvar no banco' } : a))
        continue
      }

      // Marcar como concluído
      setArquivos(prev => prev.map(a => a.id === arquivo.id ? { ...a, status: 'concluido' } : a))
    }

    setIsUploading(false)
    setShowSuccess(true)
    setTimeout(() => {
      setArquivos([])
      setWebhookUrl('')
      setShowSuccess(false)
      setUploadProgress({})
    }, 5000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return 'bg-green-500'
      case 'erro': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'concluido': return 'Enviado'
      case 'erro': return 'Erro'
      default: return 'Pendente'
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
                onClick={() => navigate('/admin-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Upload de Holerites</h1>
                <p className="text-sm text-muted-foreground">Enviar holerites em lote para os funcionários</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{arquivos.length} arquivo(s)</span>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mensagem de sucesso */}
          {showSuccess && (
            <Alert className="bg-green-900/50 border-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">
                Upload concluído com sucesso! {funcionalidadesPRO.webhookWhatsApp ? 'Notificações enviadas via WhatsApp.' : 'Funcionários podem acessar os holerites no sistema.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Área de upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Selecionar Arquivos</span>
              </CardTitle>
              <CardDescription>
                Selecione os arquivos PDF dos holerites. O sistema identificará automaticamente cada funcionário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Input de arquivo */}
                <div className="space-y-2">
                  <Label htmlFor="files">Arquivos PDF *</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="files"
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="flex-1"
                      disabled={loadingFuncionarios}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loadingFuncionarios}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar
                    </Button>
                  </div>
                  {errors.files && (
                    <p className="text-sm text-red-500">{errors.files}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Aceita múltiplos arquivos PDF. Tamanho máximo: 10MB por arquivo.
                  </p>
                  
                  {/* Indicador de carregamento dos funcionários */}
                  {loadingFuncionarios && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando lista de funcionários...</span>
                    </div>
                  )}
                  
                  {/* Informação sobre funcionários carregados */}
                  {!loadingFuncionarios && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✓ {funcionarios.length} funcionário(s) carregado(s) - Pronto para identificação automática
                    </p>
                  )}
                </div>

                {/* Configuração de Webhook - Condicional */}
                {funcionalidadesPRO.webhookWhatsApp ? (
                  <div className="space-y-2">
                    <Label htmlFor="webhook">URL do Webhook WhatsApp *</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="webhook"
                        placeholder="https://api.whatsapp.com/webhook..."
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className={`pl-10 ${errors.webhook ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.webhook && (
                      <p className="text-sm text-red-500">{errors.webhook}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      URL para envio automático de notificações via WhatsApp
                    </p>
                  </div>
                ) : (
                  <Alert className="bg-yellow-900/50 border-yellow-700">
                    <Crown className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      <strong>Webhook de WhatsApp:</strong> Este recurso está disponível apenas na versão PRO. 
                      Os funcionários receberão os holerites apenas através do sistema.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de arquivos */}
          {arquivos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Arquivos Selecionados</span>
                </CardTitle>
                <CardDescription>
                  Funcionários identificados automaticamente pelo sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {arquivos.map((arquivo) => (
                    <div key={arquivo.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4 flex-1">
                        <FileText className={`h-8 w-8 ${arquivo.status === 'erro' ? 'text-red-500' : 'text-blue-500'}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{arquivo.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {arquivo.tamanho} • {arquivo.funcionario?.nome} ({arquivo.funcionario?.cpf})
                          </p>
                          
                          {/* Mostrar erro se funcionário não encontrado */}
                          {arquivo.status === 'erro' && (
                            <p className="text-xs text-red-500 mt-1">
                              ❌ {arquivo.erro}
                            </p>
                          )}
                          
                          {/* Barra de progresso */}
                          {uploadProgress[arquivo.id] !== undefined && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress[arquivo.id]}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {uploadProgress[arquivo.id]}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`${
                            arquivo.status === 'erro' 
                              ? 'bg-red-50 text-red-700 border-red-300' 
                              : arquivo.status === 'concluido'
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                          }`}
                        >
                          {arquivo.status === 'erro' ? 'Erro' : getStatusText(arquivo.status)}
                        </Badge>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArquivo(arquivo.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumo e ações */}
          {arquivos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Envio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="font-medium text-sm">Total de Arquivos</p>
                    <p className="text-2xl font-bold text-blue-500">{arquivos.length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Funcionários Afetados</p>
                    <p className="text-2xl font-bold text-green-500">
                      {new Set(arquivos.map(a => a.funcionario?.cpf)).size}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Método de Notificação</p>
                    <p className="text-sm text-muted-foreground">
                      {funcionalidadesPRO.webhookWhatsApp ? 'WhatsApp + Sistema' : 'Apenas Sistema'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || arquivos.length === 0 || loadingFuncionarios || funcionarios.length === 0}
                    className="flex-1"
                    style={{ backgroundColor: empresaConfig.corBotoes }}
                  >
                    {isUploading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Enviar Holerites</span>
                      </div>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin-dashboard')}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Identificação Automática</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• O sistema identifica funcionários pelo nome do arquivo</li>
                    <li>• <strong>Formato obrigatório:</strong> Nome do funcionário (exatamente como cadastrado)</li>
                    <li>• <strong>Exemplos válidos:</strong></li>
                    <li className="ml-4">- BRUNO_COSTA_DE_OLIVEIRA.pdf</li>
                    <li className="ml-4">- BRUNOCOSTADEOLIVEIRA.pdf</li>
                    <li className="ml-4">- BRUNO COSTA DE OLIVEIRA.pdf</li>
                    <li>• O sistema normaliza automaticamente (remove acentos, espaços, etc)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Processo de Envio</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Upload seguro com criptografia</li>
                    <li>• Notificação automática aos funcionários</li>
                    <li>• Controle de acesso e assinatura digital</li>
                    <li>• Cada funcionário vê apenas seus próprios holerites</li>
                  </ul>
                </div>
              </div>
              
              {/* Alerta sobre nomes */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Importante:</strong> O nome do arquivo deve corresponder exatamente ao nome do funcionário cadastrado no sistema. 
                    Se o funcionário não for encontrado, o arquivo será marcado com erro e não será enviado.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminUploadHolerites

