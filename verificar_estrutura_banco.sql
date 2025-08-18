-- Script para verificar a estrutura atual do banco
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todas as tabelas existentes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verificar estrutura da tabela funcionarios (se existir)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'funcionarios' 
ORDER BY ordinal_position;

-- 3. Verificar dados na tabela funcionarios
SELECT id, nome, email, senha, cpf, tipo, ativo 
FROM funcionarios 
ORDER BY nome;

-- 4. Verificar se há usuários admin na tabela funcionarios
SELECT id, nome, email, senha, cpf, tipo, ativo 
FROM funcionarios 
WHERE tipo = 'admin' OR cargo = 'Administrador'
ORDER BY nome;
