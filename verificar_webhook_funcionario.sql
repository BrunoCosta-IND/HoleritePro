-- =====================================================
-- VERIFICAR WEBHOOK PARA FUNCIONÁRIO CADASTRADO
-- =====================================================

-- 1. VERIFICAR CONFIGURAÇÕES ATUAIS
SELECT 
    'CONFIGURAÇÕES ATUAIS:' as info,
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

-- 2. VERIFICAR SE WEBHOOK ESTÁ CONFIGURADO PARA FUNCIONÁRIOS
DO $$
DECLARE
    config_record RECORD;
BEGIN
    SELECT * INTO config_record 
    FROM webhook_config 
    ORDER BY updated_at DESC 
    LIMIT 1;
    
    IF FOUND THEN
        RAISE NOTICE '=== CONFIGURAÇÃO DO WEBHOOK ===';
        RAISE NOTICE 'ID: %', config_record.id;
        RAISE NOTICE 'URL: %', config_record.n8n_url;
        RAISE NOTICE 'Ativo: %', config_record.ativo;
        RAISE NOTICE 'Funcionário cadastrado: %', config_record.funcionario_cadastrado;
        
        RAISE NOTICE '';
        RAISE NOTICE '=== STATUS PARA FUNCIONÁRIOS ===';
        
        IF config_record.ativo AND config_record.funcionario_cadastrado THEN
            RAISE NOTICE '✅ WEBHOOK ATIVO PARA FUNCIONÁRIOS CADASTRADOS';
            RAISE NOTICE '✅ URL configurada: %', config_record.n8n_url;
        ELSIF NOT config_record.ativo THEN
            RAISE NOTICE '❌ WEBHOOK INATIVO';
        ELSIF NOT config_record.funcionario_cadastrado THEN
            RAISE NOTICE '❌ EVENTO DE FUNCIONÁRIO CADASTRADO DESABILITADO';
        END IF;
        
        IF config_record.n8n_url IS NULL OR config_record.n8n_url = '' THEN
            RAISE NOTICE '❌ URL DO WEBHOOK NÃO CONFIGURADA';
        END IF;
    ELSE
        RAISE NOTICE '❌ NENHUMA CONFIGURAÇÃO DE WEBHOOK ENCONTRADA!';
    END IF;
END $$;

-- 3. HABILITAR WEBHOOK PARA FUNCIONÁRIOS (se necessário)
-- Descomente as linhas abaixo se precisar habilitar:
/*
UPDATE webhook_config 
SET 
    ativo = true,
    funcionario_cadastrado = true,
    updated_at = NOW()
WHERE id = (SELECT id FROM webhook_config ORDER BY updated_at DESC LIMIT 1);
*/ 