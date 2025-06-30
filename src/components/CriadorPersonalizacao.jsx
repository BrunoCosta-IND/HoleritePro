import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  RotateCcw, 
  Eye, 
  Palette,
  Type,
  Image as ImageIcon,
  Building2,
  Sun,
  Moon
} from 'lucide-react'

const CriadorPersonalizacao = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const logoInputRef = useRef(null)
  const faviconInputRef = useRef(null)
  
  const [config, setConfig] = useState({
    nomeEmpresa: 'Empresa Exemplo Ltda',
    logo: null,
    logoPreview: null,
    corFundo: '#1a1a1a',
    corBotoes: '#8b5cf6',
    corTextos: '#ffffff',
    fonte: 'Inter',
    favicon: null,
    faviconPreview: null
  })
  
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const fontes = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Poppins', label: 'Poppins' }
  ]

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = (field) => {
    setConfig(prev => ({
      ...prev,
      [field]: null,
      [`${field}Preview`]: null
    }))
  }

  const handleSave = () => {
    // Simular salvamento
    localStorage.setItem('empresaConfig', JSON.stringify(config))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleReset = () => {
    setConfig({
      nomeEmpresa: 'Empresa Exemplo Ltda',
      logo: null,
      logoPreview: null,
      corFundo: '#1a1a1a',
      corBotoes: '#8b5cf6',
      corTextos: '#ffffff',
      fonte: 'Inter',
      favicon: null,
      faviconPreview: null
    })
    setShowConfirmReset(false)
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
                onClick={() => navigate('/criador-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Personalização do Sistema</h1>
                <p className="text-sm text-muted-foreground">Configure a identidade visual da aplicação</p>
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

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nome da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Nome da Empresa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome que será exibido no sistema</Label>
                  <Input
                    id="nomeEmpresa"
                    placeholder="Digite o nome que será exibido no sistema"
                    value={config.nomeEmpresa}
                    onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Logo da Empresa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Selecionar Logo</span>
                    </Button>
                    {config.logoPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile('logo')}
                      >
                        <X className="h-4 w-4" />
                        Remover
                      </Button>
                    )}
                  </div>
                  
                  {config.logoPreview && (
                    <div className="w-24 h-24 border border-border rounded-lg overflow-hidden">
                      <img 
                        src={config.logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: JPG, PNG, SVG
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cores do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Cores do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="corFundo">Cor de Fundo Principal</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="corFundo"
                        type="color"
                        value={config.corFundo}
                        onChange={(e) => handleInputChange('corFundo', e.target.value)}
                        className="w-12 h-10 border border-border rounded cursor-pointer"
                      />
                      <Input
                        value={config.corFundo}
                        onChange={(e) => handleInputChange('corFundo', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corBotoes">Cor dos Botões</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="corBotoes"
                        type="color"
                        value={config.corBotoes}
                        onChange={(e) => handleInputChange('corBotoes', e.target.value)}
                        className="w-12 h-10 border border-border rounded cursor-pointer"
                      />
                      <Input
                        value={config.corBotoes}
                        onChange={(e) => handleInputChange('corBotoes', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="corTextos">Cor dos Textos</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="corTextos"
                        type="color"
                        value={config.corTextos}
                        onChange={(e) => handleInputChange('corTextos', e.target.value)}
                        className="w-12 h-10 border border-border rounded cursor-pointer"
                      />
                      <Input
                        value={config.corTextos}
                        onChange={(e) => handleInputChange('corTextos', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fonte do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="h-5 w-5" />
                  <span>Fonte do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Selecione a fonte</Label>
                  <Select value={config.fonte} onValueChange={(value) => handleInputChange('fonte', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontes.map((fonte) => (
                        <SelectItem key={fonte.value} value={fonte.value}>
                          <span style={{ fontFamily: fonte.value }}>{fonte.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Favicon */}
            <Card>
              <CardHeader>
                <CardTitle>Favicon do Sistema</CardTitle>
                <CardDescription>Ícone que aparece na aba do navegador (32x32px recomendado)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => faviconInputRef.current?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Selecionar Favicon</span>
                    </Button>
                    {config.faviconPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile('favicon')}
                      >
                        <X className="h-4 w-4" />
                        Remover
                      </Button>
                    )}
                  </div>
                  
                  {config.faviconPreview && (
                    <div className="w-8 h-8 border border-border rounded overflow-hidden">
                      <img 
                        src={config.faviconPreview} 
                        alt="Favicon preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('favicon', e.target.files[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Preview ao Vivo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border border-border rounded-lg p-4 space-y-4 transition-all duration-300"
                  style={{ 
                    backgroundColor: config.corFundo,
                    color: config.corTextos,
                    fontFamily: config.fonte
                  }}
                >
                  {/* Header simulado */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-600">
                    {config.logoPreview ? (
                      <img 
                        src={config.logoPreview} 
                        alt="Logo" 
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{config.nomeEmpresa}</h3>
                      <p className="text-xs opacity-70">Sistema de Holerites</p>
                    </div>
                  </div>
                  
                  {/* Botão simulado */}
                  <button
                    className="w-full py-2 px-4 rounded text-sm font-medium transition-all duration-200"
                    style={{ backgroundColor: config.corBotoes, color: '#ffffff' }}
                  >
                    Botão de Exemplo
                  </button>
                  
                  {/* Texto simulado */}
                  <div className="space-y-2">
                    <p className="text-sm">Exemplo de texto principal</p>
                    <p className="text-xs opacity-70">Texto secundário do sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="space-y-3">
              <Button 
                onClick={handleSave}
                className="w-full"
                style={{ backgroundColor: config.corBotoes }}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmReset(true)}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetar para Padrão
              </Button>
            </div>

            {/* Mensagens */}
            {showSuccess && (
              <Alert className="bg-green-900/50 border-green-700">
                <AlertDescription className="text-green-200">
                  Configurações atualizadas com sucesso!
                </AlertDescription>
              </Alert>
            )}

            {showConfirmReset && (
              <Alert className="bg-yellow-900/50 border-yellow-700">
                <AlertDescription className="text-yellow-200">
                  <p className="mb-3">Tem certeza que deseja restaurar os padrões?</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="destructive" onClick={handleReset}>
                      Sim, restaurar
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
    </div>
  )
}

export default CriadorPersonalizacao

