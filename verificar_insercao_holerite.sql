-- =====================================================
-- VERIFICAR E TESTAR INSERÇÃO NA TABELA HOLERITE
-- =====================================================

-- 1. VERIFICAR ESTRUTURA DA TABELA
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO TABELA HOLERITE ===';
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'holerite') THEN
        RAISE NOTICE '✅ Tabela holerite existe!';
    ELSE
        RAISE NOTICE '❌ Tabela holerite NÃO existe!';
    END IF;
END $$;

-- 2. VERIFICAR ESTRUTURA DAS COLUNAS
SELECT 
    'ESTRUTURA DA TABELA:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerite' 
ORDER BY ordinal_position;

-- 3. VERIFICAR SE HÁ DADOS ATUAIS
SELECT 
    'DADOS ATUAIS:' as info,
    COUNT(*) as total_registros,
    COUNT(DISTINCT cpf) as funcionarios_unicos
FROM holerite;

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

-- 6. TESTAR INSERÇÃO SIMPLES
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    RAISE NOTICE '=== TESTANDO INSERÇÃO SIMPLES ===';
    
    -- Testar inserção com dados mínimos
    INSERT INTO holerite (cpf, mes, ano, file_name, file_url, status)
    VALUES ('TESTE123', 1, 2024, 'teste.pdf', 'https://teste.com', 'pendente')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Inserção simples bem-sucedida! ID: %', test_id;
    
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
    RAISE NOTICE '❌ Erro na inserção simples: %', SQLERRM;
END $$;

-- 7. TESTAR INSERÇÃO COM DADOS REAIS
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    RAISE NOTICE '=== TESTANDO INSERÇÃO COM DADOS REAIS ===';
    
    -- Testar inserção com dados similares aos do upload
    INSERT INTO holerite (cpf, mes, ano, file_name, file_url, file_size, status)
    VALUES ('04527705210', 1, 2024, '04527705210.pdf', 'https://teste.com/arquivo.pdf', 123456, 'pendente')
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

-- 8. VERIFICAR PERMISSÕES
SELECT 
    'PERMISSÕES:' as info,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'holerite';

-- 9. VERIFICAR SE HÁ FUNCIONÁRIOS CADASTRADOS
SELECT 
    'FUNCIONÁRIOS CADASTRADOS:' as info,
    COUNT(*) as total_funcionarios,
    COUNT(CASE WHEN ativo = true THEN 1 END) as ativos
FROM funcionarios;

-- 10. VERIFICAR FUNCIONÁRIO ESPECÍFICO
SELECT 
    'FUNCIONÁRIO 04527705210:' as info,
    id,
    nome,
    cpf,
    ativo
FROM funcionarios 
WHERE cpf = '04527705210';

-- 11. TESTAR INSERÇÃO PARA FUNCIONÁRIO EXISTENTE
DO $$
DECLARE
    test_id INTEGER;
    funcionario_exists BOOLEAN;
BEGIN
    RAISE NOTICE '=== TESTANDO INSERÇÃO PARA FUNCIONÁRIO EXISTENTE ===';
    
    -- Verificar se o funcionário existe
    SELECT EXISTS(SELECT 1 FROM funcionarios WHERE cpf = '04527705210') INTO funcionario_exists;
    
    IF funcionario_exists THEN
        RAISE NOTICE '✅ Funcionário 04527705210 existe!';
        
        -- Testar inserção
        INSERT INTO holerite (cpf, mes, ano, file_name, file_url, file_size, status)
        VALUES ('04527705210', 1, 2024, '04527705210.pdf', 'https://teste.com/arquivo.pdf', 123456, 'pendente')
        RETURNING id INTO test_id;
        
        RAISE NOTICE '✅ Inserção para funcionário existente bem-sucedida! ID: %', test_id;
        
        -- Verificar se foi inserido
        IF EXISTS (SELECT 1 FROM holerite WHERE id = test_id) THEN
            RAISE NOTICE '✅ Registro encontrado no banco!';
        ELSE
            RAISE NOTICE '❌ Registro NÃO encontrado no banco!';
        END IF;
        
        -- Limpar o teste
        DELETE FROM holerite WHERE id = test_id;
        RAISE NOTICE '✅ Registro de teste removido';
    ELSE
        RAISE NOTICE '❌ Funcionário 04527705210 NÃO existe!';
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Erro na inserção para funcionário existente: %', SQLERRM;
END $$;

-- 12. VERIFICAR CONFIGURAÇÃO FINAL
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURAÇÃO FINAL ===';
    
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'holerite' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS habilitado na tabela holerite';
    ELSE
        RAISE NOTICE '❌ RLS NÃO habilitado na tabela holerite';
    END IF;
    
    IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'holerite') THEN
        RAISE NOTICE '✅ Políticas RLS configuradas';
    ELSE
        RAISE NOTICE '❌ Nenhuma política RLS encontrada';
    END IF;
    
    IF EXISTS (SELECT 1 FROM funcionarios WHERE cpf = '04527705210') THEN
        RAISE NOTICE '✅ Funcionário 04527705210 existe';
    ELSE
        RAISE NOTICE '❌ Funcionário 04527705210 NÃO existe';
    END IF;
    
END $$; 