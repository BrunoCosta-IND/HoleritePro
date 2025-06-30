import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  MessageSquare, 
  FileBarChart, 
  Crown,
  DollarSign,
  Users,
  Sun,
  Moon,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

const CriadorFuncionalidades = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  
  const [funcionalidades, setFuncionalidades] = useState({
    webhookWhatsApp: true,
    relatorioAssinaturas: true
  })
  
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const handleToggle = (funcionalidade) => {
    setFuncionalidades(prev => ({
      ...prev,
      [funcionalidade]: !prev[funcionalidade]
    }))
  }

  const handleSave = () => {
    // Simular salvamento
    localStorage.setItem('funcionalidadesPRO', JSON.stringify(funcionalidades))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleReset = () => {
    setFuncionalidades({
      webhookWhatsApp: false,
      relatorioAssinaturas: false
    })
    setShowConfirmReset(false)
  }

  const funcionalidadesAtivas = Object.values(funcionalidades).filter(Boolean).length
  const totalFuncionalidades = Object.keys(funcionalidades).length

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
                onClick={() => navigate('/criador-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Funcionalidades PRO</h1>
                <p className="text-sm text-muted-foreground">Controle os recursos disponíveis no painel da empresa</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Crown className="h-3 w-3" />
                <span>{funcionalidadesAtivas}/{totalFuncionalidades} Ativas</span>
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
        {/* Informações de preços */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
              <DollarSign className="h-5 w-5" />
              <span>Informações de Preços</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>
                Esta tela permite ativar ou desativar funcionalidades do sistema. Recursos desativados não estarão 
                disponíveis no painel da empresa e exibirão a mensagem: <strong>"Função disponível apenas na versão PRO"</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>R$ 500</strong> para implantação padrão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>R$ 600</strong> para implantação completa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong>R$ 5</strong> por funcionário ativo/mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Webhook de WhatsApp */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-bl-full pointer-events-none"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Webhook de WhatsApp</CardTitle>
                    <CardDescription>
                      Notificações automáticas para funcionários
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={funcionalidades.webhookWhatsApp}
                  onCheckedChange={() => handleToggle('webhookWhatsApp')}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Permite envio automático de mensagens para os funcionários quando um novo holerite estiver disponível.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs">
                  {funcionalidades.webhookWhatsApp ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Campo de Webhook visível no painel do admin</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400">Campo de Webhook oculto no painel do admin</span>
                    </>
                  )}
                </div>
                
                {!funcionalidades.webhookWhatsApp && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      ⚠️ Quando desativado, o administrador verá: "Este recurso está disponível apenas na versão PRO."
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Relatório de Assinaturas */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-bl-full pointer-events-none"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileBarChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Relatório de Assinaturas</CardTitle>
                    <CardDescription>
                      Controle de assinaturas dos holerites
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={funcionalidades.relatorioAssinaturas}
                  onCheckedChange={() => handleToggle('relatorioAssinaturas')}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gera relatório de quais funcionários assinaram ou não os holerites do mês.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs">
                  {funcionalidades.relatorioAssinaturas ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Botão de relatórios visível no painel do admin</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400">Botão de relatórios oculto no painel do admin</span>
                    </>
                  )}
                </div>
                
                {!funcionalidades.relatorioAssinaturas && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      ⚠️ Quando desativado, o administrador verá: "Este recurso está disponível apenas na versão PRO."
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo e ações */}
        <div className="mt-8 space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Resumo das Configurações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Funcionalidades Ativas</h4>
                  <div className="space-y-1">
                    {funcionalidades.webhookWhatsApp && (
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Webhook de WhatsApp</span>
                      </div>
                    )}
                    {funcionalidades.relatorioAssinaturas && (
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Relatório de Assinaturas</span>
                      </div>
                    )}
                    {funcionalidadesAtivas === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhuma funcionalidade ativa</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Impacto no Painel do Admin</h4>
                  <p className="text-xs text-muted-foreground">
                    As alterações serão aplicadas imediatamente no painel do administrador. 
                    Recursos desativados não aparecerão ou mostrarão mensagem de upgrade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmReset(true)}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrões
            </Button>
          </div>

          {/* Mensagens */}
          {showSuccess && (
            <Alert className="bg-green-900/50 border-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-200">
                Configurações atualizadas com sucesso! As alterações já estão ativas no painel do administrador.
              </AlertDescription>
            </Alert>
          )}

          {showConfirmReset && (
            <Alert className="bg-yellow-900/50 border-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-200">
                <p className="mb-3">Tem certeza que deseja restaurar os padrões? Todas as funcionalidades serão desativadas.</p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="destructive" onClick={handleReset}>
                    Sim, restaurar padrões
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowConfirmReset(false)}>
                    Cancelar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default CriadorFuncionalidades

