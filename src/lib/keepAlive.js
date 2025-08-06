// Script para manter o Supabase ativo
// Adicione este script no seu projeto

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Função para fazer ping no Supabase
export const keepSupabaseAlive = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/empresa_config?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase mantido ativo');
    }
  } catch (error) {
    console.log('⚠️ Erro ao manter Supabase ativo:', error.message);
  }
};

// Executar a cada 6 dias (antes dos 7 dias de pausa)
export const startKeepAlive = () => {
  // Executar imediatamente
  keepSupabaseAlive();
  
  // Executar a cada 6 dias
  setInterval(keepSupabaseAlive, 6 * 24 * 60 * 60 * 1000);
  
  // Executar quando a página carregar
  window.addEventListener('load', keepSupabaseAlive);
  
  // Executar quando a página voltar a ficar visível
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      keepSupabaseAlive();
    }
  });
}; 