-- Script para corrigir dados dos usuários
-- Execute este script no SQL Editor do Supabase

-- 1. Limpar dados duplicados ou inconsistentes
DELETE FROM usuarios WHERE email = 'vanessa@elton.com';
DELETE FROM funcionarios WHERE email = 'vanessa@elton.com';

-- 2. Inserir usuário admin Vanessa Fernandes na tabela correta
INSERT INTO usuarios (nome, email, senha, cpf, whatsapp, cargo, tipo, ativo)
VALUES (
    'Vanessa Fernandes',
    'vanessa@elton.com',
    '123456',
    '22222222222',
    '(00) 00000-0000',
    'Administrador',
    'admin',
    true
);

-- 3. Garantir que o usuário admin padrão existe
INSERT INTO usuarios (nome, email, senha, cpf, whatsapp, cargo, tipo, ativo)
VALUES (
    'Administrador do Sistema',
    'admin@sistema.com',
    '123456',
    '12345678900',
    '(00) 00000-0000',
    'Administrador',
    'admin',
    true
) ON CONFLICT (email) DO UPDATE SET
    senha = '123456',
    tipo = 'admin',
    ativo = true;

-- 4. Garantir que o funcionário de teste existe
INSERT INTO funcionarios (nome, email, senha, cpf, whatsapp, cargo, tipo, ativo)
VALUES (
    'João Silva',
    'joao.silva@empresa.com',
    '123456',
    '11122233344',
    '(11) 99999-9999',
    'Desenvolvedor',
    'comum',
    true
) ON CONFLICT (email) DO UPDATE SET
    senha = '123456',
    tipo = 'comum',
    ativo = true;

-- 5. Verificar os dados finais
SELECT 'usuarios' as tabela, id, nome, email, senha, cpf, tipo, ativo 
FROM usuarios 
ORDER BY nome;

SELECT 'funcionarios' as tabela, id, nome, email, senha, cpf, tipo, ativo 
FROM funcionarios 
ORDER BY nome;
