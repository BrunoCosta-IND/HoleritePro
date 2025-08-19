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
import { supabase } from '@/lib/utils'

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
  const [holerites, setHolerites] = useState([])
  const [ip, setIp] = useState('')

  useEffect(() => {
    // Verificar se o funcionário está logado
    const usuarioLogado = localStorage.getItem('usuarioLogado')
    if (!usuarioLogado) {
      navigate('/funcionario-login')
      return
    }
    const dadosUsuario = JSON.parse(usuarioLogado)
    setFuncionario(dadosUsuario)

    // Buscar IP público e holerite em paralelo
    const fetchData = async () => {
      try {
        // Buscar holerite do Supabase pelo ID
        const { data, error } = await supabase
          .from('holerite')
          .select('*')
          .eq('id', id)
          .single()
        
        if (!error && data && data.cpf === dadosUsuario.cpf) {
          setHolerite(data)
        } else {
          setHolerite(null)
        }
      } catch (error) {
        setHolerite(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Buscar IP em background (não aguardar)
    setImmediate(() => {
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => setIp(data.ip))
        .catch(() => setIp(''))
    })

    fetchData()
  }, [navigate, id])

  const handleVoltar = () => {
    navigate('/funcionario-dashboard')
  }

  // Função para enviar webhook quando holerite for assinado
  const enviarWebhookHoleriteAssinado = async (holerite, funcionario) => {
    try {
      // Buscar configurações do webhook com timeout
      const webhookPromise = supabase
        .from('webhook_config')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )

      const { data: webhookConfig, error: webhookError } = await Promise.race([
        webhookPromise,
        timeoutPromise
      ])

      if (webhookError) {
        return
      }

      if (!webhookConfig || webhookConfig.length === 0) {
        return
      }

      const config = webhookConfig[0]
      
      // Verificar se webhook está ativo e se evento de holerite assinado está habilitado
      if (!config.ativo || !config.holerite_assinado) {
        return
      }

      if (!config.n8n_url) {
        return
      }
      
      const payload = {
        evento: 'holerite_assinado',
        timestamp: new Date().toISOString(),
        holerite: {
          id: holerite.id,
          mes: holerite.mes,
          ano: holerite.ano,
          arquivo: holerite.arquivo,
          status: 'assinado',
          data_assinatura: new Date().toISOString()
        },
        funcionario: {
          nome: funcionario?.nome || 'Não informado',
          cpf: funcionario?.cpf || holerite.cpf,
          telefone: funcionario?.whatsapp || 'Não informado',
          email: funcionario?.email || 'Não informado'
        },
        ip: ip,
        sistema: 'gestao-holerites'
      }

      const response = await fetch(config.n8n_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      // Erro silencioso
    }
  }

  const handleAssinarDocumento = async () => {
    if (!aceitouTermos) {
      return
    }
    
    setAssinandoDocumento(true)
    
    try {
      // Atualizar status no Supabase (otimizado)
      const { error } = await supabase
        .from('holerite')
        .update({ status: 'assinado' })
        .eq('id', holerite.id)
      
      if (error) {
        return
      }
      
      // Enviar webhook em background (não aguardar)
      setImmediate(() => {
        enviarWebhookHoleriteAssinado(holerite, funcionario)
      })
      
      setDocumentoAssinado(true)
      // Redirecionar imediatamente
      setTimeout(() => {
        navigate('/funcionario-dashboard')
      }, 1000)
      
    } catch (catchError) {
      // Erro silencioso
    } finally {
      setAssinandoDocumento(false)
    }
  }

  const handleVisualizarPDF = () => {
    // Simular visualização do PDF
  }

  const handleDownloadPDF = () => {
    if (documentoAssinado) {
      // Simular download
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
          <p className="text-gray-600 dark:text-gray-400">Carregando holerites...</p>
        </div>
      </div>
    )
  }

  if (!funcionario) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Funcionário não encontrado.</p>
          <Button onClick={handleVoltar} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="max-w-4xl w-full mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Meus Holerites</CardTitle>
          </CardHeader>
          <CardContent>
            {holerites.length === 0 ? (
              <div className="text-center text-gray-400">Nenhum holerite encontrado para seu CPF.</div>
            ) : (
              <table className="w-full text-sm text-left text-gray-200">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-2">Mês</th>
                    <th className="px-4 py-2">Ano</th>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Arquivo</th>
                  </tr>
                </thead>
                <tbody>
                  {holerites.map((h) => (
                    <tr key={h.id} className="border-b border-zinc-700">
                      <td className="px-4 py-2">{h.mes || '-'}</td>
                      <td className="px-4 py-2">{h.ano || '-'}</td>
                      <td className="px-4 py-2">{h['Criado em'] || '-'}</td>
                      <td className="px-4 py-2">{h.status || '-'}</td>
                      <td className="px-4 py-2">
                        {h.Arquivo ? (
                          <a href={h.Arquivo} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ver PDF</a>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        {holerite && holerite.status === 'pendente' && !documentoAssinado && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Assinatura de Holerite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-sm text-gray-200">
                <b>Termo de Aceite:</b><br/>
                Declaro que li e concordo com o conteúdo deste holerite, e que esta assinatura eletrônica tem validade jurídica conforme a legislação vigente. Estou ciente de que a assinatura é pessoal, intransferível e registrada com data, hora e IP.
              </div>
              <div className="flex items-center mb-4">
                <Checkbox id="aceite-termo" checked={aceitouTermos} onCheckedChange={setAceitouTermos} />
                <label htmlFor="aceite-termo" className="ml-2 text-gray-200 text-sm">
                  Li e aceito os termos acima e declaro que esta assinatura é minha responsabilidade.
                </label>
              </div>
              <Button
                onClick={handleAssinarDocumento}
                disabled={!aceitouTermos || assinandoDocumento}
                className="w-full font-bold"
              >
                {assinandoDocumento ? 'Assinando...' : 'Confirmar assinatura'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FuncionarioHolerite

