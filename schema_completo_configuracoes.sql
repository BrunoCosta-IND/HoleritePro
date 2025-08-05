-- =====================================================
-- SCHEMA COMPLETO PARA CONFIGURAÇÕES DO SISTEMA
-- =====================================================

-- 1. TABELA DE CONFIGURAÇÕES DA EMPRESA
CREATE TABLE IF NOT EXISTS empresa_config (
    id SERIAL PRIMARY KEY,
    nome TEXT DEFAULT 'Sistema de Gestão de Holerites',
    cor_botoes TEXT DEFAULT '#ff6b35',
    logo_url TEXT,
    limite_funcionarios INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão da empresa
INSERT INTO empresa_config (nome, cor_botoes, logo_url, limite_funcionarios)
VALUES ('Sistema de Gestão de Holerites', '#ff6b35', '', 50)
ON CONFLICT DO NOTHING;

-- 2. TABELA DE CONFIGURAÇÕES DE WEBHOOK
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

-- Inserir configuração padrão do webhook
INSERT INTO webhook_config (n8n_url, ativo, holerite_enviado, holerite_assinado, funcionario_cadastrado)
VALUES ('', false, true, true, false)
ON CONFLICT DO NOTHING;

-- 3. FUNÇÃO PARA ATUALIZAR TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. TRIGGERS PARA ATUALIZAR TIMESTAMP
DROP TRIGGER IF EXISTS update_empresa_config_updated_at ON empresa_config;
CREATE TRIGGER update_empresa_config_updated_at 
    BEFORE UPDATE ON empresa_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webhook_config_updated_at ON webhook_config;
CREATE TRIGGER update_webhook_config_updated_at 
    BEFORE UPDATE ON webhook_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. HABILITAR ROW LEVEL SECURITY
ALTER TABLE empresa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_config ENABLE ROW LEVEL SECURITY;

-- 6. POLÍTICAS DE SEGURANÇA
DROP POLICY IF EXISTS "empresa_config_admin_access" ON empresa_config;
CREATE POLICY "empresa_config_admin_access" ON empresa_config
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "webhook_config_admin_access" ON webhook_config;
CREATE POLICY "webhook_config_admin_access" ON webhook_config
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. VERIFICAR SE AS TABELAS EXISTEM
DO $$
BEGIN
    -- Verificar se a tabela empresa_config existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'empresa_config') THEN
        RAISE NOTICE 'Tabela empresa_config não existe!';
    ELSE
        RAISE NOTICE 'Tabela empresa_config criada com sucesso!';
    END IF;
    
    -- Verificar se a tabela webhook_config existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhook_config') THEN
        RAISE NOTICE 'Tabela webhook_config não existe!';
    ELSE
        RAISE NOTICE 'Tabela webhook_config criada com sucesso!';
    END IF;
END $$; 