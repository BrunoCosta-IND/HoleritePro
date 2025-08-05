# Executar SQL do Webhook no Supabase

## Passos para executar o SQL:

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione seu projeto

### 2. Execute o SQL Corrigido
- No painel do Supabase, vá para "SQL Editor"
- Clique em "New Query"
- Cole o seguinte SQL (CORRIGIDO):

```sql
-- Tabela para configurações de webhook
CREATE TABLE IF NOT EXISTS webhook_config (
    id SERIAL PRIMARY KEY,
    n8n_url TEXT,
    ativo BOOLEAN DEFAULT false,
    holerite_enviado BOOLEAN DEFAULT true,
    holerite_assinado BOOLEAN DEFAULT true,
    funcionario_cadastrado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão (se não existir)
INSERT INTO webhook_config (n8n_url, ativo, holerite_enviado, holerite_assinado, funcionario_cadastrado)
VALUES ('', false, true, true, false)
ON CONFLICT DO NOTHING;

-- Função para atualizar o timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger se existir e criar novamente
DROP TRIGGER IF EXISTS update_webhook_config_updated_at ON webhook_config;
CREATE TRIGGER update_webhook_config_updated_at 
    BEFORE UPDATE ON webhook_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Política RLS para webhook_config
ALTER TABLE webhook_config ENABLE ROW LEVEL SECURITY;

-- Remover política se existir e criar novamente
DROP POLICY IF EXISTS "webhook_config_admin_access" ON webhook_config;
CREATE POLICY "webhook_config_admin_access" ON webhook_config
    FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Execute o Query
- Clique em "Run" para executar o SQL
- Agora não deve haver erros de trigger já existente

### 4. Verifique a Tabela
- Vá para "Table Editor"
- Verifique se a tabela `webhook_config` foi criada
- Deve haver um registro padrão inserido

## ✅ Problema Resolvido!

O erro `ERROR: 42710: trigger "update_webhook_config_updated_at" for relation "webhook_config" already exists` foi resolvido com:

- `DROP TRIGGER IF EXISTS` - Remove o trigger se já existir
- `DROP POLICY IF EXISTS` - Remove a política se já existir
- `CREATE OR REPLACE FUNCTION` - Recria a função se necessário

## Teste o Sistema

Após executar o SQL corrigido:

1. **Inicie o servidor**: `npm run dev`
2. **Acesse**: http://localhost:5173
3. **Faça login como admin**
4. **Clique no ícone de engrenagem** no dashboard
5. **Configure o webhook n8n**

## Funcionalidades Disponíveis

✅ **Configurações da Empresa**
- Nome da empresa
- Cor dos botões
- URL do logo

✅ **Integração n8n Webhook**
- URL do webhook
- Ativação/desativação
- Eventos específicos
- Teste de conexão

✅ **Configurações do Sistema**
- Limite de funcionários
- Notificações por e-mail
- Notificações por WhatsApp

✅ **Informações de Segurança**
- Status do sistema
- Versão
- Última atualização 