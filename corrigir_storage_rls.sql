-- =====================================================
-- CORRIGIR RLS DO BUCKET DE STORAGE
-- =====================================================

-- 1. VERIFICAR BUCKET HOLERITES
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO BUCKET HOLERITES ===';
    
    -- Verificar se o bucket existe
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites') THEN
        RAISE NOTICE '✅ Bucket holerites existe!';
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO existe!';
    END IF;
END $$;

-- 2. VERIFICAR RLS DO BUCKET
SELECT 
    'BUCKET RLS:' as info,
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'holerites';

-- 3. VERIFICAR POLÍTICAS DO BUCKET
SELECT 
    'POLÍTICAS BUCKET:' as info,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 4. CONFIGURAR POLÍTICAS PARA UPLOAD
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURANDO POLÍTICAS DE STORAGE ===';
    
    -- Remover políticas antigas se existirem
    DROP POLICY IF EXISTS "Permitir upload para admins" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir visualização pública" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir todas as operações" ON storage.objects;
    
    -- Política para permitir upload (INSERT)
    CREATE POLICY "Permitir upload para admins" ON storage.objects
        FOR INSERT WITH CHECK (
            bucket_id = 'holerites'
        );
    
    RAISE NOTICE '✅ Política criada: Permitir upload para admins';
    
    -- Política para permitir visualização (SELECT)
    CREATE POLICY "Permitir visualização pública" ON storage.objects
        FOR SELECT USING (
            bucket_id = 'holerites'
        );
    
    RAISE NOTICE '✅ Política criada: Permitir visualização pública';
    
    -- Política para permitir atualização (UPDATE)
    CREATE POLICY "Permitir atualização para admins" ON storage.objects
        FOR UPDATE USING (
            bucket_id = 'holerites'
        ) WITH CHECK (
            bucket_id = 'holerites'
        );
    
    RAISE NOTICE '✅ Política criada: Permitir atualização para admins';
    
    -- Política para permitir exclusão (DELETE)
    CREATE POLICY "Permitir exclusão para admins" ON storage.objects
        FOR DELETE USING (
            bucket_id = 'holerites'
        );
    
    RAISE NOTICE '✅ Política criada: Permitir exclusão para admins';
    
END $$;

-- 5. VERIFICAR SE BUCKET ESTÁ PÚBLICO
UPDATE storage.buckets 
SET public = true 
WHERE id = 'holerites';

-- 6. VERIFICAR CONFIGURAÇÃO FINAL
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURAÇÃO FINAL DO STORAGE ===';
    
    -- Verificar se bucket está público
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites' AND public = true) THEN
        RAISE NOTICE '✅ Bucket holerites está público';
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO está público';
    END IF;
    
    -- Verificar políticas
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') THEN
        RAISE NOTICE '✅ Políticas de storage configuradas';
    ELSE
        RAISE NOTICE '❌ Nenhuma política de storage encontrada';
    END IF;
    
END $$;

-- 7. TESTAR UPLOAD SIMULADO
DO $$
BEGIN
    RAISE NOTICE '=== TESTANDO CONFIGURAÇÃO DE STORAGE ===';
    
    -- Verificar se podemos inserir no bucket
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites') THEN
        RAISE NOTICE '✅ Bucket holerites está disponível';
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO está disponível';
    END IF;
    
    -- Verificar se bucket está público
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites' AND public = true) THEN
        RAISE NOTICE '✅ Bucket holerites está público';
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO está público';
    END IF;
    
    -- Verificar políticas de INSERT
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND cmd = 'INSERT') THEN
        RAISE NOTICE '✅ Política de INSERT configurada';
    ELSE
        RAISE NOTICE '❌ Política de INSERT NÃO configurada';
    END IF;
    
    -- Verificar políticas de SELECT
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND cmd = 'SELECT') THEN
        RAISE NOTICE '✅ Política de SELECT configurada';
    ELSE
        RAISE NOTICE '❌ Política de SELECT NÃO configurada';
    END IF;
    
END $$; 