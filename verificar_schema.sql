-- =====================================================
-- SCRIPT DE VERIFICAÇÃO DO SCHEMA
-- Execute este script após executar o schema principal
-- =====================================================

-- 1. Verificar extensões
SELECT 
    'Extensões habilitadas' as status,
    extname as extensao
FROM pg_extension 
WHERE extname = 'uuid-ossp';

-- 2. Verificar tabelas criadas
SELECT 
    'Tabelas do sistema' as status,
    table_name,
    'Criada' as resultado
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'usuarios',
    'funcionarios',
    'holerite',
    'empresa_config',
    'funcionalidades_pro',
    'logs_atividade',
    'uploads_n8n'
)
ORDER BY table_name;

-- 3. Verificar dados iniciais
SELECT 
    'Usuário admin' as tipo,
    nome,
    email,
    'Criado' as status
FROM usuarios 
WHERE email = 'admin@empresa.com';

-- 4. Verificar funcionários de teste
SELECT 
    'Funcionários de teste' as tipo,
    nome,
    cpf,
    'Criado' as status
FROM funcionarios 
WHERE ativo = true
ORDER BY nome;

-- 5. Verificar configurações
SELECT 
    'Configurações da empresa' as tipo,
    nome,
    cor_primaria,
    'Configurada' as status
FROM empresa_config;

-- 6. Verificar funcionalidades PRO
SELECT 
    'Funcionalidades PRO' as tipo,
    webhook_whatsapp,
    relatorio_assinaturas,
    'Configuradas' as status
FROM funcionalidades_pro;

-- 7. Verificar índices
SELECT 
    'Índices criados' as status,
    indexname,
    tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 8. Verificar funções
SELECT 
    'Funções criadas' as status,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'update_updated_at_column',
    'validar_cpf',
    'registrar_log',
    'get_estatisticas_sistema',
    'buscar_funcionario_por_cpf',
    'funcionario_existe',
    'get_holerites_funcionario',
    'contar_holerites_por_status',
    'estatisticas_mensais'
)
ORDER BY routine_name;

-- 9. Verificar views
SELECT 
    'Views criadas' as status,
    table_name,
    'View' as tipo
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN (
    'estatisticas_sistema',
    'relatorio_assinaturas',
    'holerites_pendentes',
    'funcionarios_ativos'
)
ORDER BY table_name;

-- 10. Verificar RLS
SELECT 
    'RLS habilitado' as status,
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'usuarios',
    'funcionarios',
    'holerite',
    'empresa_config',
    'funcionalidades_pro',
    'logs_atividade',
    'uploads_n8n'
)
ORDER BY tablename;

-- 11. Resumo final
SELECT 
    'RESUMO FINAL' as titulo,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('usuarios','funcionarios','holerite','empresa_config','funcionalidades_pro','logs_atividade','uploads_n8n')) as total_tabelas,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM funcionarios WHERE ativo = true) as total_funcionarios,
    (SELECT COUNT(*) FROM empresa_config) as total_configs,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('update_updated_at_column','validar_cpf','registrar_log','get_estatisticas_sistema','buscar_funcionario_por_cpf','funcionario_existe','get_holerites_funcionario','contar_holerites_por_status','estatisticas_mensais')) as total_funcoes,
    (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('estatisticas_sistema','relatorio_assinaturas','holerites_pendentes','funcionarios_ativos')) as total_views; 