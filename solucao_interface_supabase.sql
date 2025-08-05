-- =====================================================
-- SOLUÇÃO VIA INTERFACE SUPABASE
-- =====================================================

-- 1. VERIFICAR BUCKET ATUAL
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO BUCKET ATUAL ===';
    
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites') THEN
        RAISE NOTICE '✅ Bucket holerites existe';
        
        -- Verificar configuração atual
        SELECT 
            'CONFIGURAÇÃO ATUAL:' as info,
            id,
            name,
            public,
            file_size_limit,
            allowed_mime_types
        FROM storage.buckets 
        WHERE id = 'holerites';
        
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO existe';
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
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 3. CRIAR POLÍTICAS SEM MODIFICAR RLS
DO $$
BEGIN
    RAISE NOTICE '=== CRIANDO POLÍTICAS PERMISSIVAS ===';
    
    -- Remover políticas antigas se existirem
    DROP POLICY IF EXISTS "Permitir upload para todos" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir visualização para todos" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir atualização para todos" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir exclusão para todos" ON storage.objects;
    
    -- Criar políticas permissivas
    CREATE POLICY "Permitir upload para todos" ON storage.objects
        FOR INSERT WITH CHECK (true);
    RAISE NOTICE '✅ Política INSERT criada';
    
    CREATE POLICY "Permitir visualização para todos" ON storage.objects
        FOR SELECT USING (true);
    RAISE NOTICE '✅ Política SELECT criada';
    
    CREATE POLICY "Permitir atualização para todos" ON storage.objects
        FOR UPDATE USING (true) WITH CHECK (true);
    RAISE NOTICE '✅ Política UPDATE criada';
    
    CREATE POLICY "Permitir exclusão para todos" ON storage.objects
        FOR DELETE USING (true);
    RAISE NOTICE '✅ Política DELETE criada';
    
END $$;

-- 4. CONFIGURAR BUCKET
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURANDO BUCKET ===';
    
    -- Tornar bucket público
    UPDATE storage.buckets 
    SET public = true 
    WHERE id = 'holerites';
    
    RAISE NOTICE '✅ Bucket holerites configurado como público';
    
END $$;

-- 5. VERIFICAR CONFIGURAÇÃO FINAL
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO FINAL ===';
    
    -- Verificar bucket
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites' AND public = true) THEN
        RAISE NOTICE '✅ Bucket holerites está público';
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO está público';
    END IF;
    
    -- Verificar políticas
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND cmd = 'INSERT') THEN
        RAISE NOTICE '✅ Política INSERT configurada';
    ELSE
        RAISE NOTICE '❌ Política INSERT NÃO configurada';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND cmd = 'SELECT') THEN
        RAISE NOTICE '✅ Política SELECT configurada';
    ELSE
        RAISE NOTICE '❌ Política SELECT NÃO configurada';
    END IF;
    
    RAISE NOTICE '=== CONFIGURAÇÃO CONCLUÍDA ===';
    RAISE NOTICE 'Agora teste o upload novamente!';
    
END $$; 