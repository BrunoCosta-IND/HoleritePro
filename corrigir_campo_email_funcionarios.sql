-- Script para tornar o campo email opcional na tabela funcionarios
-- Execute este script no SQL Editor do Supabase

-- 1. Alterar a coluna email para permitir NULL
ALTER TABLE funcionarios 
ALTER COLUMN email DROP NOT NULL;

-- 2. Verificar se a alteração foi aplicada
SELECT 
    column_name, 
    is_nullable, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'funcionarios' 
AND column_name = 'email';

-- 3. Atualizar registros existentes que possam ter email vazio para NULL
UPDATE funcionarios 
SET email = NULL 
WHERE email = '' OR email IS NULL;

-- 4. Verificar a estrutura atual da tabela
SELECT 
    column_name, 
    is_nullable, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'funcionarios' 
ORDER BY ordinal_position;
