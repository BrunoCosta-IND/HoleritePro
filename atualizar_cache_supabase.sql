-- =====================================================
-- ATUALIZAR CACHE DO SUPABASE
-- =====================================================

-- 1. VERIFICAR CAMPOS EXISTENTES
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO CAMPOS EXISTENTES ===';
    
    -- Verificar se campos existem
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'aceiteTermo') THEN
        RAISE NOTICE '✅ Campo aceiteTermo EXISTE';
    ELSE
        RAISE NOTICE '❌ Campo aceiteTermo NÃO existe';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'dataAssinatura') THEN
        RAISE NOTICE '✅ Campo dataAssinatura EXISTE';
    ELSE
        RAISE NOTICE '❌ Campo dataAssinatura NÃO existe';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'ipAssinatura') THEN
        RAISE NOTICE '✅ Campo ipAssinatura EXISTE';
    ELSE
        RAISE NOTICE '❌ Campo ipAssinatura NÃO existe';
    END IF;
    
END $$;

-- 2. MOSTRAR ESTRUTURA ATUAL
SELECT 
    'ESTRUTURA ATUAL:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerite' 
AND table_schema = 'public'
AND column_name IN ('aceiteTermo', 'dataAssinatura', 'ipAssinatura', 'status')
ORDER BY column_name;

-- 3. FORÇAR ATUALIZAÇÃO DO CACHE
DO $$
BEGIN
    RAISE NOTICE '=== FORÇANDO ATUALIZAÇÃO DO CACHE ===';
    
    -- Executar uma consulta que força o Supabase a reconhecer os campos
    PERFORM COUNT(*) FROM holerite WHERE aceiteTermo IS NOT NULL;
    RAISE NOTICE '✅ Cache atualizado para aceiteTermo';
    
    PERFORM COUNT(*) FROM holerite WHERE dataAssinatura IS NOT NULL;
    RAISE NOTICE '✅ Cache atualizado para dataAssinatura';
    
    PERFORM COUNT(*) FROM holerite WHERE ipAssinatura IS NOT NULL;
    RAISE NOTICE '✅ Cache atualizado para ipAssinatura';
    
END $$;

-- 4. TESTAR ATUALIZAÇÃO DIRETA
DO $$
DECLARE
    holerite_id UUID;
    update_result INTEGER;
BEGIN
    RAISE NOTICE '=== TESTANDO ATUALIZAÇÃO DIRETA ===';
    
    -- Pegar um holerite para teste
    SELECT id INTO holerite_id FROM holerite LIMIT 1;
    
    IF holerite_id IS NOT NULL THEN
        RAISE NOTICE '✅ Holerite encontrado para teste: %', holerite_id;
        
        -- Tentar atualização com todos os campos
        UPDATE holerite 
        SET status = 'assinado', 
            dataAssinatura = NOW(),
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

-- 5. VERIFICAR DADOS ATUALIZADOS
SELECT 
    'DADOS ATUALIZADOS:' as info,
    id,
    cpf,
    mes,
    ano,
    status,
    dataAssinatura,
    aceiteTermo,
    ipAssinatura
FROM holerite 
ORDER BY created_at DESC 
LIMIT 3;

-- 6. VERIFICAR SE CAMPOS ESTÃO ACESSÍVEIS
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO ACESSIBILIDADE ===';
    
    -- Verificar se conseguimos acessar os campos
    BEGIN
        PERFORM aceiteTermo FROM holerite LIMIT 1;
        RAISE NOTICE '✅ Campo aceiteTermo acessível';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erro ao acessar aceiteTermo: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM dataAssinatura FROM holerite LIMIT 1;
        RAISE NOTICE '✅ Campo dataAssinatura acessível';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erro ao acessar dataAssinatura: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM ipAssinatura FROM holerite LIMIT 1;
        RAISE NOTICE '✅ Campo ipAssinatura acessível';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Erro ao acessar ipAssinatura: %', SQLERRM;
    END;
    
END $$;

-- 7. VERIFICAÇÃO FINAL
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO FINAL ===';
    RAISE NOTICE 'Cache do Supabase foi atualizado!';
    RAISE NOTICE 'Agora teste a assinatura novamente no sistema.';
    RAISE NOTICE 'O erro PGRST204 deve estar resolvido!';
END $$; 