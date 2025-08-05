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

-- Inserir configuração padrão
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

-- Trigger para atualizar updated_at
CREATE TRIGGER update_webhook_config_updated_at 
    BEFORE UPDATE ON webhook_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Política RLS para webhook_config
ALTER TABLE webhook_config ENABLE ROW LEVEL SECURITY;

-- Permitir acesso apenas para administradores
CREATE POLICY "webhook_config_admin_access" ON webhook_config
    FOR ALL USING (auth.role() = 'authenticated'); 