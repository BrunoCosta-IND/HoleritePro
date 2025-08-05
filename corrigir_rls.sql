-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Remover políticas existentes que podem estar conflitando
DROP POLICY IF EXISTS "Admins podem ver todos os dados" ON usuarios;
DROP POLICY IF EXISTS "Admins podem ver todos os funcionários" ON funcionarios;
DROP POLICY IF EXISTS "Admins podem ver todos os holerites" ON holerite;

-- Recriar políticas com permissões completas
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

-- Verificar se as políticas foram criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('usuarios', 'funcionarios', 'holerite', 'logs_atividade', 'uploads_n8n')
ORDER BY tablename, policyname; 