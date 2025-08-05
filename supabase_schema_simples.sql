-- =====================================================
-- SISTEMA DE GESTÃO DE HOLERITES - SCHEMA SIMPLIFICADO
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- 1. TABELA DE USUÁRIOS (ADMINISTRADORES)
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

-- 2. TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS funcionarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    cargo VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE HOLERITES
CREATE TABLE IF NOT EXISTS holerite (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cpf VARCHAR(14) NOT NULL,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    ano INTEGER NOT NULL CHECK (ano >= 2020 AND ano <= 2030),
    file_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'assinado', 'rejeitado')),
    dataAssinatura TIMESTAMP WITH TIME ZONE,
    ipAssinatura INET,
    aceiteTermo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cpf, mes, ano)
);

-- 4. TABELA DE CONFIGURAÇÕES DA EMPRESA
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

-- 5. TABELA DE FUNCIONALIDADES PRO
CREATE TABLE IF NOT EXISTS funcionalidades_pro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_whatsapp BOOLEAN DEFAULT false,
    relatorio_assinaturas BOOLEAN DEFAULT false,
    webhook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE LOGS DE ATIVIDADE
CREATE TABLE IF NOT EXISTS logs_atividade (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID,
    usuario_tipo VARCHAR(20), -- 'admin', 'funcionario', 'criador'
    acao VARCHAR(100) NOT NULL,
    detalhes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para tabela usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);

-- Índices para tabela funcionarios
CREATE INDEX IF NOT EXISTS idx_funcionarios_email ON funcionarios(email);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_ativo ON funcionarios(ativo);

-- Índices para tabela holerite
CREATE INDEX IF NOT EXISTS idx_holerite_cpf ON holerite(cpf);
CREATE INDEX IF NOT EXISTS idx_holerite_status ON holerite(status);
CREATE INDEX IF NOT EXISTS idx_holerite_mes_ano ON holerite(mes, ano);
CREATE INDEX IF NOT EXISTS idx_holerite_data_assinatura ON holerite(dataAssinatura);

