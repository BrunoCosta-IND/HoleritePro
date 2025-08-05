-- =====================================================
-- TESTAR INSERÇÃO NA TABELA HOLERITE
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

-- 2. VERIFICAR ESTRUTURA SIMPLES
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'holerite' 
ORDER BY ordinal_position;

-- 3. VERIFICAR SE HÁ DADOS
SELECT COUNT(*) as total_registros FROM holerite;

-- 4. TESTAR INSERÇÃO SIMPLES
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    RAISE NOTICE 'Testando inserção...';
    
    INSERT INTO holerite (cpf, mes, ano, file_name, file_url, status)
    VALUES ('TESTE123', 1, 2024, 'teste.pdf', 'https://teste.com', 'pendente')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Inserção de teste bem-sucedida! ID: %', test_id;
    
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
    RAISE NOTICE '❌ Erro na inserção de teste: %', SQLERRM;
END $$;

-- 5. VERIFICAR RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'holerite'; 