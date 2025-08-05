-- =====================================================
-- VERIFICAR TABELA DE HOLERITES
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
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerite' 
ORDER BY ordinal_position;

-- 3. VERIFICAR DADOS EXISTENTES
SELECT 
    id,
    cpf,
    mes,
    ano,
    file_name,
    file_size,
    status,
    created_at
FROM holerite
ORDER BY created_at DESC
LIMIT 10;

-- 4. VERIFICAR SE HÁ DADOS DUPLICADOS
SELECT 
    cpf,
    mes,
    ano,
    COUNT(*) as total
FROM holerite
GROUP BY cpf, mes, ano
HAVING COUNT(*) > 1
ORDER BY total DESC;

-- 5. VERIFICAR STATUS DOS HOLERITES
SELECT 
    status,
    COUNT(*) as total
FROM holerite
GROUP BY status
ORDER BY total DESC;

-- 6. VERIFICAR SE HÁ ERROS NA TABELA
DO $$
DECLARE
    total_registros INTEGER;
    registros_com_erro INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_registros FROM holerite;
    SELECT COUNT(*) INTO registros_com_erro FROM holerite WHERE status = 'erro';
    
    RAISE NOTICE '=== ESTATÍSTICAS DA TABELA HOLERITE ===';
    RAISE NOTICE 'Total de registros: %', total_registros;
    RAISE NOTICE 'Registros com erro: %', registros_com_erro;
    
    IF registros_com_erro > 0 THEN
        RAISE NOTICE '⚠️ Existem registros com erro!';
    ELSE
        RAISE NOTICE '✅ Nenhum registro com erro encontrado';
    END IF;
END $$; 