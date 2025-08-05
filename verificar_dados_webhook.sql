-- =====================================================
-- VERIFICAR DADOS DO WEBHOOK
-- =====================================================

-- 1. VERIFICAR DADOS EXISTENTES
SELECT 
    id,
    n8n_url,
    ativo,
    holerite_enviado,
    holerite_assinado,
    funcionario_cadastrado,
    created_at,
    updated_at
FROM webhook_config
ORDER BY id DESC;

-- 2. VERIFICAR SE HÁ DADOS
SELECT 
    COUNT(*) as total_registros,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Tem dados'
        ELSE '❌ Sem dados'
    END as status
FROM webhook_config;

-- 3. VERIFICAR ÚLTIMO REGISTRO
SELECT 
    'Último registro:' as info,
    id,
    n8n_url,
    ativo,
    holerite_enviado,
    holerite_assinado,
    funcionario_cadastrado,
    updated_at
FROM webhook_config
ORDER BY updated_at DESC
LIMIT 1;

-- 4. VERIFICAR SE OS DADOS ESTÃO CORRETOS
DO $$
DECLARE
    config_record RECORD;
BEGIN
    SELECT * INTO config_record FROM webhook_config ORDER BY updated_at DESC LIMIT 1;
    
    IF FOUND THEN
        RAISE NOTICE '=== DADOS ENCONTRADOS ===';
        RAISE NOTICE 'ID: %', config_record.id;
        RAISE NOTICE 'URL: %', config_record.n8n_url;
        RAISE NOTICE 'Ativo: %', config_record.ativo;
        RAISE NOTICE 'Holerite enviado: %', config_record.holerite_enviado;
        RAISE NOTICE 'Holerite assinado: %', config_record.holerite_assinado;
        RAISE NOTICE 'Funcionário cadastrado: %', config_record.funcionario_cadastrado;
        RAISE NOTICE 'Última atualização: %', config_record.updated_at;
    ELSE
        RAISE NOTICE '❌ NENHUM DADO ENCONTRADO!';
    END IF;
END $$; 