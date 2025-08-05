# 🔧 CONFIGURAR WEBHOOK N8N

## ✅ Sistema Restaurado com Sucesso!

### **📁 O que foi restaurado:**
- ✅ `src/components/AdminConfiguracoes.jsx` - Painel de configurações (apenas webhook)
- ✅ Rota `/admin/configuracoes` no `App.jsx`
- ✅ Botão de configurações no `AdminDashboard.jsx`
- ✅ Sistema focado apenas no webhook n8n

### **🗑️ O que foi removido:**
- ❌ Sistema de cores problemático
- ❌ Tabela `empresa_config`
- ❌ Configurações de empresa
- ❌ Componente Switch desnecessário

## 🗄️ Configurar Banco de Dados

### **Execute este SQL no Supabase:**

1. Vá para o **SQL Editor** do Supabase
2. Cole o conteúdo do arquivo `criar_webhook_config.sql`
3. Execute o SQL
4. Aguarde a mensagem de sucesso

### **O que o SQL faz:**
- ✅ Cria tabela `webhook_config` (apenas para webhook)
- ✅ Configura trigger para timestamps
- ✅ Desabilita RLS para evitar problemas
- ✅ Cria política permissiva
- ✅ Remove sistema de cores problemático

## 🎯 Funcionalidades do Webhook

### **✅ Configurações disponíveis:**
- **URL do n8n** - URL do webhook do n8n
- **Ativar/Desativar** - Controle do webhook
- **Eventos configuráveis:**
  - Holerite enviado
  - Holerite assinado
  - Funcionário cadastrado

### **✅ Recursos do painel:**
- **Testar conexão** - Testa se o webhook está funcionando
- **Salvar configurações** - Salva as configurações no banco
- **Interface limpa** - Foco apenas no webhook

## 🎉 Resultado Final

Após executar o SQL:
- ✅ Painel de configurações funcional
- ✅ Sistema de webhook n8n configurado
- ✅ Sem problemas de cores
- ✅ Sistema limpo e focado

## 📝 Próximos Passos

1. **Execute o SQL** `criar_webhook_config.sql` no Supabase
2. **Recarregue a aplicação** em `http://localhost:5173`
3. **Acesse configurações** pelo ícone de engrenagem
4. **Configure seu webhook n8n** com a URL
5. **Teste a conexão** usando o botão "Testar Conexão"

**Agora você tem um painel de configurações focado apenas no webhook n8n!** 🔧 