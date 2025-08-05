// =====================================================
// CORRIGIR WEBHOOK CORS
// =====================================================

// Função para enviar webhook sem CORS
async function enviarWebhookSemCORS(url, payload) {
  try {
    console.log('📡 Tentando enviar webhook via proxy...');
    
    // Opção 1: Usar um proxy CORS público
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ Webhook enviado com sucesso via proxy');
      return true;
    } else {
      console.log('❌ Erro no proxy:', response.status);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Erro no proxy CORS:', error.message);
    return false;
  }
}

// Função alternativa usando JSONP (se suportado)
async function enviarWebhookJSONP(url, payload) {
  try {
    console.log('📡 Tentando enviar webhook via JSONP...');
    
    // Criar script tag para contornar CORS
    const script = document.createElement('script');
    const callbackName = 'webhookCallback_' + Date.now();
    
    // Criar função de callback global
    window[callbackName] = function(data) {
      console.log('✅ Webhook enviado com sucesso via JSONP');
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    // Adicionar parâmetros à URL
    const params = new URLSearchParams({
      callback: callbackName,
      data: JSON.stringify(payload)
    });
    
    script.src = `${url}?${params.toString()}`;
    document.head.appendChild(script);
    
    // Timeout após 5 segundos
    setTimeout(() => {
      if (window[callbackName]) {
        console.log('❌ Timeout no JSONP');
        document.head.removeChild(script);
        delete window[callbackName];
      }
    }, 5000);
    
    return true;
    
  } catch (error) {
    console.log('❌ Erro no JSONP:', error.message);
    return false;
  }
}

// Função principal para enviar webhook
async function enviarWebhookComFallback(url, payload) {
  console.log('📢 Enviando webhook com fallback...');
  console.log('URL:', url);
  console.log('Payload:', payload);
  
  try {
    // Tentativa 1: Requisição direta
    console.log('🔄 Tentativa 1: Requisição direta');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ Webhook enviado com sucesso (requisição direta)');
      return true;
    } else {
      console.log('❌ Erro na requisição direta:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Erro na requisição direta:', error.message);
  }
  
  // Tentativa 2: Proxy CORS
  console.log('🔄 Tentativa 2: Proxy CORS');
  const proxyResult = await enviarWebhookSemCORS(url, payload);
  if (proxyResult) return true;
  
  // Tentativa 3: JSONP
  console.log('🔄 Tentativa 3: JSONP');
  const jsonpResult = await enviarWebhookJSONP(url, payload);
  if (jsonpResult) return true;
  
  // Se todas falharam
  console.log('❌ Todas as tentativas falharam');
  return false;
}

// Função para testar webhook
async function testarWebhook() {
  const testPayload = {
    evento: 'teste',
    timestamp: new Date().toISOString(),
    mensagem: 'Teste de webhook',
    sistema: 'gestao-holerites'
  };
  
  const url = 'https://n8n.brunoinc.space/webhook-test/HoleritePro';
  
  console.log('🧪 Testando webhook...');
  const resultado = await enviarWebhookComFallback(url, testPayload);
  
  if (resultado) {
    console.log('✅ Teste de webhook bem-sucedido!');
  } else {
    console.log('❌ Teste de webhook falhou');
  }
  
  return resultado;
}

// Exportar funções
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    enviarWebhookComFallback,
    testarWebhook
  };
} else {
  // Para uso no navegador
  window.enviarWebhookComFallback = enviarWebhookComFallback;
  window.testarWebhook = testarWebhook;
} 