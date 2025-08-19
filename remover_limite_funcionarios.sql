-- Script para remover o limite de funcionários
-- Remove o campo limite_funcionarios da tabela empresa_config

-- Verificar se o campo existe antes de remover
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'empresa_config' 
        AND column_name = 'limite_funcionarios'
    ) THEN
        ALTER TABLE empresa_config DROP COLUMN limite_funcionarios;
        RAISE NOTICE 'Campo limite_funcionarios removido com sucesso';
    ELSE
        RAISE NOTICE 'Campo limite_funcionarios não existe na tabela empresa_config';
    END IF;
END $$;

-- Verificar se a alteração foi aplicada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'empresa_config' 
ORDER BY ordinal_position;
