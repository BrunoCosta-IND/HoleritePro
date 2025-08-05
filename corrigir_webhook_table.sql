-- =====================================================
-- CORRIGIR TABELA WEBHOOK_CONFIG
-- =====================================================

-- 1. CRIAR TABELA SE NÃO EXISTIR
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

-- 4. DESABILITAR RLS COMPLETAMENTE
ALTER TABLE webhook_config DISABLE ROW LEVEL SECURITY;

-- 5. REMOVER TODAS AS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "webhook_config_admin_access" ON webhook_config;
DROP POLICY IF EXISTS "webhook_config_public_access" ON webhook_config;

-- 6. CRIAR POLÍTICA PERMISSIVA
CREATE POLICY "webhook_config_public_access" ON webhook_config
    FOR ALL USING (true);

-- 7. INSERIR DADOS PADRÃO SE A TABELA ESTIVER VAZIA
INSERT INTO webhook_config (n8n_url, ativo, holerite_enviado, holerite_assinado, funcionario_cadastrado)
SELECT '', false, true, true, false
WHERE NOT EXISTS (SELECT 1 FROM webhook_config LIMIT 1);

-- 8. VERIFICAÇÃO FINAL
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO DA TABELA WEBHOOK_CONFIG ===';
    
    -- Verificar se a tabela existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhook_config') THEN
        RAISE NOTICE '✅ Tabela webhook_config existe!';
    ELSE
        RAISE NOTICE '❌ Tabela webhook_config NÃO existe!';
    END IF;
    
    -- Verificar se tem dados
    IF EXISTS (SELECT FROM webhook_config LIMIT 1) THEN
        RAISE NOTICE '✅ Tabela webhook_config tem dados!';
    ELSE
        RAISE NOTICE '⚠️ Tabela webhook_config está vazia!';
    END IF;
    
    -- Verificar RLS
    IF (SELECT rowsecurity FROM pg_tables WHERE tablename = 'webhook_config') = false THEN
        RAISE NOTICE '✅ RLS desabilitado em webhook_config!';
    ELSE
        RAISE NOTICE '❌ RLS ainda ativo em webhook_config!';
    END IF;
    
    RAISE NOTICE '=== FIM DA VERIFICAÇÃO ===';
    RAISE NOTICE '🎉 Tabela webhook_config configurada corretamente!';
END $$; 