import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Download, Smartphone, Info } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

const PWAInstallBanner = () => {
  const { isInstallable, installApp } = usePWA()
  const [isVisible, setIsVisible] = useState(true)
  const [showDebug, setShowDebug] = useState(false)

  // Verificar se o banner foi fechado anteriormente
  useEffect(() => {
    const bannerClosed = localStorage.getItem('pwa-banner-closed')
    if (bannerClosed) {
      setIsVisible(false)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('pwa-banner-closed', 'true')
  }

  const handleInstall = async () => {
    try {
      await installApp()
      handleClose()
    } catch (error) {
      console.error('Erro ao instalar:', error)
    }
  }

  // Debug: mostrar informações do PWA
  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  if (!isInstallable || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Instalar App
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Instale o Portal de Holerites no seu celular para acesso rápido
              </p>
              
              {showDebug && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  <p><strong>Debug PWA:</strong></p>
                  <p>Installable: {isInstallable ? 'Sim' : 'Não'}</p>
                  <p>User Agent: {navigator.userAgent}</p>
                  <p>Standalone: {window.matchMedia('(display-mode: standalone)').matches ? 'Sim' : 'Não'}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDebug}
                className="flex-shrink-0 h-6 w-6"
                title="Debug"
              >
                <Info className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="flex-shrink-0 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="flex-1"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAInstallBanner 