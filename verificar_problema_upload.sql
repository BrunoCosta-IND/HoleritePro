-- =====================================================
-- VERIFICAR PROBLEMA NO UPLOAD DE HOLERITES
-- =====================================================

-- 1. VERIFICAR ESTRUTURA DA TABELA
SELECT 
    'ESTRUTURA DA TABELA:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerite' 
ORDER BY ordinal_position;

-- 2. VERIFICAR SE HÁ CONSTRAINTS PROBLEMÁTICOS
SELECT 
    'CONSTRAINTS:' as info,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'holerite';

-- 3. VERIFICAR SE HÁ DADOS RECENTES
SELECT 
    'DADOS RECENTES:' as info,
    id,
    cpf,
    mes,
    ano,
    file_name,
    status,
    created_at
FROM holerite 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. VERIFICAR RLS
SELECT 
    'RLS STATUS:' as info,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'holerite';

-- 5. VERIFICAR POLÍTICAS RLS
SELECT 
    'POLÍTICAS RLS:' as info,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'holerite';

-- 6. TESTAR INSERÇÃO COM DADOS REAIS
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    RAISE NOTICE 'Testando inserção com dados reais...';
    
    -- Testar com dados similares aos do upload
    INSERT INTO holerite (cpf, mes, ano, file_name, file_url, status)
    VALUES ('04527705210', 1, 2024, '04527705210.pdf', 'https://teste.com/arquivo.pdf', 'pendente')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Inserção com dados reais bem-sucedida! ID: %', test_id;
    
    -- Verificar se foi inserido
    IF EXISTS (SELECT 1 FROM holerite WHERE id = test_id) THEN
        RAISE NOTICE '✅ Registro encontrado no banco!';
    ELSE
        RAISE NOTICE '❌ Registro NÃO encontrado no banco!';
    END IF;
    
    -- Limpar o teste
    DELETE FROM holerite WHERE id = test_id;
    RAISE NOTICE '✅ Registro de teste removido';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erro na inserção com dados reais: %', SQLERRM;
END $$;

-- 7. VERIFICAR SE HÁ PROBLEMAS DE PERMISSÃO
SELECT 
    'PERMISSÕES:' as info,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'holerite'; 