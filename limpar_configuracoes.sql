-- =====================================================
-- LIMPAR CONFIGURAÇÕES EXISTENTES
-- =====================================================

-- Limpar dados existentes das tabelas de configuração
DELETE FROM empresa_config;
DELETE FROM webhook_config;

-- Resetar os IDs das sequências
ALTER SEQUENCE empresa_config_id_seq RESTART WITH 1;
ALTER SEQUENCE webhook_config_id_seq RESTART WITH 1;

-- Verificar se as tabelas estão vazias
DO $$
BEGIN
    RAISE NOTICE '=== LIMPEZA CONCLUÍDA ===';
    
    -- Verificar empresa_config
    IF NOT EXISTS (SELECT FROM empresa_config LIMIT 1) THEN
        RAISE NOTICE '✅ Tabela empresa_config limpa com sucesso!';
    ELSE
        RAISE NOTICE '❌ Erro ao limpar empresa_config!';
    END IF;
    
    -- Verificar webhook_config
    IF NOT EXISTS (SELECT FROM webhook_config LIMIT 1) THEN
        RAISE NOTICE '✅ Tabela webhook_config limpa com sucesso!';
    ELSE
        RAISE NOTICE '❌ Erro ao limpar webhook_config!';
    END IF;
    
    RAISE NOTICE '=== FIM DA LIMPEZA ===';
END $$; 