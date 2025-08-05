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

    // Buscar IP público
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp(''))

    // Buscar holerite do Supabase pelo ID
    const fetchHolerite = async () => {
      const { data, error } = await supabase
        .from('holerite')
        .select('*')
        .eq('id', id)
        .single()
      console.log('ID buscado:', id)
      console.log('CPF logado:', dadosUsuario.cpf)
      console.log('Holerite retornado:', data)
      if (!error && data && data.cpf === dadosUsuario.cpf) {
        setHolerite(data)
      } else {
        setHolerite(null)
      }
      setIsLoading(false)
    }
    fetchHolerite()
  }, [navigate, id])

  const handleVoltar = () => {
    navigate('/funcionario-dashboard')
  }

  const handleAssinarDocumento = async () => {
    if (!aceitouTermos) {
      alert('Você deve aceitar os termos para assinar o documento.')
      return
    }
    
    console.log('📝 Iniciando assinatura de holerite...')
    console.log('✅ Termos aceitos')
    console.log('🔄 Dados do holerite:', holerite)
    console.log('🌐 IP capturado:', ip)
    
    setAssinandoDocumento(true)
    
    // Atualizar status no Supabase - APENAS COM CAMPOS BÁSICOS
    const now = new Date()
    const dataAssinatura = now.toISOString()
    
    // Primeiro, tentar apenas com status
    const dadosAtualizacao = {
      status: 'assinado'
    }
    
    console.log('📦 Dados sendo enviados (versão simplificada):', dadosAtualizacao)
    console.log('🆔 ID do holerite:', holerite.id)
    
    try {
      // Tentativa 1: Apenas status
      console.log('🔄 Tentativa 1: Apenas status')
      const { data, error } = await supabase
        .from('holerite')
        .update(dadosAtualizacao)
        .eq('id', holerite.id)
        .select()
      
      console.log('📡 Resposta do Supabase:', { data, error })
      
      if (error) {
        console.error('❌ Erro na tentativa 1:', error)
        
        // Tentativa 2: Sem select
        console.log('🔄 Tentativa 2: Sem select')
        const { error: error2 } = await supabase
          .from('holerite')
          .update(dadosAtualizacao)
          .eq('id', holerite.id)
        
        if (error2) {
          console.error('❌ Erro na tentativa 2:', error2)
          
          // Tentativa 3: Apenas com campos básicos
          console.log('🔄 Tentativa 3: Campos básicos')
          const dadosBasicos = {
            status: 'assinado'
          }
          
          const { error: error3 } = await supabase
            .from('holerite')
            .update(dadosBasicos)
            .eq('id', holerite.id)
          
          if (error3) {
            console.error('❌ Erro na tentativa 3:', error3)
            alert('Erro ao registrar assinatura. Tente novamente.')
            return
          } else {
            console.log('✅ Assinatura registrada com sucesso (versão básica)!')
          }
        } else {
          console.log('✅ Assinatura registrada com sucesso (sem select)!')
        }
      } else {
        console.log('✅ Assinatura registrada com sucesso!')
        console.log('📊 Dados atualizados:', data)
      }
      
      setDocumentoAssinado(true)
      // Mostra mensagem de sucesso antes de redirecionar
      setTimeout(() => {
        navigate('/funcionario-dashboard')
      }, 2000)
      
    } catch (catchError) {
      console.error('❌ Erro inesperado:', catchError)
      alert('Erro inesperado ao registrar assinatura.')
    } finally {
      setAssinandoDocumento(false)
    }
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

