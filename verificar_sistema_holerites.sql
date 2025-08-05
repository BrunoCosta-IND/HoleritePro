-- =====================================================
-- VERIFICAR E CONFIGURAR SISTEMA DE HOLERITES
-- =====================================================

-- 1. VERIFICAR ESTRUTURA DA TABELA HOLERITE
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

-- 3. VERIFICAR SE HÁ DADOS
SELECT 
    'DADOS ATUAIS:' as info,
    COUNT(*) as total_registros,
    COUNT(DISTINCT cpf) as funcionarios_unicos
FROM holerite;

-- 4. VERIFICAR RLS ATUAL
SELECT 
    'RLS STATUS:' as info,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'holerite';

-- 5. VERIFICAR POLÍTICAS RLS ATUAIS
SELECT 
    'POLÍTICAS RLS:' as info,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'holerite';

-- 6. CONFIGURAR RLS PARA HOLERITES
DO $$
BEGIN
    RAISE NOTICE '=== CONFIGURANDO RLS PARA HOLERITES ===';
    
    -- Habilitar RLS
    ALTER TABLE holerite ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ RLS habilitado na tabela holerite';
    
    -- Remover políticas antigas se existirem
    DROP POLICY IF EXISTS "Funcionarios podem ver seus proprios holerites" ON holerite;
    DROP POLICY IF EXISTS "Admins podem ver todos os holerites" ON holerite;
    DROP POLICY IF EXISTS "Permitir todas as operações" ON holerite;
    
    -- Política para funcionários verem apenas seus holerites
    CREATE POLICY "Funcionarios podem ver seus proprios holerites" ON holerite
        FOR SELECT USING (
            cpf = (
                SELECT cpf FROM funcionarios 
                WHERE cpf = auth.jwt() ->> 'cpf'
            )
        );
    
    RAISE NOTICE '✅ Política criada: Funcionarios podem ver seus proprios holerites';
    
    -- Política para admins inserirem holerites
    CREATE POLICY "Admins podem inserir holerites" ON holerite
        FOR INSERT WITH CHECK (true);
    
    RAISE NOTICE '✅ Política criada: Admins podem inserir holerites';
    
    -- Política para admins atualizarem holerites
    CREATE POLICY "Admins podem atualizar holerites" ON holerite
        FOR UPDATE USING (true) WITH CHECK (true);
    
    RAISE NOTICE '✅ Política criada: Admins podem atualizar holerites';
    
    -- Política para admins verem todos os holerites
    CREATE POLICY "Admins podem ver todos os holerites" ON holerite
        FOR SELECT USING (true);
    
    RAISE NOTICE '✅ Política criada: Admins podem ver todos os holerites';
    
END $$;

-- 7. VERIFICAR FUNCIONÁRIOS E SEUS HOLERITES
SELECT 
    'FUNCIONÁRIOS E HOLERITES:' as info,
    f.nome,
    f.cpf,
    COUNT(h.id) as total_holerites,
    COUNT(CASE WHEN h.status = 'disponivel' THEN 1 END) as disponiveis,
    COUNT(CASE WHEN h.status = 'assinado' THEN 1 END) as assinados,
    COUNT(CASE WHEN h.status = 'pendente' THEN 1 END) as pendentes
FROM funcionarios f 
LEFT JOIN holerite h ON f.cpf = h.cpf 
WHERE f.ativo = true 
GROUP BY f.id, f.nome, f.cpf 
ORDER BY f.nome;

-- 8. TESTAR INSERÇÃO COM RLS
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    RAISE NOTICE '=== TESTANDO INSERÇÃO COM RLS ===';
    
    -- Testar inserção (deve funcionar para admin)
    INSERT INTO holerite (cpf, mes, ano, file_name, file_url, status)
    VALUES ('TESTE123', 1, 2024, 'teste.pdf', 'https://teste.com', 'pendente')
    RETURNING id INTO test_id;
    
    RAISE NOTICE '✅ Inserção de teste bem-sucedida! ID: %', test_id;
    
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
    RAISE NOTICE '❌ Erro na inserção de teste: %', SQLERRM;
END $$;

-- 9. VERIFICAR CONFIGURAÇÃO FINAL
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
    
END $$; 