-- Script para verificar e corrigir usuários no banco
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estrutura da tabela usuarios
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 2. Verificar todos os usuários na tabela usuarios
SELECT id, nome, email, senha, cpf, tipo, ativo 
FROM usuarios 
ORDER BY nome;

-- 3. Verificar todos os funcionários na tabela funcionarios
SELECT id, nome, email, senha, cpf, tipo, ativo 
FROM funcionarios 
ORDER BY nome;

-- 4. Verificar se existe o usuário Vanessa Fernandes
SELECT 'usuarios' as tabela, id, nome, email, senha, cpf, tipo, ativo 
FROM usuarios 
WHERE email = 'vanessa@elton.com' OR nome ILIKE '%vanessa%'

UNION ALL

SELECT 'funcionarios' as tabela, id, nome, email, senha, cpf, tipo, ativo 
FROM funcionarios 
WHERE email = 'vanessa@elton.com' OR nome ILIKE '%vanessa%';

-- 5. Inserir usuário admin Vanessa Fernandes na tabela correta (se não existir)
INSERT INTO usuarios (nome, email, senha, cpf, whatsapp, cargo, tipo)
VALUES (
    'Vanessa Fernandes',
    'vanessa@elton.com',
    '123456', -- Senha em texto plano para teste
    '22222222222',
    '(00) 00000-0000',
    'Administrador',
    'admin'
) ON CONFLICT (email) DO UPDATE SET
    senha = '123456',
    tipo = 'admin',
    ativo = true;

-- 6. Verificar se o usuário foi criado/atualizado
SELECT id, nome, email, senha, cpf, tipo, ativo 
FROM usuarios 
WHERE email = 'vanessa@elton.com';
