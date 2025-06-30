import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Crown, 
  FileText, 
  Sun, 
  Moon, 
  Building2, 
  Users, 
  Calendar,
  Activity,
  Palette,
  Shield,
  BarChart3,
  LogOut
} from 'lucide-react'

const CriadorDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const [empresaConfig, setEmpresaConfig] = useState({
    nome: 'Empresa Exemplo Ltda',
    logo: null,
    planoAtivo: 'PRO',
    ultimaModificacao: new Date().toLocaleDateString('pt-BR'),
    totalUsuarios: 25,
    holeritesEnviados: 142
  })

  const handleNavigation = (route) => {
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo da empresa */}
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{empresaConfig.nome}</h1>
                <p className="text-sm text-muted-foreground">Painel de Controle do Sistema</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Botão de editar personalização */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigation('/criador-personalizacao')}
                className="hidden md:flex"
              >
                <Palette className="h-4 w-4 mr-2" />
                Editar Personalização
              </Button>
              
              {/* Botão de alternância de tema */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {/* Botão de sair */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/criador-login')}
                title="Sair"
                className="ml-2"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-6 py-8">
        {/* Cards informativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Status do plano */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status do Plano</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresaConfig.planoAtivo}</div>
              <Badge variant="secondary" className="mt-1">
                Versão Completa Ativa
              </Badge>
            </CardContent>
          </Card>

          {/* Última modificação */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Modificação</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresaConfig.ultimaModificacao}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Configurações do sistema
              </p>
            </CardContent>
          </Card>

          {/* Total de usuários */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Cadastrados</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresaConfig.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Funcionários ativos
              </p>
            </CardContent>
          </Card>

          {/* Holerites enviados */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holerites do Mês</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresaConfig.holeritesEnviados}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Documentos processados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Editar Personalização */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" 
                onClick={() => handleNavigation('/criador-personalizacao')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Editar Personalização</CardTitle>
                  <CardDescription>
                    Configure a identidade visual do sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Altere nome, logo, cores, fontes e favicon da aplicação para personalizar a experiência da empresa.
              </p>
              <Button className="w-full mt-4" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Acessar Configurações
              </Button>
            </CardContent>
          </Card>

          {/* Gerenciar Plano */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleNavigation('/criador-funcionalidades')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Gerenciar Plano</CardTitle>
                  <CardDescription>
                    Controle os recursos disponíveis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ative ou desative funcionalidades PRO como webhooks, relatórios e assinatura digital.
              </p>
              <Button className="w-full mt-4" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Configurar Recursos
              </Button>
            </CardContent>
          </Card>

          {/* Visualizar Logs */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Visualizar Logs</CardTitle>
                  <CardDescription>
                    Monitore atividades do sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acompanhe ações realizadas por administradores e funcionários com detalhes de data, IP e dispositivo.
              </p>
              <Button className="w-full mt-4" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Informações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Versão do Sistema</p>
                  <p className="text-muted-foreground">v1.0.0 - Gestão de Holerites</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tipo de Licença</p>
                  <p className="text-muted-foreground">Licença Corporativa PRO</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Suporte Técnico</p>
                  <p className="text-muted-foreground">Disponível 24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default CriadorDashboard

