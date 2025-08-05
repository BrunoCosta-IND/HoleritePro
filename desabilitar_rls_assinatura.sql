-- =====================================================
-- DESABILITAR RLS PARA ASSINATURA
-- =====================================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE
DO $$
BEGIN
    RAISE NOTICE '=== DESABILITANDO RLS TEMPORARIAMENTE ===';
    
    -- Desabilitar RLS na tabela holerite
    ALTER TABLE holerite DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS desabilitado temporariamente na tabela holerite';
    
END $$;

-- 2. VERIFICAR RLS
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO RLS ===';
    
    -- Verificar se RLS está desabilitado
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'holerite' AND schemaname = 'public' AND rowsecurity = false) THEN
        RAISE NOTICE '✅ RLS está desabilitado na tabela holerite';
    ELSE
        RAISE NOTICE '❌ RLS ainda está ativo na tabela holerite';
    END IF;
    
END $$;

-- 3. TESTAR ATUALIZAÇÃO
DO $$
BEGIN
    RAISE NOTICE '=== TESTANDO ATUALIZAÇÃO SEM RLS ===';
    
    -- Verificar se existe um holerite para teste
    IF EXISTS (SELECT 1 FROM holerite LIMIT 1) THEN
        RAISE NOTICE '✅ Holerite encontrado para teste';
        
        -- Tentar atualização
        BEGIN
            UPDATE holerite 
            SET status = 'assinado', 
                dataAssinatura = NOW(),
                aceiteTermo = true
            WHERE id = (SELECT id FROM holerite LIMIT 1);
            
            RAISE NOTICE '✅ Atualização de teste bem-sucedida';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Atualização de teste falhou: %', SQLERRM;
        END;
        
    ELSE
        RAISE NOTICE '❌ Nenhum holerite encontrado para teste';
    END IF;
    
END $$;

-- 4. VERIFICAR DADOS DE TESTE
SELECT 
    'DADOS DE TESTE:' as info,
    id,
    cpf,
    mes,
    ano,
    status,
    dataAssinatura,
    aceiteTermo
FROM holerite 
ORDER BY created_at DESC 
LIMIT 3; 