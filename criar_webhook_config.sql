-- =====================================================
-- CRIAR TABELA DE WEBHOOK CONFIG
-- =====================================================

-- 1. CRIAR TABELA WEBHOOK_CONFIG
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

-- 2. CRIAR FUNÇÃO DE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. CRIAR TRIGGER
DROP TRIGGER IF EXISTS update_webhook_config_updated_at ON webhook_config;
CREATE TRIGGER update_webhook_config_updated_at 
    BEFORE UPDATE ON webhook_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. DESABILITAR RLS
ALTER TABLE webhook_config DISABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICA PERMISSIVA
DROP POLICY IF EXISTS "webhook_config_public_access" ON webhook_config;
CREATE POLICY "webhook_config_public_access" ON webhook_config
    FOR ALL USING (true);

-- 6. MENSAGEM DE SUCESSO
DO $$
BEGIN
    RAISE NOTICE '🎉 TABELA WEBHOOK_CONFIG CRIADA!';
    RAISE NOTICE '✅ Tabela webhook_config criada com sucesso';
    RAISE NOTICE '✅ Trigger configurado';
    RAISE NOTICE '✅ RLS desabilitado';
    RAISE NOTICE '✅ Política permissiva criada';
    RAISE NOTICE '✅ Pronto para configurar webhook n8n!';
END $$; 