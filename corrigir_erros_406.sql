-- =====================================================
-- CORREÇÃO DOS ERROS 406 - SUPABASE
-- =====================================================

-- 1. VERIFICAR TABELAS PRINCIPAIS
DO $$ 
BEGIN
  RAISE NOTICE '=== VERIFICANDO TABELAS PRINCIPAIS ===';
  
  -- Verificar se tabela funcionarios existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'funcionarios') THEN
    RAISE NOTICE '✅ Tabela funcionarios existe';
  ELSE
    RAISE NOTICE '❌ Tabela funcionarios NÃO existe';
  END IF;
  
  -- Verificar se tabela holerite existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'holerite') THEN
    RAISE NOTICE '✅ Tabela holerite existe';
  ELSE
    RAISE NOTICE '❌ Tabela holerite NÃO existe';
  END IF;
  
  -- Verificar se tabela empresa_config existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'empresa_config') THEN
    RAISE NOTICE '✅ Tabela empresa_config existe';
  ELSE
    RAISE NOTICE '❌ Tabela empresa_config NÃO existe';
  END IF;
  
  -- Verificar se tabela webhook_config existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'webhook_config') THEN
    RAISE NOTICE '✅ Tabela webhook_config existe';
  ELSE
    RAISE NOTICE '❌ Tabela webhook_config NÃO existe';
  END IF;
  
  -- Verificar se tabela funcionalidades_pro existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'funcionalidades_pro') THEN
    RAISE NOTICE '✅ Tabela funcionalidades_pro existe';
  ELSE
    RAISE NOTICE '❌ Tabela funcionalidades_pro NÃO existe';
  END IF;
  
  -- Verificar se tabela uploads_historico existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'uploads_historico') THEN
    RAISE NOTICE '✅ Tabela uploads_historico existe';
  ELSE
    RAISE NOTICE '❌ Tabela uploads_historico NÃO existe';
  END IF;
END $$;

-- 2. DESABILITAR RLS TEMPORARIAMENTE PARA TESTE
DO $$ 
BEGIN
  RAISE NOTICE '=== DESABILITANDO RLS PARA TESTE ===';
  
  -- Desabilitar RLS em todas as tabelas principais
  ALTER TABLE funcionarios DISABLE ROW LEVEL SECURITY;
  ALTER TABLE holerite DISABLE ROW LEVEL SECURITY;
  ALTER TABLE empresa_config DISABLE ROW LEVEL SECURITY;
  ALTER TABLE webhook_config DISABLE ROW LEVEL SECURITY;
  ALTER TABLE funcionalidades_pro DISABLE ROW LEVEL SECURITY;
  ALTER TABLE uploads_historico DISABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE '✅ RLS desabilitado em todas as tabelas';
END $$;

-- 3. CRIAR POLÍTICAS PERMISSIVAS
DO $$ 
BEGIN
  RAISE NOTICE '=== CRIANDO POLÍTICAS PERMISSIVAS ===';
  
  -- Políticas para funcionarios
  DROP POLICY IF EXISTS "Public Access" ON funcionarios;
  CREATE POLICY "Public Access" ON funcionarios FOR ALL USING (true);
  
  -- Políticas para holerite
  DROP POLICY IF EXISTS "Public Access" ON holerite;
  CREATE POLICY "Public Access" ON holerite FOR ALL USING (true);
  
  -- Políticas para empresa_config
  DROP POLICY IF EXISTS "Public Access" ON empresa_config;
  CREATE POLICY "Public Access" ON empresa_config FOR ALL USING (true);
  
  -- Políticas para webhook_config
  DROP POLICY IF EXISTS "Public Access" ON webhook_config;
  CREATE POLICY "Public Access" ON webhook_config FOR ALL USING (true);
  
  -- Políticas para funcionalidades_pro
  DROP POLICY IF EXISTS "Public Access" ON funcionalidades_pro;
  CREATE POLICY "Public Access" ON funcionalidades_pro FOR ALL USING (true);
  
  -- Políticas para uploads_historico
  DROP POLICY IF EXISTS "Public Access" ON uploads_historico;
  CREATE POLICY "Public Access" ON uploads_historico FOR ALL USING (true);
  
  RAISE NOTICE '✅ Políticas permissivas criadas';
