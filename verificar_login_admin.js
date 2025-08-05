// Script para verificar o estado do login e permissões
console.log('🔍 VERIFICANDO LOGIN E PERMISSÕES')

// Verificar localStorage
const verificarLogin = () => {
  console.log('📋 === VERIFICAÇÃO DE LOGIN ===')
  
  // Verificar se há dados no localStorage
  const usuarioLogado = localStorage.getItem('usuarioLogado')
  console.log('📦 Dados do localStorage:', usuarioLogado)
  
  if (!usuarioLogado) {
    console.log('❌ NENHUM USUÁRIO LOGADO')
    console.log('💡 Solução: Faça login como administrador')
    return false
  }
  
  try {
    const dados = JSON.parse(usuarioLogado)
    console.log('👤 Dados do usuário:', dados)
    
    if (!dados) {
      console.log('❌ DADOS INVÁLIDOS')
      return false
    }
    
    if (!dados.tipo) {
      console.log('❌ TIPO DE USUÁRIO NÃO DEFINIDO')
      return false
    }
    
    if (dados.tipo !== 'admin') {
      console.log('❌ USUÁRIO NÃO É ADMIN:', dados.tipo)
      console.log('💡 Solução: Faça login com uma conta de administrador')
      return false
    }
    
    console.log('✅ USUÁRIO É ADMIN - ACESSO PERMITIDO')
    return true
  } catch (error) {
    console.error('❌ ERRO AO PARSEAR DADOS:', error)
    return false
  }
}

// Verificar URL atual
const verificarURL = () => {
  console.log('🌐 === VERIFICAÇÃO DE URL ===')
  const url = window.location.href
  console.log('📍 URL atual:', url)
  
  if (url.includes('/admin/admins/cadastrar')) {
    console.log('✅ URL correta para cadastro de admin')
  } else {
    console.log('⚠️ URL não é para cadastro de admin')
  }
}

// Verificar se o componente está carregado
const verificarComponente = () => {
  console.log('🧩 === VERIFICAÇÃO DE COMPONENTE ===')
  
  // Verificar se há elementos do formulário
  const formulario = document.querySelector('form')
  const inputs = document.querySelectorAll('input')
  const botoes = document.querySelectorAll('button')
  
  console.log('📝 Formulário encontrado:', !!formulario)
  console.log('⌨️ Inputs encontrados:', inputs.length)
  console.log('🔘 Botões encontrados:', botoes.length)
  
  // Verificar se há elementos específicos do admin
  const adminElements = document.querySelectorAll('[class*="admin"], [class*="Admin"]')
  console.log('🛡️ Elementos de admin encontrados:', adminElements.length)
}

// Executar verificações
console.log('🚀 === INICIANDO VERIFICAÇÕES ===')

const loginOk = verificarLogin()
verificarURL()
verificarComponente()

// Resultado final
console.log('📊 === RESULTADO FINAL ===')
if (loginOk) {
  console.log('✅ LOGIN OK - O problema pode ser:')
  console.log('  1. Componente não carregou')
  console.log('  2. Erro de JavaScript')
  console.log('  3. Problema de roteamento')
} else {
  console.log('❌ LOGIN PROBLEMÁTICO - Soluções:')
  console.log('  1. Faça login como administrador')
  console.log('  2. Verifique se a conta é admin')
  console.log('  3. Limpe o localStorage e faça login novamente')
}

// Comandos úteis
console.log('🛠️ === COMANDOS ÚTEIS ===')
console.log('Para limpar localStorage: localStorage.clear()')
console.log('Para ver dados: localStorage.getItem("usuarioLogado")')
console.log('Para recarregar: window.location.reload()') 