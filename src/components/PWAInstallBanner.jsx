import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Download, Smartphone } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

const PWAInstallBanner = () => {
  const { isInstallable, installApp } = usePWA()
  const [isVisible, setIsVisible] = useState(true)

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
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Button
              size="sm"
              onClick={installApp}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
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