END $$;

-- 4. REABILITAR RLS
DO $$ 
BEGIN
  RAISE NOTICE '=== REABILITANDO RLS ===';
  
  ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
  ALTER TABLE holerite ENABLE ROW LEVEL SECURITY;
  ALTER TABLE empresa_config ENABLE ROW LEVEL SECURITY;
  ALTER TABLE webhook_config ENABLE ROW LEVEL SECURITY;
  ALTER TABLE funcionalidades_pro ENABLE ROW LEVEL SECURITY;
  ALTER TABLE uploads_historico ENABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE '✅ RLS reabilitado';
END $$;

-- 5. VERIFICAR DADOS DE CONFIGURAÇÃO
DO $$ 
BEGIN
  RAISE NOTICE '=== VERIFICANDO DADOS DE CONFIGURAÇÃO ===';
  
  -- Verificar empresa_config
  IF EXISTS (SELECT 1 FROM empresa_config LIMIT 1) THEN
    RAISE NOTICE '✅ empresa_config tem dados';
  ELSE
    RAISE NOTICE '⚠️ empresa_config vazia - inserindo dados padrão';
    INSERT INTO empresa_config (nome, cor_botoes, created_at, updated_at) 
    VALUES ('Sistema de Gestão de Holerites', '#3b82f6', NOW(), NOW());
  END IF;
  
  -- Verificar webhook_config
  IF EXISTS (SELECT 1 FROM webhook_config LIMIT 1) THEN
    RAISE NOTICE '✅ webhook_config tem dados';
  ELSE
    RAISE NOTICE '⚠️ webhook_config vazia - inserindo dados padrão';
    INSERT INTO webhook_config (url, ativo, eventos, created_at, updated_at) 
    VALUES ('', false, '{}', NOW(), NOW());
  END IF;
  
  -- Verificar funcionalidades_pro
  IF EXISTS (SELECT 1 FROM funcionalidades_pro LIMIT 1) THEN
    RAISE NOTICE '✅ funcionalidades_pro tem dados';
  ELSE
    RAISE NOTICE '⚠️ funcionalidades_pro vazia - inserindo dados padrão';
    INSERT INTO funcionalidades_pro (webhook_whatsapp, relatorio_assinaturas, created_at, updated_at) 
    VALUES (false, false, NOW(), NOW());
  END IF;
  
END $$;

-- 6. TESTE DE CONEXÃO
DO $$ 
BEGIN
  RAISE NOTICE '=== TESTE DE CONEXÃO ===';
  
  -- Testar SELECT em funcionarios
  PERFORM COUNT(*) FROM funcionarios;
  RAISE NOTICE '✅ SELECT funcionarios OK';
  
  -- Testar SELECT em holerite
  PERFORM COUNT(*) FROM holerite;
  RAISE NOTICE '✅ SELECT holerite OK';
  
  -- Testar SELECT em empresa_config
  PERFORM COUNT(*) FROM empresa_config;
  RAISE NOTICE '✅ SELECT empresa_config OK';
  
  -- Testar SELECT em webhook_config
  PERFORM COUNT(*) FROM webhook_config;
  RAISE NOTICE '✅ SELECT webhook_config OK';
  
  -- Testar SELECT em funcionalidades_pro
  PERFORM COUNT(*) FROM funcionalidades_pro;
  RAISE NOTICE '✅ SELECT funcionalidades_pro OK';
  
  -- Testar SELECT em uploads_historico
  PERFORM COUNT(*) FROM uploads_historico;
  RAISE NOTICE '✅ SELECT uploads_historico OK';
  
END $$;

RAISE NOTICE '🎯 CORREÇÃO CONCLUÍDA! Teste o sistema agora.'; 