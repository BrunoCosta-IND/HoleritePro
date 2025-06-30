import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Download, 
  CheckCircle, 
  ArrowLeft,
  AlertTriangle,
  Eye,
  Shield,
  Calendar,
  DollarSign,
  Building2,
  User
} from 'lucide-react'

const FuncionarioHolerite = ({ theme }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [funcionario, setFuncionario] = useState(null)
  const [holerite, setHolerite] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [assinandoDocumento, setAssinandoDocumento] = useState(false)
  const [documentoAssinado, setDocumentoAssinado] = useState(false)
  const [assinou, setAssinou] = useState(false)
  const [aceite, setAceite] = useState(false)

  useEffect(() => {
    // Verificar se o funcionário está logado
    const funcionarioLogado = localStorage.getItem('funcionarioLogado')
    if (!funcionarioLogado) {
      navigate('/funcionario-login')
      return
    }

    const dadosFuncionario = JSON.parse(funcionarioLogado)
    setFuncionario(dadosFuncionario)

    // Simular busca do holerite
    setTimeout(() => {
      const holeriteData = {
        id: parseInt(id),
        mes: 'Junho',
        ano: 2025,
        dataEnvio: '2025-06-23',
        status: 'pendente',
        arquivo: 'Holerites_Junho_2025.pdf',
        valor: 'R$ 5.500,00',
        detalhes: {
          salarioBruto: 'R$ 7.000,00',
          descontos: 'R$ 1.500,00',
          salarioLiquido: 'R$ 5.500,00',
          inss: 'R$ 770,00',
          irrf: 'R$ 450,00',
          valeTransporte: 'R$ 280,00'
        }
      }
      setHolerite(holeriteData)
      setIsLoading(false)
    }, 1000)
  }, [navigate, id])

  const handleVoltar = () => {
    navigate('/funcionario-dashboard')
  }

  const handleAssinarDocumento = async () => {
    if (!aceitouTermos) {
      alert('Você deve aceitar os termos para assinar o documento.')
      return
    }

    setAssinandoDocumento(true)

    // Simular processo de assinatura
    setTimeout(() => {
      setDocumentoAssinado(true)
      setAssinandoDocumento(false)
      
      // Atualizar status no localStorage (simulação)
      const holeriteAtualizado = {
        ...holerite,
        status: 'assinado',
        dataAssinatura: new Date().toISOString().split('T')[0]
      }
      
      // Em uma aplicação real, isso seria salvo no backend
      console.log('Holerite assinado:', holeriteAtualizado)
      
      // Mostrar mensagem de sucesso
      setTimeout(() => {
        navigate('/funcionario-dashboard')
      }, 3000)
    }, 2000)
  }

  const handleVisualizarPDF = () => {
    // Simular visualização do PDF
    alert('Abrindo visualização do PDF do holerite...')
  }

  const handleDownloadPDF = () => {
    if (documentoAssinado) {
      // Simular download
      alert(`Download iniciado: ${holerite.arquivo}`)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando holerite...</p>
        </div>
      </div>
    )
  }

  if (!funcionario || !holerite) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Holerite não encontrado.</p>
          <Button onClick={handleVoltar} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="max-w-2xl w-full mx-auto">
        {/* Termo de aceite */}
        {!assinou && (
          <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 border border-zinc-800 mb-8">
            <div className="flex items-center mb-2">
              <span className="mr-2 text-white"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 0v4m0 8v2m0 0h.01"/></svg></span>
              <h2 className="text-lg font-bold text-white">Assinatura Digital</h2>
            </div>
            <p className="text-zinc-300 mb-4">Confirme que está ciente e concorda com as informações do holerite</p>
            <div className="bg-zinc-800 border border-blue-500 rounded-lg p-4 mb-4">
              <div className="font-semibold text-white mb-2">Termos de Aceite</div>
              <ul className="text-zinc-200 text-sm list-disc pl-5 space-y-1">
                <li>Confirmo que revisei todas as informações do holerite</li>
                <li>Estou ciente dos valores de salário bruto, descontos e salário líquido</li>
                <li>Concordo com os descontos aplicados conforme legislação vigente</li>
                <li>Entendo que esta assinatura digital tem validade legal</li>
              </ul>
            </div>
            <div className="flex items-start mb-6">
              <input
                id="aceite"
                type="checkbox"
                checked={aceite}
                onChange={e => setAceite(e.target.checked)}
                className="accent-purple-500 w-5 h-5 rounded mt-1 mr-2"
              />
              <label htmlFor="aceite" className="text-zinc-100 select-none">
                <span className="font-bold">Declaro que estou ciente</span> de todas as informações contidas neste holerite e concordo com os valores apresentados. Ao assinar digitalmente este documento, confirmo o recebimento das informações e autorizo o processamento dos dados.
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 transition"
                onClick={() => window.history.back()}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60 flex items-center gap-2"
                disabled={!aceite}
                onClick={() => setAssinou(true)}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                Assinar Documento
              </button>
            </div>
          </div>
        )}
        {/* Dados do holerite */}
        {assinou && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleVoltar}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Voltar</span>
                    </Button>
                    
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Holerite {holerite.mes}/{holerite.ano}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {funcionario.nome}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Conteúdo principal */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                {/* Alerta de sucesso */}
                {documentoAssinado && (
                  <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      <strong>Documento assinado com sucesso!</strong> Você será redirecionado para o dashboard em alguns segundos.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Informações do holerite */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Detalhes do Holerite</span>
                    </CardTitle>
                    <CardDescription>
                      Informações detalhadas do seu holerite de {holerite.mes}/{holerite.ano}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Informações gerais */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Funcionário
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <User className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900 dark:text-white">{funcionario.nome}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Período
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900 dark:text-white">{holerite.mes}/{holerite.ano}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Data de Envio
                          </label>
                          <p className="text-gray-900 dark:text-white">{formatDate(holerite.dataEnvio)}</p>
                        </div>
                      </div>

                      {/* Valores */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Salário Bruto
                          </label>
                          <div className="flex items-center space-x-2 mt-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900 dark:text-white font-medium">{holerite.detalhes.salarioBruto}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total de Descontos
                          </label>
                          <p className="text-red-600 dark:text-red-400 font-medium">{holerite.detalhes.descontos}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Salário Líquido
                          </label>
                          <p className="text-green-600 dark:text-green-400 font-bold text-lg">{holerite.detalhes.salarioLiquido}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detalhamento dos descontos */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Detalhamento dos Descontos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">INSS</p>
                          <p className="font-medium text-gray-900 dark:text-white">{holerite.detalhes.inss}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">IRRF</p>
                          <p className="font-medium text-gray-900 dark:text-white">{holerite.detalhes.irrf}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Vale Transporte</p>
                          <p className="font-medium text-gray-900 dark:text-white">{holerite.detalhes.valeTransporte}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visualização do documento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Documento PDF</span>
                    </CardTitle>
                    <CardDescription>
                      Visualize o documento completo antes de assinar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {holerite.arquivo}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Clique no botão abaixo para visualizar o documento PDF completo
                      </p>
                      <Button
                        onClick={handleVisualizarPDF}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Visualizar PDF</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Ações pós-assinatura */}
                {documentoAssinado && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Documento Assinado</span>
                      </CardTitle>
                      <CardDescription>
                        Seu holerite foi assinado digitalmente com sucesso
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center space-x-3">
                        <Button
                          onClick={handleVisualizarPDF}
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Visualizar</span>
                        </Button>
                        
                        <Button
                          onClick={handleDownloadPDF}
                          className="flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuncionarioHolerite

