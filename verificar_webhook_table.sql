-- =====================================================
-- VERIFICAR TABELA WEBHOOK_CONFIG
-- =====================================================

-- 1. VERIFICAR SE A TABELA EXISTE
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhook_config') THEN
        RAISE NOTICE '✅ Tabela webhook_config existe!';
    ELSE
        RAISE NOTICE '❌ Tabela webhook_config NÃO existe!';
    END IF;
END $$;

-- 2. VERIFICAR ESTRUTURA DA TABELA
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'webhook_config'
ORDER BY ordinal_position;

-- 3. VERIFICAR DADOS EXISTENTES
SELECT * FROM webhook_config;

-- 4. VERIFICAR RLS
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'webhook_config';

-- 5. VERIFICAR POLÍTICAS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'webhook_config'; 