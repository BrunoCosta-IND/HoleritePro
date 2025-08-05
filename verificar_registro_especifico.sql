-- =====================================================
-- VERIFICAR REGISTRO ESPECÍFICO DO WEBHOOK
-- =====================================================

-- 1. VERIFICAR TODOS OS REGISTROS
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
ORDER BY updated_at DESC;

-- 2. VERIFICAR O ÚLTIMO REGISTRO (que deve ser carregado)
SELECT 
    'ÚLTIMO REGISTRO (deve ser carregado):' as info,
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

-- 3. VERIFICAR SE OS VALORES ESTÃO CORRETOS
DO $$
DECLARE
    ultimo_registro RECORD;
BEGIN
    SELECT * INTO ultimo_registro 
    FROM webhook_config 
    ORDER BY updated_at DESC 
    LIMIT 1;
    
    IF FOUND THEN
        RAISE NOTICE '=== ÚLTIMO REGISTRO ENCONTRADO ===';
        RAISE NOTICE 'ID: %', ultimo_registro.id;
        RAISE NOTICE 'URL: %', ultimo_registro.n8n_url;
        RAISE NOTICE 'Ativo: %', ultimo_registro.ativo;
        RAISE NOTICE 'Holerite enviado: %', ultimo_registro.holerite_enviado;
        RAISE NOTICE 'Holerite assinado: %', ultimo_registro.holerite_assinado;
        RAISE NOTICE 'Funcionário cadastrado: %', ultimo_registro.funcionario_cadastrado;
        RAISE NOTICE 'Última atualização: %', ultimo_registro.updated_at;
        
        -- Verificar se os valores são válidos para o frontend
        RAISE NOTICE '';
        RAISE NOTICE '=== VALORES PARA FRONTEND ===';
        RAISE NOTICE 'URL (não nula): %', CASE WHEN ultimo_registro.n8n_url IS NOT NULL THEN 'SIM' ELSE 'NÃO' END;
        RAISE NOTICE 'Ativo (boolean): %', CASE WHEN ultimo_registro.ativo IS NOT NULL THEN 'SIM' ELSE 'NÃO' END;
        RAISE NOTICE 'Holerite enviado (boolean): %', CASE WHEN ultimo_registro.holerite_enviado IS NOT NULL THEN 'SIM' ELSE 'NÃO' END;
        RAISE NOTICE 'Holerite assinado (boolean): %', CASE WHEN ultimo_registro.holerite_assinado IS NOT NULL THEN 'SIM' ELSE 'NÃO' END;
        RAISE NOTICE 'Funcionário cadastrado (boolean): %', CASE WHEN ultimo_registro.funcionario_cadastrado IS NOT NULL THEN 'SIM' ELSE 'NÃO' END;
    ELSE
        RAISE NOTICE '❌ NENHUM REGISTRO ENCONTRADO!';
    END IF;
END $$; 