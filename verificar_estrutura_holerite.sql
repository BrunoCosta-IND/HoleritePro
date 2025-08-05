-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA HOLERITE
-- =====================================================

-- 1. VERIFICAR ESTRUTURA COMPLETA
SELECT 
    'ESTRUTURA TABELA:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'holerite' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. VERIFICAR CONSTRAINTS
SELECT 
    'CONSTRAINTS:' as info,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'holerite' 
AND table_schema = 'public';

-- 3. VERIFICAR DADOS DE TESTE
SELECT 
    'DADOS DE TESTE:' as info,
    id,
    cpf,
    mes,
    ano,
    status,
    dataAssinatura,
    aceiteTermo,
    ipAssinatura,
    created_at,
    updated_at
FROM holerite 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. VERIFICAR SE CAMPOS EXISTEM
DO $$
DECLARE
    col_exists BOOLEAN;
BEGIN
    RAISE NOTICE '=== VERIFICANDO CAMPOS ===';
    
    -- Verificar campo dataAssinatura
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerite' 
        AND column_name = 'dataAssinatura'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE '✅ Campo dataAssinatura existe';
    ELSE
        RAISE NOTICE '❌ Campo dataAssinatura NÃO existe';
    END IF;
    
    -- Verificar campo ipAssinatura
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerite' 
        AND column_name = 'ipAssinatura'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE '✅ Campo ipAssinatura existe';
    ELSE
        RAISE NOTICE '❌ Campo ipAssinatura NÃO existe';
    END IF;
    
    -- Verificar campo aceiteTermo
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerite' 
        AND column_name = 'aceiteTermo'
    ) INTO col_exists;
    
    IF col_exists THEN
        RAISE NOTICE '✅ Campo aceiteTermo existe';
    ELSE
        RAISE NOTICE '❌ Campo aceiteTermo NÃO existe';
    END IF;
    
END $$;

-- 5. TESTAR ATUALIZAÇÃO COM DADOS ESPECÍFICOS
DO $$
DECLARE
    holerite_id UUID;
    update_result BOOLEAN;
BEGIN
    RAISE NOTICE '=== TESTANDO ATUALIZAÇÃO ESPECÍFICA ===';
    
    -- Pegar um holerite específico
    SELECT id INTO holerite_id FROM holerite LIMIT 1;
    
    IF holerite_id IS NOT NULL THEN
        RAISE NOTICE '✅ Holerite encontrado: %', holerite_id;
        
        -- Tentar atualização com dados específicos
        UPDATE holerite 
        SET status = 'assinado', 
            dataAssinatura = '2025-08-05T13:46:15.530Z',
            aceiteTermo = true,
            ipAssinatura = '192.168.1.100'
        WHERE id = holerite_id;
        
        GET DIAGNOSTICS update_result = ROW_COUNT;
        
        IF update_result > 0 THEN
            RAISE NOTICE '✅ Atualização bem-sucedida!';
        ELSE
            RAISE NOTICE '❌ Atualização não afetou nenhuma linha';
        END IF;
        
    ELSE
        RAISE NOTICE '❌ Nenhum holerite encontrado para teste';
    END IF;
    
END $$;

-- 6. VERIFICAR TIPOS DE DADOS
SELECT 
    'TIPOS DE DADOS:' as info,
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'timestamp with time zone' THEN 'TIMESTAMPTZ'
        WHEN data_type = 'character varying' THEN 'VARCHAR'
        WHEN data_type = 'boolean' THEN 'BOOLEAN'
        WHEN data_type = 'uuid' THEN 'UUID'
        ELSE data_type
    END as tipo_simplificado
FROM information_schema.columns 
WHERE table_name = 'holerite' 
AND table_schema = 'public'
AND column_name IN ('dataAssinatura', 'ipAssinatura', 'aceiteTermo', 'status')
ORDER BY column_name;

-- 7. VERIFICAR SE HÁ DADOS INVÁLIDOS
SELECT 
    'VERIFICANDO DADOS INVÁLIDOS:' as info,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN status IS NULL THEN 1 END) as status_null,
    COUNT(CASE WHEN dataAssinatura IS NULL THEN 1 END) as dataAssinatura_null,
    COUNT(CASE WHEN ipAssinatura IS NULL THEN 1 END) as ipAssinatura_null,
    COUNT(CASE WHEN aceiteTermo IS NULL THEN 1 END) as aceiteTermo_null
FROM holerite; 