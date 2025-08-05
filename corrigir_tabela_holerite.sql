-- =====================================================
-- CORRIGIR TABELA HOLERITE
-- =====================================================

-- 1. CRIAR TABELA SE NÃO EXISTIR
CREATE TABLE IF NOT EXISTS holerite (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL,
    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR FUNÇÃO PARA ATUALIZAR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. CRIAR TRIGGER SE NÃO EXISTIR
DROP TRIGGER IF EXISTS update_holerite_updated_at ON holerite;
CREATE TRIGGER update_holerite_updated_at
    BEFORE UPDATE ON holerite
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. DESABILITAR RLS TEMPORARIAMENTE
ALTER TABLE holerite DISABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICA PERMISSIVA
DROP POLICY IF EXISTS "Permitir todas as operações" ON holerite;
CREATE POLICY "Permitir todas as operações" ON holerite
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. VERIFICAR SE A TABELA FOI CRIADA CORRETAMENTE
DO $$
DECLARE
    col RECORD;
BEGIN
    RAISE NOTICE '=== VERIFICAÇÃO DA TABELA HOLERITE ===';
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'holerite') THEN
        RAISE NOTICE '✅ Tabela holerite existe!';
    ELSE
        RAISE NOTICE '❌ Tabela holerite NÃO existe!';
    END IF;
    
    -- Verificar colunas
    RAISE NOTICE 'Colunas da tabela:';
    FOR col IN SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'holerite' ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - %: %', col.column_name, col.data_type;
    END LOOP;
    
    -- Verificar RLS
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'holerite' AND rowsecurity = false) THEN
        RAISE NOTICE '✅ RLS desabilitado!';
    ELSE
        RAISE NOTICE '⚠️ RLS ainda habilitado!';
    END IF;
    
    -- Verificar políticas
    IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'holerite') THEN
        RAISE NOTICE '✅ Políticas RLS configuradas!';
    ELSE
        RAISE NOTICE '⚠️ Nenhuma política RLS encontrada!';
    END IF;
    
END $$;

-- 7. TESTAR INSERÇÃO
DO $$
DECLARE
    test_id INTEGER;
BEGIN
    RAISE NOTICE 'Testando inserção...';
    
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