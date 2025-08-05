-- =====================================================
-- VERIFICAR HOLERITES DO FUNCIONÁRIO
-- =====================================================

-- 1. VERIFICAR TODOS OS HOLERITES
SELECT 
    id,
    cpf,
    mes,
    ano,
    file_name,
    status,
    created_at,
    updated_at
FROM holerite
ORDER BY created_at DESC;

-- 2. VERIFICAR HOLERITES POR CPF ESPECÍFICO
SELECT 
    'HOLERITES DO FUNCIONÁRIO:' as info,
    id,
    cpf,
    mes,
    ano,
    file_name,
    status,
    created_at
FROM holerite
WHERE cpf = '04527705210'  -- Substitua pelo CPF do funcionário
ORDER BY ano DESC, mes DESC;

-- 3. VERIFICAR STATUS DOS HOLERITES
SELECT 
    status,
    COUNT(*) as total
FROM holerite
GROUP BY status
ORDER BY total DESC;

-- 4. VERIFICAR FUNCIONÁRIOS E SEUS HOLERITES
SELECT 
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

-- 5. VERIFICAR SE HÁ HOLERITES RECENTES
SELECT 
    'HOLERITES RECENTES:' as info,
    id,
    cpf,
    mes,
    ano,
    file_name,
    status,
    created_at
FROM holerite
WHERE created_at >= NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;

-- 6. VERIFICAR SE HÁ PROBLEMAS NA TABELA
DO $$
DECLARE
    total_registros INTEGER;
    registros_sem_cpf INTEGER;
    registros_sem_status INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_registros FROM holerite;
    SELECT COUNT(*) INTO registros_sem_cpf FROM holerite WHERE cpf IS NULL OR cpf = '';
    SELECT COUNT(*) INTO registros_sem_status FROM holerite WHERE status IS NULL OR status = '';
    
    RAISE NOTICE '=== ESTATÍSTICAS DOS HOLERITES ===';
    RAISE NOTICE 'Total de registros: %', total_registros;
    RAISE NOTICE 'Registros sem CPF: %', registros_sem_cpf;
    RAISE NOTICE 'Registros sem status: %', registros_sem_status;
    
    IF registros_sem_cpf > 0 THEN
        RAISE NOTICE '⚠️ Existem registros sem CPF!';
    END IF;
    
    IF registros_sem_status > 0 THEN
        RAISE NOTICE '⚠️ Existem registros sem status!';
    END IF;
END $$; 