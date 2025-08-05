-- =====================================================
-- VERIFICAR E CORRIGIR RLS PARA ASSINATURA
-- =====================================================

-- 1. VERIFICAR RLS ATUAL
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO RLS DA TABELA HOLERITE ===';
    
    -- Verificar se RLS está ativo
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'holerite' AND schemaname = 'public' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS está ativo na tabela holerite';
    ELSE
        RAISE NOTICE '❌ RLS NÃO está ativo na tabela holerite';
    END IF;
    
    -- Verificar políticas existentes
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerite' AND schemaname = 'public') THEN
        RAISE NOTICE '✅ Políticas RLS encontradas na tabela holerite';
    ELSE
        RAISE NOTICE '❌ Nenhuma política RLS encontrada na tabela holerite';
    END IF;
    
END $$;

-- 2. VERIFICAR POLÍTICAS ATUAIS
SELECT 
    'POLÍTICAS ATUAIS:' as info,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'holerite' 
AND schemaname = 'public';

-- 3. VERIFICAR ESTRUTURA DA TABELA
SELECT 
    'ESTRUTURA TABELA:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerite' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. CRIAR POLÍTICAS PARA ASSINATURA
DO $$
BEGIN
    RAISE NOTICE '=== CRIANDO POLÍTICAS PARA ASSINATURA ===';
    
    -- Remover políticas antigas se existirem
    DROP POLICY IF EXISTS "Funcionarios podem ver seus holerites" ON holerite;
    DROP POLICY IF EXISTS "Funcionarios podem assinar seus holerites" ON holerite;
    DROP POLICY IF EXISTS "Admins podem gerenciar todos os holerites" ON holerite;
    
    -- Política para funcionários verem seus holerites
    CREATE POLICY "Funcionarios podem ver seus holerites" ON holerite
        FOR SELECT USING (
            cpf = current_setting('request.jwt.claims', true)::json->>'cpf'
        );
    
    RAISE NOTICE '✅ Política SELECT criada para funcionários';
    
    -- Política para funcionários assinarem seus holerites
    CREATE POLICY "Funcionarios podem assinar seus holerites" ON holerite
        FOR UPDATE USING (
            cpf = current_setting('request.jwt.claims', true)::json->>'cpf'
        ) WITH CHECK (
            cpf = current_setting('request.jwt.claims', true)::json->>'cpf'
            AND status IN ('pendente', 'disponivel')
        );
    
    RAISE NOTICE '✅ Política UPDATE criada para funcionários';
    
    -- Política para admins gerenciarem todos os holerites
    CREATE POLICY "Admins podem gerenciar todos os holerites" ON holerite
        FOR ALL USING (
            current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
        );
    
    RAISE NOTICE '✅ Política ALL criada para admins';
    
END $$;

-- 5. VERIFICAR POLÍTICAS FINAIS
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO FINAL ===';
    
    -- Verificar se RLS está ativo
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'holerite' AND schemaname = 'public' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS está ativo';
    ELSE
        RAISE NOTICE '❌ RLS NÃO está ativo';
    END IF;
    
    -- Verificar políticas
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerite' AND schemaname = 'public' AND cmd = 'SELECT') THEN
        RAISE NOTICE '✅ Política SELECT configurada';
    ELSE
        RAISE NOTICE '❌ Política SELECT NÃO configurada';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerite' AND schemaname = 'public' AND cmd = 'UPDATE') THEN
        RAISE NOTICE '✅ Política UPDATE configurada';
    ELSE
        RAISE NOTICE '❌ Política UPDATE NÃO configurada';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'holerite' AND schemaname = 'public' AND cmd = 'ALL') THEN
        RAISE NOTICE '✅ Política ALL configurada';
    ELSE
        RAISE NOTICE '❌ Política ALL NÃO configurada';
    END IF;
    
END $$;

-- 6. TESTAR ATUALIZAÇÃO
DO $$
BEGIN
    RAISE NOTICE '=== TESTANDO ATUALIZAÇÃO ===';
    
    -- Verificar se existe um holerite para teste
    IF EXISTS (SELECT 1 FROM holerite LIMIT 1) THEN
        RAISE NOTICE '✅ Holerite encontrado para teste';
        
        -- Tentar atualização (pode falhar se não estiver logado)
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