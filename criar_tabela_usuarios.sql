-- Script para criar a tabela usuarios
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela usuarios se não existir
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    cargo VARCHAR(100),
    tipo VARCHAR(20) DEFAULT 'admin' CHECK (tipo IN ('admin', 'criador')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir usuário admin Vanessa Fernandes
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
) ON CONFLICT (email) DO UPDATE SET
    senha = '123456',
    tipo = 'admin',
    ativo = true;

-- 3. Inserir usuário admin padrão
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

-- 4. Verificar se a tabela foi criada e os dados inseridos
SELECT 'usuarios' as tabela, id, nome, email, senha, cpf, tipo, ativo 
FROM usuarios 
ORDER BY nome;
