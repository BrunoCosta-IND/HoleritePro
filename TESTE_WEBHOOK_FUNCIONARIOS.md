# 🔧 TESTE WEBHOOK PARA FUNCIONÁRIOS CADASTRADOS

## ✅ IMPLEMENTAÇÃO CONCLUÍDA

### **🔧 Função Adicionada:**
- ✅ `enviarWebhookFuncionarioCadastrado()` - Envia webhook quando funcionário é cadastrado
- ✅ Verificação de configurações do webhook
- ✅ Verificação se evento está habilitado
- ✅ Payload com nome e telefone do funcionário
- ✅ Logs detalhados para debug

### **🔧 Modificação no Cadastro:**
- ✅ Webhook é enviado automaticamente após cadastro bem-sucedido
- ✅ Payload inclui: nome, telefone, CPF, cargo, email
- ✅ Logs de sucesso/erro no console

## 🧪 TESTE PASSO A PASSO

### **PASSO 1: Verificar Configurações**
1. Execute o SQL `verificar_webhook_funcionario.sql` no Supabase
2. Verifique se o webhook está ativo e se "Funcionário cadastrado" está habilitado
3. Anote a URL do webhook

### **PASSO 2: Configurar Webhook (se necessário)**
Se o webhook não estiver configurado:
1. Vá para: `http://localhost:5173/admin/configuracoes`
2. Configure a URL do webhook n8n
3. **Ative o webhook** (checkbox "Ativar webhook")
4. **Habilite "Funcionário cadastrado"** (checkbox)
5. Clique em **Salvar Configurações**

### **PASSO 3: Testar Cadastro de Funcionário**
1. Abra: `http://localhost:5173/admin/cadastro-funcionarios`
2. Abra DevTools (F12) → Console
3. Preencha os dados de um funcionário:
   - Nome: "João Silva"
   - CPF: "123.456.789-00"
   - WhatsApp: "(11) 99999-9999"
   - Cargo: "Desenvolvedor"
   - Email: "joao@teste.com"
4. Clique em **Cadastrar Funcionário**
5. Verifique os logs no console

### **PASSO 4: Verificar Logs Esperados**

**Logs de Cadastro:**
```
Funcionário cadastrado com sucesso: [{id: X, nome: "João Silva", ...}]
Verificando configurações do webhook...
Enviando webhook para funcionário cadastrado...
Payload do webhook: {
  evento: "funcionario_cadastrado",
  timestamp: "2024-...",
  funcionario: {
    nome: "João Silva",
    telefone: "(11) 99999-9999",
    cpf: "12345678900",
    cargo: "Desenvolvedor",
    email: "joao@teste.com"
  },
  sistema: "gestao-holerites"
}
✅ Webhook enviado com sucesso para funcionário cadastrado
```

## 🔍 VERIFICAR RESULTADO

### **✅ O que deve acontecer:**
- ✅ Funcionário cadastrado com sucesso
- ✅ Webhook enviado para n8n
- ✅ Payload contém nome e telefone
- ✅ Logs de sucesso no console

### **❌ Se não funcionar:**
1. **Verifique os logs** no console
2. **Execute o SQL** `verificar_webhook_funcionario.sql`
3. **Verifique se o webhook está ativo** nas configurações
4. **Teste a URL** do webhook no n8n

## 🚨 TROUBLESHOOTING

### **Problema 1: "Webhook inativo"**
**Solução:** Ative o webhook nas configurações

### **Problema 2: "Evento de funcionário cadastrado desabilitado"**
**Solução:** Habilite o checkbox "Funcionário cadastrado" nas configurações

### **Problema 3: "URL do webhook não configurada"**
**Solução:** Configure a URL do webhook n8n nas configurações

### **Problema 4: "Erro ao enviar webhook"**
**Solução:** 
1. Verifique se a URL do n8n está correta
2. Teste a URL no n8n
3. Verifique se o n8n está rodando

## 🎉 RESULTADO ESPERADO

Após o cadastro de funcionário:
- ✅ Funcionário salvo no banco
- ✅ Webhook enviado para n8n
- ✅ Payload com dados completos
- ✅ Logs de sucesso no console
- ✅ Notificação no n8n

**Execute o teste e me informe o resultado!** 🔧 