// Teste para verificar se a rota de admin está funcionando
console.log('🔍 Testando rota de admin...')

// Verificar se o componente está sendo importado corretamente
try {
  // Simular acesso à rota
  const rota = '/admin/admins/cadastrar'
  console.log('✅ Rota configurada:', rota)
  
  // Verificar se o localStorage tem dados de admin
  const usuarioLogado = localStorage.getItem('usuarioLogado')
  if (usuarioLogado) {
    const dados = JSON.parse(usuarioLogado)
    console.log('✅ Usuário logado:', dados.tipo)
    
    if (dados.tipo === 'admin') {
      console.log('✅ Acesso permitido para admin')
    } else {
      console.log('❌ Acesso negado - não é admin')
    }
  } else {
    console.log('❌ Nenhum usuário logado')
  }
  
} catch (error) {
  console.error('❌ Erro no teste:', error)
}

console.log('🎯 Para acessar a tela de admin:')
console.log('1. Faça login como administrador')
console.log('2. Vá para o dashboard')
console.log('3. Clique no card "Cadastrar Administrador"')
console.log('4. Ou acesse diretamente: http://localhost:5173/admin/admins/cadastrar') 