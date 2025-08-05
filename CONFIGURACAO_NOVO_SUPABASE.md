# 🚀 CONFIGURAÇÃO DO NOVO SUPABASE

## ✅ Credenciais Atualizadas

As credenciais do Supabase foram atualizadas no arquivo `src/lib/utils.js`:

- **URL**: `https://lgqtbaavnawggzdtlijk.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncXRiYWF2bmF3Z2d6ZHRsaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTQ5MzIsImV4cCI6MjA2OTM5MDkzMn0.33dvB7axspYob8cx0_HIYMbPoJAmb17P-x9wAAARM_E`

## 🔧 Passos para Configuração

### 1. Executar o Schema SQL

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Clique em **"New query"**
5. Copie todo o conteúdo do arquivo `supabase_schema_simples.sql`
6. Cole no editor SQL
7. Clique em **"Run"**

### 2. Configurar Storage Bucket

1. No painel do Supabase, vá para **Storage**
2. Clique em **"Create a new bucket"**
3. Nome do bucket: `holerites`
4. Marque **"Public bucket"** (para permitir acesso aos arquivos)
5. Clique em **"Create bucket"**

### 3. Configurar Políticas do Storage

No **SQL Editor**, execute:

```sql
-- Política para permitir upload de arquivos
CREATE POLICY "Permitir upload de holerites" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'holerites');

-- Política para permitir visualização de arquivos
CREATE POLICY "Permitir visualização de holerites" ON storage.objects
FOR SELECT USING (bucket_id = 'holerites');

-- Política para permitir atualização de arquivos
CREATE POLICY "Permitir atualização de holerites" ON storage.objects
FOR UPDATE USING (bucket_id = 'holerites');
```

### 4. Verificar Configuração

Após executar o schema, verifique se as tabelas foram criadas:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

## 🧪 Testar o Sistema

### 1. Testar Conexão

Execute no SQL Editor:

```sql
-- Testar conexão com dados de exemplo
SELECT * FROM usuarios WHERE email = 'admin@sistema.com';
SELECT * FROM funcionarios WHERE cpf = '98765432100';
```

### 2. Credenciais de Teste

**Criador do Sistema:**
- E-mail: `admin@sistema.com`
- Senha: `123456`
- CPF: `12345678900`

**Funcionário de Teste:**
- CPF: `98765432100`
- Senha: `123456`

## 🔍 Verificações Importantes

### 1. Verificar Tabelas Criadas

```sql
-- Listar todas as tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Tabelas esperadas:**
- `usuarios`
- `funcionarios`
- `holerite`
- `empresa_config`
- `funcionalidades_pro`
- `logs_atividade`

### 2. Verificar Dados Iniciais

```sql
-- Verificar usuário criador
SELECT nome, email, tipo FROM usuarios;

-- Verificar funcionário de teste
SELECT nome, email, cpf FROM funcionarios;

-- Verificar configurações
SELECT * FROM empresa_config;
SELECT * FROM funcionalidades_pro;
```

### 3. Verificar Views

```sql
-- Testar view de estatísticas
SELECT * FROM estatisticas_sistema;

-- Testar view de relatório
SELECT * FROM relatorio_assinaturas;
```

## 🚀 Próximos Passos

1. **Execute o schema** no SQL Editor
2. **Configure o bucket** `holerites`
3. **Teste a conexão** com as credenciais
4. **Execute o projeto** localmente
5. **Teste o login** com as credenciais fornecidas

## 🔧 Troubleshooting

### Se houver erro de conexão:

1. **Verifique as credenciais** no arquivo `utils.js`
2. **Confirme que o projeto está ativo** no Supabase
3. **Teste a URL** no navegador

### Se houver erro de tabelas:

1. **Execute o schema novamente**
2. **Verifique se não há erros** no SQL Editor
3. **Confirme que todas as tabelas foram criadas**

### Se houver erro de storage:

1. **Crie o bucket** `holerites`
2. **Configure as políticas** de acesso
3. **Teste o upload** de um arquivo

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** no SQL Editor
2. **Confirme as credenciais** estão corretas
3. **Teste cada etapa** individualmente
4. **Use as credenciais de teste** fornecidas

---

**🎉 Configuração concluída! O sistema está pronto para uso com o novo Supabase.** 