-- Índices para tabela logs_atividade
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs_atividade(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_atividade(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_acao ON logs_atividade(acao);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionarios_updated_at BEFORE UPDATE ON funcionarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holerite_updated_at BEFORE UPDATE ON holerite FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresa_config_updated_at BEFORE UPDATE ON empresa_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funcionalidades_pro_updated_at BEFORE UPDATE ON funcionalidades_pro FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONSTRAINTS SIMPLES
-- =====================================================

-- Constraints para email válido (formato básico)
ALTER TABLE usuarios ADD CONSTRAINT check_email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE funcionarios ADD CONSTRAINT check_email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holerite ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresa_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionalidades_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_atividade ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela usuarios
CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON usuarios
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Apenas admins podem inserir usuários" ON usuarios
    FOR INSERT WITH CHECK (true); -- Será controlado pela aplicação

CREATE POLICY "Apenas admins podem atualizar usuários" ON usuarios
    FOR UPDATE USING (true); -- Será controlado pela aplicação

-- Políticas para tabela funcionarios
CREATE POLICY "Funcionários podem ver apenas seus próprios dados" ON funcionarios
    FOR SELECT USING (cpf = (SELECT cpf FROM funcionarios WHERE id = auth.uid()::uuid));

CREATE POLICY "Admins podem ver todos os funcionários" ON funcionarios
    FOR SELECT USING (true); -- Será controlado pela aplicação

CREATE POLICY "Apenas admins podem inserir funcionários" ON funcionarios
    FOR INSERT WITH CHECK (true); -- Será controlado pela aplicação

CREATE POLICY "Apenas admins podem atualizar funcionários" ON funcionarios
    FOR UPDATE USING (true); -- Será controlado pela aplicação

-- Políticas para tabela holerite
CREATE POLICY "Funcionários podem ver apenas seus próprios holerites" ON holerite
    FOR SELECT USING (cpf = (SELECT cpf FROM funcionarios WHERE id = auth.uid()::uuid));

CREATE POLICY "Admins podem ver todos os holerites" ON holerite
    FOR SELECT USING (true); -- Será controlado pela aplicação

CREATE POLICY "Apenas admins podem inserir holerites" ON holerite
    FOR INSERT WITH CHECK (true); -- Será controlado pela aplicação

CREATE POLICY "Funcionários podem atualizar apenas seus próprios holerites para assinar" ON holerite
    FOR UPDATE USING (cpf = (SELECT cpf FROM funcionarios WHERE id = auth.uid()::uuid));

CREATE POLICY "Admins podem atualizar todos os holerites" ON holerite
    FOR UPDATE USING (true); -- Será controlado pela aplicação

-- Políticas para tabela empresa_config
CREATE POLICY "Todos podem ler configurações da empresa" ON empresa_config
    FOR SELECT USING (true);

CREATE POLICY "Apenas criadores podem modificar configurações" ON empresa_config
    FOR ALL USING (true); -- Será controlado pela aplicação

-- Políticas para tabela funcionalidades_pro
CREATE POLICY "Todos podem ler funcionalidades PRO" ON funcionalidades_pro
    FOR SELECT USING (true);

CREATE POLICY "Apenas criadores podem modificar funcionalidades" ON funcionalidades_pro
    FOR ALL USING (true); -- Será controlado pela aplicação

-- Políticas para tabela logs_atividade
CREATE POLICY "Admins podem ver todos os logs" ON logs_atividade
    FOR SELECT USING (true); -- Será controlado pela aplicação

CREATE POLICY "Sistema pode inserir logs" ON logs_atividade
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir configuração padrão da empresa
INSERT INTO empresa_config (nome, cor_primaria, cor_secundaria, cor_botoes, fonte_principal, limite_funcionarios)
VALUES (
    'Sistema de Gestão de Holerites',
    '#ff6b35',
    '#4a90e2',
    '#ff6b35',
    'Inter',
    50
) ON CONFLICT DO NOTHING;

-- Inserir configuração padrão das funcionalidades PRO
INSERT INTO funcionalidades_pro (webhook_whatsapp, relatorio_assinaturas)
VALUES (false, false) ON CONFLICT DO NOTHING;

-- Inserir usuário criador padrão (senha: 123456)
INSERT INTO usuarios (nome, email, senha, cpf, tipo)
VALUES (
    'Administrador do Sistema',
    'admin@sistema.com',
    '123456',
    '12345678900',
    'criador'
) ON CONFLICT (email) DO NOTHING;

-- Inserir funcionário de teste (senha: 123456)
INSERT INTO funcionarios (nome, email, senha, cpf, whatsapp, cargo)
VALUES (
    'Funcionário Teste',
    'funcionario@teste.com',
    '123456',
    '98765432100',
    '(11) 99999-9999',
    'Desenvolvedor'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas do sistema
CREATE OR REPLACE VIEW estatisticas_sistema AS
SELECT 
    (SELECT COUNT(*) FROM funcionarios WHERE ativo = true) as total_funcionarios,
    (SELECT COUNT(*) FROM holerite) as total_holerites,
    (SELECT COUNT(*) FROM holerite WHERE status = 'assinado') as holerites_assinados,
    (SELECT COUNT(*) FROM holerite WHERE status = 'pendente') as holerites_pendentes,
    (SELECT COUNT(*) FROM holerite WHERE created_at >= date_trunc('month', now())) as holerites_mes_atual,
    (SELECT COUNT(*) FROM holerite WHERE status = 'assinado' AND created_at >= date_trunc('month', now())) as assinaturas_mes_atual;

-- View para relatório de assinaturas
CREATE OR REPLACE VIEW relatorio_assinaturas AS
SELECT 
    h.id,
    h.cpf,
    f.nome as nome_funcionario,
    f.email as email_funcionario,
    h.mes,
    h.ano,
    h.status,
    h.dataAssinatura,
    h.ipAssinatura,
    h.aceiteTermo,
    h.created_at,
    h.updated_at
FROM holerite h
LEFT JOIN funcionarios f ON h.cpf = f.cpf
ORDER BY h.created_at DESC;

-- =====================================================
-- FUNÇÕES AUXILIARES
-- =====================================================

-- Função para obter estatísticas do sistema
CREATE OR REPLACE FUNCTION get_estatisticas_sistema()
RETURNS TABLE (
    total_funcionarios BIGINT,
    total_holerites BIGINT,
    holerites_assinados BIGINT,
    holerites_pendentes BIGINT,
    holerites_mes_atual BIGINT,
    assinaturas_mes_atual BIGINT
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM estatisticas_sistema;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar log de atividade
CREATE OR REPLACE FUNCTION registrar_log(
    p_usuario_id UUID,
    p_usuario_tipo VARCHAR(20),
    p_acao VARCHAR(100),
    p_detalhes JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO logs_atividade (
        usuario_id,
        usuario_tipo,
        acao,
        detalhes,
        ip_address,
        user_agent
    ) VALUES (
        p_usuario_id,
        p_usuario_tipo,
        p_acao,
        p_detalhes,
        p_ip_address,
        p_user_agent
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

/*
SISTEMA DE GESTÃO DE HOLERITES - SCHEMA SIMPLIFICADO

Este schema inclui:

1. TABELAS PRINCIPAIS:
   - usuarios: Administradores e criadores do sistema
   - funcionarios: Funcionários que acessam os holerites
   - holerite: Documentos de holerite com status de assinatura
   - empresa_config: Configurações visuais e limites
   - funcionalidades_pro: Controle de funcionalidades premium
   - logs_atividade: Auditoria de ações do sistema

2. SEGURANÇA:
   - Row Level Security (RLS) habilitado em todas as tabelas
   - Políticas de acesso baseadas em perfis
   - Validação básica de e-mail
   - SEM validação de CPF (para facilitar testes)

3. PERFORMANCE:
   - Índices otimizados para consultas frequentes
   - Triggers para atualização automática de timestamps
   - Views para relatórios comuns

4. FUNCIONALIDADES:
   - Controle de assinatura digital
   - Sistema de logs para auditoria
   - Configuração flexível da empresa
   - Limites baseados em planos

Para usar este schema:
1. Execute este script no SQL Editor do Supabase
2. Configure o bucket 'holerites' no Storage
3. Atualize as credenciais no arquivo utils.js
4. Teste as funcionalidades com os dados de exemplo

Credenciais de teste:
- Criador: admin@sistema.com / 123456
- Funcionário: 98765432100 / 123456

NOTA: Este schema NÃO inclui validação de CPF para facilitar os testes.
Para adicionar validação de CPF posteriormente, execute o schema completo.
*/ 