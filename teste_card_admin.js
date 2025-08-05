// Teste para verificar se o card de admin está sendo renderizado
console.log('🧪 TESTE - CARD ADMIN')

// Verificar se o componente está carregado
const checkAdminCard = () => {
  // Verificar se há cards no dashboard
  const cards = document.querySelectorAll('[class*="card"]')
  console.log('📊 Total de cards encontrados:', cards.length)
  
  // Verificar se há algum card com "Administrador" no texto
  const adminCards = Array.from(cards).filter(card => 
    card.textContent.toLowerCase().includes('administrador')
  )
  console.log('🛡️ Cards de admin encontrados:', adminCards.length)
  
  // Verificar se há ícones de Shield
  const shieldIcons = document.querySelectorAll('[class*="shield"]')
  console.log('🛡️ Ícones Shield encontrados:', shieldIcons.length)
  
  // Verificar grid container
  const gridContainer = document.querySelector('[class*="grid"]')
  console.log('📐 Container de grid encontrado:', !!gridContainer)
  
  return {
    totalCards: cards.length,
    adminCards: adminCards.length,
    shieldIcons: shieldIcons.length,
    hasGrid: !!gridContainer
  }
}

// Executar teste
const result = checkAdminCard()
console.log('📋 Resultado do teste:', result)

// Verificar se está logado como admin
const usuarioLogado = localStorage.getItem('usuarioLogado')
if (usuarioLogado) {
  const dados = JSON.parse(usuarioLogado)
  console.log('👤 Usuário logado:', dados.tipo)
  
  if (dados.tipo === 'admin') {
    console.log('✅ Acesso permitido para admin')
  } else {
    console.log('❌ Acesso negado - não é admin')
  }
} else {
  console.log('❌ Nenhum usuário logado')
}

console.log('🎯 Para forçar a renderização:')
console.log('1. Pressione Ctrl + F5 para recarregar')
console.log('2. Verifique se está logado como admin')
console.log('3. Role a página para baixo')
console.log('4. Verifique se há 3 cards na segunda linha') 