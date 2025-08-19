import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Cache busting para forçar atualização
const APP_VERSION = '1.0.1'

console.log(`🚀 Aplicação iniciada - Versão: ${APP_VERSION}`)

// Verificar se há nova versão disponível
const checkForUpdates = () => {
  const currentVersion = localStorage.getItem('app_version')
  
  // Verificar mudança de versão
  if (currentVersion !== APP_VERSION) {
    localStorage.setItem('app_version', APP_VERSION)
    // Forçar reload se versão mudou
    if (currentVersion && currentVersion !== APP_VERSION) {
      window.location.reload()
    }
  }
}

checkForUpdates()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
