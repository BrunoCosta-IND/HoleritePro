-- =====================================================
-- REMOVER SISTEMA DE CONFIGURAÇÕES COMPLETAMENTE
-- =====================================================

-- 1. REMOVER TRIGGERS
DROP TRIGGER IF EXISTS update_empresa_config_updated_at ON empresa_config;
DROP TRIGGER IF EXISTS update_webhook_config_updated_at ON webhook_config;

-- 2. REMOVER FUNÇÃO DE TIMESTAMP
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 3. REMOVER POLÍTICAS
DROP POLICY IF EXISTS "empresa_config_admin_access" ON empresa_config;
DROP POLICY IF EXISTS "webhook_config_admin_access" ON empresa_config;
DROP POLICY IF EXISTS "empresa_config_public_access" ON empresa_config;
DROP POLICY IF EXISTS "webhook_config_public_access" ON webhook_config;

-- 4. REMOVER TABELAS
DROP TABLE IF EXISTS empresa_config CASCADE;
DROP TABLE IF EXISTS webhook_config CASCADE;

-- 5. MENSAGEM DE CONFIRMAÇÃO
DO $$
BEGIN
    RAISE NOTICE '🗑️ SISTEMA DE CONFIGURAÇÕES REMOVIDO!';
    RAISE NOTICE '✅ Tabelas empresa_config e webhook_config removidas';
    RAISE NOTICE '✅ Triggers e políticas removidos';
    RAISE NOTICE '✅ Função update_updated_at_column removida';
    RAISE NOTICE '✅ Sistema limpo e pronto para uso!';
END $$; 