-- =====================================================
-- SISTEMA DE GESTÃO DE HOLERITES - NOVO PROJETO
-- Execute este script no SQL Editor do Supabase
-- URL: https://lyzuwgjwvtsfgwttxzdk.supabase.co
-- =====================================================

-- 1. HABILITAR EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRIAR TABELAS PRINCIPAIS
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    cargo VARCHAR(100),
    tipo VARCHAR(20) DEFAULT 'admin' CHECK (tipo IN ('admin')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    cargo VARCHAR(100),
    tipo VARCHAR(20) DEFAULT 'comum',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holerite (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cpf VARCHAR(14) NOT NULL,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2030),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'assinado', 'rejeitado')),
    dataAssinatura TIMESTAMP WITH TIME ZONE,
    ipAssinatura INET,
    aceiteTermo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cpf, mes, ano)
);

CREATE TABLE IF NOT EXISTS empresa_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL DEFAULT 'Sistema de Gestão de Holerites',
    logo_url TEXT,
    cor_primaria VARCHAR(7) DEFAULT '#ff6b35',
    cor_secundaria VARCHAR(7) DEFAULT '#4a90e2',
    cor_botoes VARCHAR(7) DEFAULT '#ff6b35',
    fonte_principal VARCHAR(100) DEFAULT 'Inter',
    favicon_url TEXT,
    limite_funcionarios INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funcionalidades_pro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_whatsapp BOOLEAN DEFAULT false,
    relatorio_assinaturas BOOLEAN DEFAULT false,
    webhook_url TEXT,
    webhook_n8n TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs_atividade (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID,
    usuario_tipo VARCHAR(20),
    acao VARCHAR(100) NOT NULL,
    detalhes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uploads_n8n (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    funcionario_cpf VARCHAR(14) NOT NULL,
    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,
    pdf_url TEXT,
    webhook_status VARCHAR(20) DEFAULT 'pendente',
    webhook_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_email ON funcionarios(email);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_holerite_cpf ON holerite(cpf);
CREATE INDEX IF NOT EXISTS idx_holerite_status ON holerite(status);

-- 4. CRIAR FUNÇÕES
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. CRIAR TRIGGERS
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holerite_updated_at BEFORE UPDATE ON holerite FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresa_config_updated_at BEFORE UPDATE ON empresa_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionalidades_pro_updated_at BEFORE UPDATE ON funcionalidades_pro FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_uploads_n8n_updated_at BEFORE UPDATE ON uploads_n8n FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. HABILITAR RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holerite ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionalidades_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_atividade ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads_n8n ENABLE ROW LEVEL SECURITY;

-- 7. CRIAR POLÍTICAS RLS
CREATE POLICY "Todos podem ler configurações" ON empresa_config FOR SELECT USING (true);
CREATE POLICY "Todos podem ler funcionalidades" ON funcionalidades_pro FOR SELECT USING (true);
CREATE POLICY "Admins podem ver todos os dados" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Admins podem ver todos os funcionários" ON funcionarios FOR SELECT USING (true);
CREATE POLICY "Admins podem ver todos os holerites" ON holerite FOR SELECT USING (true);

-- Políticas para inserção, atualização e exclusão
CREATE POLICY "Admins podem inserir funcionários" ON funcionarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem atualizar funcionários" ON funcionarios FOR UPDATE USING (true);
CREATE POLICY "Admins podem excluir funcionários" ON funcionarios FOR DELETE USING (true);

CREATE POLICY "Admins podem inserir holerites" ON holerite FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem atualizar holerites" ON holerite FOR UPDATE USING (true);
CREATE POLICY "Admins podem excluir holerites" ON holerite FOR DELETE USING (true);

CREATE POLICY "Admins podem inserir logs" ON logs_atividade FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem ver logs" ON logs_atividade FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir uploads" ON uploads_n8n FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins podem atualizar uploads" ON uploads_n8n FOR UPDATE USING (true);
CREATE POLICY "Admins podem ver uploads" ON uploads_n8n FOR SELECT USING (true);

-- 8. INSERIR DADOS INICIAIS
INSERT INTO empresa_config (nome, cor_primaria, cor_secundaria, cor_botoes, fonte_principal, limite_funcionarios)
VALUES (
    'Sistema de Gestão de Holerites',
    '#ff6b35',
    '#4a90e2',
    '#ff6b35',
    'Inter',
    50
) ON CONFLICT DO NOTHING;

INSERT INTO funcionalidades_pro (webhook_whatsapp, relatorio_assinaturas)
VALUES (false, false) ON CONFLICT DO NOTHING;

INSERT INTO usuarios (nome, email, senha, cpf, tipo)
VALUES (
    'Administrador',
    'admin@empresa.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QqKqKq',
    '98765432100',
    'admin'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO funcionarios (nome, email, senha, cpf, whatsapp, cargo, tipo)
VALUES 
    ('João Silva', 'joao.silva@empresa.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QqKqKq', '11122233344', '(11) 99999-9999', 'Desenvolvedor', 'comum'),
    ('Maria Santos', 'maria.santos@empresa.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QqKqKq', '22233344455', '(11) 88888-8888', 'Designer', 'comum'),
    ('Pedro Costa', 'pedro.costa@empresa.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QqKqKq', '33344455566', '(11) 77777-7777', 'Analista', 'comum')
ON CONFLICT (email) DO NOTHING;

-- 9. VERIFICAÇÃO FINAL
SELECT 
    'Sistema criado com sucesso!' as status,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM funcionarios) as total_funcionarios,
    (SELECT COUNT(*) FROM empresa_config) as total_configs; 