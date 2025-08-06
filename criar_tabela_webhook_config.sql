-- Criar tabela webhook_config para configurações do webhook n8n
-- Execute este SQL no seu banco Supabase

-- Criar tabela webhook_config se não existir
CREATE TABLE IF NOT EXISTS webhook_config (
  id SERIAL PRIMARY KEY,
  n8n_url TEXT,
  ativo BOOLEAN DEFAULT true,
  holerite_enviado BOOLEAN DEFAULT true,
  holerite_assinado BOOLEAN DEFAULT true,
  funcionario_cadastrado BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão se não existir
INSERT INTO webhook_config (n8n_url, ativo, holerite_enviado, holerite_assinado, funcionario_cadastrado)
SELECT 
  'https://seu-webhook-n8n.com/webhook/holerites',
  true,
  true,
  true,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM webhook_config LIMIT 1
);

-- Verificar se a tabela foi criada
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'webhook_config' 
ORDER BY ordinal_position;

-- Verificar dados inseridos
SELECT * FROM webhook_config; 