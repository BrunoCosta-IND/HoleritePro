-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA HOLERITE
-- =====================================================

-- 1. VERIFICAR SE A TABELA EXISTE
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'holerite') THEN
        RAISE NOTICE '✅ Tabela holerite existe!';
    ELSE
        RAISE NOTICE '❌ Tabela holerite NÃO existe!';
    END IF;
END $$;

-- 2. VERIFICAR ESTRUTURA DA TABELA
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'holerite' 
ORDER BY ordinal_position;

-- 3. VERIFICAR CONSTRAINTS
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'holerite';

-- 4. VERIFICAR SE HÁ DADOS
SELECT COUNT(*) as total_registros FROM holerite;

-- 5. VERIFICAR ÚLTIMOS REGISTROS
SELECT 
    id,
    cpf,
    mes,
    ano,
    file_name,
    file_url,
    status,
    created_at,
    updated_at
FROM holerite 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. VERIFICAR SE HÁ PROBLEMAS DE RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'holerite';

-- 7. VERIFICAR POLÍTICAS RLS
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
WHERE tablename = 'holerite';

-- 8. TESTAR INSERÇÃO SIMPLES
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    INSERT INTO holerite (cpf, mes, ano, file_name, file_url, status)
    VALUES ('TESTE123', 1, 2024, 'teste.pdf', 'https://teste.com', 'pendente')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Inserção de teste bem-sucedida! ID: %', test_id;
    
    -- Limpar o teste
    DELETE FROM holerite WHERE id = test_id;
    RAISE NOTICE '✅ Registro de teste removido';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erro na inserção de teste: %', SQLERRM;
END $$; 