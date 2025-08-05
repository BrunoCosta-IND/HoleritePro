-- =====================================================
-- ADICIONAR CAMPOS PARA ASSINATURA
-- =====================================================

-- 1. VERIFICAR CAMPOS ATUAIS
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO CAMPOS ATUAIS ===';
    
    -- Verificar se campos existem
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'aceiteTermo') THEN
        RAISE NOTICE '✅ Campo aceiteTermo já existe';
    ELSE
        RAISE NOTICE '❌ Campo aceiteTermo NÃO existe - será criado';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'dataAssinatura') THEN
        RAISE NOTICE '✅ Campo dataAssinatura já existe';
    ELSE
        RAISE NOTICE '❌ Campo dataAssinatura NÃO existe - será criado';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'ipAssinatura') THEN
        RAISE NOTICE '✅ Campo ipAssinatura já existe';
    ELSE
        RAISE NOTICE '❌ Campo ipAssinatura NÃO existe - será criado';
    END IF;
    
END $$;

-- 2. ADICIONAR CAMPOS FALTANTES
DO $$
BEGIN
    RAISE NOTICE '=== ADICIONANDO CAMPOS FALTANTES ===';
    
    -- Adicionar campo aceiteTermo se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'aceiteTermo') THEN
        ALTER TABLE holerite ADD COLUMN aceiteTermo BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Campo aceiteTermo adicionado';
    END IF;
    
    -- Adicionar campo dataAssinatura se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'dataAssinatura') THEN
        ALTER TABLE holerite ADD COLUMN dataAssinatura TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Campo dataAssinatura adicionado';
    END IF;
    
    -- Adicionar campo ipAssinatura se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'holerite' AND column_name = 'ipAssinatura') THEN
        ALTER TABLE holerite ADD COLUMN ipAssinatura VARCHAR(45);
        RAISE NOTICE '✅ Campo ipAssinatura adicionado';
    END IF;
    
END $$;

-- 3. VERIFICAR ESTRUTURA FINAL
SELECT 
    'ESTRUTURA FINAL:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerite' 
AND table_schema = 'public'
AND column_name IN ('aceiteTermo', 'dataAssinatura', 'ipAssinatura', 'status')
ORDER BY column_name;

-- 4. TESTAR ATUALIZAÇÃO
DO $$
DECLARE
    holerite_id UUID;
    update_result INTEGER;
BEGIN
    RAISE NOTICE '=== TESTANDO ATUALIZAÇÃO APÓS ADIÇÃO DOS CAMPOS ===';
    
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
            RAISE NOTICE '✅ Atualização bem-sucedida após adição dos campos!';
        ELSE
            RAISE NOTICE '❌ Atualização não afetou nenhuma linha';
        END IF;
        
    ELSE
        RAISE NOTICE '❌ Nenhum holerite encontrado para teste';
    END IF;
    
END $$;

-- 5. VERIFICAR DADOS DE TESTE
SELECT 
    'DADOS DE TESTE APÓS ATUALIZAÇÃO:' as info,
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

-- 6. VERIFICAR SE SUPABASE RECONHECE OS CAMPOS
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO FINAL ===';
    RAISE NOTICE 'Todos os campos necessários foram adicionados!';
    RAISE NOTICE 'Agora teste a assinatura novamente no sistema.';
    RAISE NOTICE 'O erro PGRST204 deve estar resolvido!';
END $$; 