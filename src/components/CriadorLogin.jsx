import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Settings } from 'lucide-react'

const CriadorLogin = ({ theme, toggleTheme, setIsAuthenticated, setUserType }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    perguntaSeguranca: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simular validação (em produção seria uma API)
    setTimeout(() => {
      if (formData.perguntaSeguranca.toLowerCase().trim() !== 'chocolate') {
        setError('A pergunta de segurança está incorreta.')
        setIsLoading(false)
        return
      }

      if (!formData.email || !formData.senha) {
        setError('Login inválido. Verifique os dados.')
        setIsLoading(false)
        return
      }

      // Login bem-sucedido
      setIsAuthenticated(true)
      setUserType('criador')
      navigate('/criador-dashboard')
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <div className="w-full h-screen flex rounded-3xl shadow-2xl bg-black overflow-hidden relative">
        {/* Lado esquerdo: Formulário */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-16 py-20 h-full">
          <h1 className="text-4xl font-bold text-white mb-8">
            Painel do Criador
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">.</span>
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-1">E-mail</Label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-10/12 mx-auto px-4 py-2 rounded-lg bg-black text-white border-2 border-transparent focus:border-[3px] focus:border-purple-500 focus:ring-0 focus:outline-none shadow-[0_0_8px_0_rgba(168,85,247,0.5)] transition-all duration-200"
                style={{ boxShadow: '0 0 8px 0 rgba(168,85,247,0.5), 0 0 0 2px transparent' }}
              />
            </div>
            <div>
              <Label htmlFor="senha" className="text-gray-300 mb-1">Senha</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-slate-200 p-0"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                  className="w-10/12 mx-auto px-4 py-2 pl-10 rounded-lg bg-black text-white border-2 border-transparent focus:border-[3px] focus:border-purple-500 focus:ring-0 focus:outline-none shadow-[0_0_8px_0_rgba(168,85,247,0.5)] transition-all duration-200"
                  style={{ boxShadow: '0 0 8px 0 rgba(168,85,247,0.5), 0 0 0 2px transparent' }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="perguntaSeguranca" className="text-gray-300 mb-1">Qual o nome do seu cachorro?</Label>
              <input
                id="perguntaSeguranca"
                name="perguntaSeguranca"
                type="text"
                placeholder="Digite a resposta"
                value={formData.perguntaSeguranca}
                onChange={handleInputChange}
                required
                className="w-10/12 mx-auto px-4 py-2 rounded-lg bg-black text-white border-2 border-transparent focus:border-[3px] focus:border-purple-500 focus:ring-0 focus:outline-none shadow-[0_0_8px_0_rgba(168,85,247,0.5)] transition-all duration-200"
                style={{ boxShadow: '0 0 8px 0 rgba(168,85,247,0.5), 0 0 0 2px transparent' }}
              />
            </div>
            <Button
              type="button"
              className="w-10/12 mx-auto py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
              onClick={() => setFormData({ email: 'criador@empresa.com', senha: '123456', perguntaSeguranca: 'chocolate' })}
            >
              Preencher dados de teste
            </Button>
            {error && (
              <Alert className="bg-red-900/50 border-red-700 animate-shake">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-10/12 mx-auto py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition mt-2"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                <span>Entrar</span>
              )}
            </Button>
          </form>
        </div>
        {/* Lado direito: Imagem com fade */}
        <div className="hidden md:block w-1/2 h-full relative">
          <img
            src="https://cdn.eso.org/images/thumb700x/potw2348a.jpg"
            alt="Paisagem noturna"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/0 pointer-events-none" />
        </div>
        {/* Engrenagem flutuante para login do admin */}
        <div
          onClick={() => navigate('/')}
          className="absolute bottom-6 right-6 z-50 cursor-pointer group"
          aria-label="Acessar login do administrador"
          tabIndex={0}
          role="button"
        >
          <Settings className="h-8 w-8 text-white drop-shadow-lg opacity-80 transition-transform duration-300 group-hover:rotate-180 group-focus:rotate-180" />
        </div>
      </div>
    </div>
  )
}

export default CriadorLogin

