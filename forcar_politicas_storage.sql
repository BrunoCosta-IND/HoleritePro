-- =====================================================
-- FORÇAR CONFIGURAÇÃO DE POLÍTICAS DE STORAGE
-- =====================================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE
DO $$
BEGIN
    RAISE NOTICE '=== DESABILITANDO RLS TEMPORARIAMENTE ===';
    
    -- Desabilitar RLS na tabela storage.objects
    ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS desabilitado temporariamente';
    
END $$;

-- 2. REMOVER TODAS AS POLÍTICAS EXISTENTES
DO $$
BEGIN
    RAISE NOTICE '=== REMOVENDO POLÍTICAS ANTIGAS ===';
    
    -- Listar e remover todas as políticas existentes
    DROP POLICY IF EXISTS "Permitir upload para admins" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir visualização pública" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir atualização para admins" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir exclusão para admins" ON storage.objects;
    DROP POLICY IF EXISTS "Permitir todas as operações" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view own folder" ON storage.objects;
    
    RAISE NOTICE '✅ Todas as políticas antigas removidas';
    
END $$;

-- 3. CRIAR POLÍTICAS PERMISSIVAS
DO $$
BEGIN
    RAISE NOTICE '=== CRIANDO POLÍTICAS PERMISSIVAS ===';
    
    -- Política para INSERT (upload)
    CREATE POLICY "Permitir upload para todos" ON storage.objects
        FOR INSERT WITH CHECK (true);
    RAISE NOTICE '✅ Política INSERT criada';
    
    -- Política para SELECT (visualização)
    CREATE POLICY "Permitir visualização para todos" ON storage.objects
        FOR SELECT USING (true);
    RAISE NOTICE '✅ Política SELECT criada';
    
    -- Política para UPDATE (atualização)
    CREATE POLICY "Permitir atualização para todos" ON storage.objects
        FOR UPDATE USING (true) WITH CHECK (true);
    RAISE NOTICE '✅ Política UPDATE criada';
    
    -- Política para DELETE (exclusão)
    CREATE POLICY "Permitir exclusão para todos" ON storage.objects
        FOR DELETE USING (true);
    RAISE NOTICE '✅ Política DELETE criada';
    
END $$;

-- 4. REABILITAR RLS
DO $$
BEGIN
    RAISE NOTICE '=== REABILITANDO RLS ===';
    
    -- Reabilitar RLS na tabela storage.objects
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS reabilitado com políticas permissivas';
    
END $$;

-- 5. VERIFICAR BUCKET
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO CONFIGURAÇÃO DO BUCKET ===';
    
    -- Verificar se bucket existe e está público
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites') THEN
        RAISE NOTICE '✅ Bucket holerites existe';
        
        -- Tornar bucket público
        UPDATE storage.buckets SET public = true WHERE id = 'holerites';
        RAISE NOTICE '✅ Bucket holerites configurado como público';
        
    ELSE
        RAISE NOTICE '❌ Bucket holerites NÃO existe - criando...';
        
        -- Criar bucket se não existir
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('holerites', 'holerites', true, 52428800, ARRAY['application/pdf']);
        
        RAISE NOTICE '✅ Bucket holerites criado com sucesso';
    END IF;
    
END $$;

-- 6. VERIFICAR POLÍTICAS FINAIS
DO $$
BEGIN
    RAISE NOTICE '=== VERIFICANDO POLÍTICAS FINAIS ===';
    
    -- Verificar se RLS está ativo
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'objects' AND schemaname = 'storage' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS está ativo na tabela storage.objects';
    ELSE
        RAISE NOTICE '❌ RLS NÃO está ativo na tabela storage.objects';
    END IF;
    
    -- Verificar políticas
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') THEN
        RAISE NOTICE '✅ Políticas configuradas na tabela storage.objects';
    ELSE
        RAISE NOTICE '❌ Nenhuma política encontrada na tabela storage.objects';
    END IF;
    
    -- Contar políticas
    SELECT 
        'POLÍTICAS CONFIGURADAS:' as info,
        COUNT(*) as total_policies
    FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage';
    
END $$;

-- 7. TESTE FINAL DE CONFIGURAÇÃO
DO $$
BEGIN
    RAISE NOTICE '=== TESTE FINAL DE CONFIGURAÇÃO ===';
    
    -- Verificar bucket
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'holerites' AND public = true) THEN
        RAISE NOTICE '✅ Bucket holerites está público e disponível';
    ELSE
        RAISE NOTICE '❌ Problema com bucket holerites';
    END IF;
    
    -- Verificar RLS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'objects' AND schemaname = 'storage' AND rowsecurity = true) THEN
        RAISE NOTICE '✅ RLS está ativo';
    ELSE
        RAISE NOTICE '❌ RLS NÃO está ativo';
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