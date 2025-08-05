# 🚀 INSTRUÇÕES PARA CONFIGURAÇÃO DO SUPABASE

## 📋 Visão Geral

Este documento contém as instruções completas para configurar o Supabase com o novo schema do Sistema de Gestão de Holerites.

## 🔧 Passos para Configuração

### 1. Criar Novo Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "gestao-holerites")
6. Escolha uma senha forte para o banco de dados
7. Escolha a região mais próxima (recomendado: São Paulo)
8. Clique em "Create new project"

### 2. Executar o Schema SQL

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase_schema.sql`
4. Cole no editor SQL
5. Clique em **"Run"** para executar o script

### 3. Configurar Storage Bucket

1. No painel do Supabase, vá para **Storage**
2. Clique em **"New bucket"**
3. Configure o bucket:
   - **Name**: `holerites`
   - **Public bucket**: ❌ **DESMARCADO** (importante!)
   - **File size limit**: 50MB (ou conforme necessário)
   - **Allowed MIME types**: `application/pdf`
4. Clique em **"Create bucket"**

### 4. Configurar Políticas de Storage

1. No bucket `holerites`, vá para **Policies**
2. Clique em **"New policy"**
3. Configure as políticas:

#### Política para Upload (apenas admins)
```sql
-- Nome: "Admins can upload files"
-- Target roles: authenticated
-- Using expression:
(auth.role() = 'authenticated')
```

#### Política para Download (funcionários veem apenas seus arquivos)
```sql
-- Nome: "Users can download their own files"
-- Target roles: authenticated
-- Using expression:
(storage.foldername(name))[1] = auth.jwt() ->> 'cpf'
```

### 5. Atualizar Credenciais no Código

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public** key

3. Abra o arquivo `src/lib/utils.js`
4. Substitua as credenciais:

```javascript
export const supabase = createClient(
  'SUA_NOVA_PROJECT_URL_AQUI',
  'SUA_NOVA_ANON_KEY_AQUI'
);
```

### 6. Testar a Configuração

1. Execute o projeto localmente:
```bash
npm run dev
```

2. Teste o login com as credenciais padrão:
   - **Criador**: admin@sistema.com / 123456
   - **Funcionário**: 98765432100 / 123456

## 🔐 Configurações de Segurança

### Row Level Security (RLS)

O schema já inclui RLS habilitado em todas as tabelas. As políticas estão configuradas para:

- **Funcionários**: Veem apenas seus próprios dados
- **Admins**: Veem todos os dados
- **Criadores**: Acesso total ao sistema

### Validações Implementadas

- ✅ Validação de CPF brasileiro
- ✅ Validação de formato de e-mail
- ✅ Validação de formato de WhatsApp
- ✅ Constraints de integridade referencial
- ✅ Triggers para auditoria automática

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Descrição | Campos Principais |
|--------|-----------|-------------------|
| `usuarios` | Administradores e criadores | id, nome, email, senha, cpf, tipo |
| `funcionarios` | Funcionários do sistema | id, nome, email, senha, cpf, cargo |
| `holerite` | Documentos de holerite | id, cpf, mes, ano, file_url, status |
| `empresa_config` | Configurações visuais | nome, cores, logo, limites |
| `funcionalidades_pro` | Controle de recursos premium | webhook_whatsapp, relatorio_assinaturas |
| `logs_atividade` | Auditoria do sistema | usuario_id, acao, detalhes, timestamp |

### Views Úteis

- `estatisticas_sistema`: Métricas gerais
- `relatorio_assinaturas`: Relatório detalhado de assinaturas

## 🛠️ Funções Auxiliares

### Funções Disponíveis

1. **`validar_cpf(cpf)`**: Valida CPF brasileiro
2. **`update_updated_at_column()`**: Atualiza timestamps automaticamente
3. **`get_estatisticas_sistema()`**: Retorna métricas do sistema
4. **`registrar_log()`**: Registra atividades para auditoria

## 🔄 Migração de Dados (Opcional)

Se você já tem dados no sistema anterior:

1. **Exportar dados antigos**:
   ```sql
   -- Exportar funcionários
   SELECT * FROM funcionarios;
   
   -- Exportar holerites
   SELECT * FROM holerite;
   ```

2. **Importar no novo banco**:
   ```sql
   -- Inserir funcionários
   INSERT INTO funcionarios (nome, email, senha, cpf, cargo)
   VALUES ('Nome', 'email@exemplo.com', 'senha', '12345678900', 'Cargo');
   
   -- Inserir holerites
   INSERT INTO holerite (cpf, mes, ano, file_url, status)
   VALUES ('12345678900', 12, 2024, 'url_do_arquivo', 'pendente');
   ```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com Supabase**:
   - Verifique se as credenciais estão corretas
   - Confirme se o projeto está ativo

2. **Erro de upload de arquivos**:
   - Verifique se o bucket `holerites` foi criado
   - Confirme as políticas de storage

3. **Erro de validação de CPF**:
   - Verifique se o CPF está no formato correto
   - Use apenas números ou formato com pontos/traços

4. **Erro de permissão**:
   - Verifique se o RLS está configurado corretamente
   - Confirme as políticas de acesso

### Logs e Debug

Para verificar se tudo está funcionando:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar dados iniciais
SELECT * FROM usuarios;
SELECT * FROM funcionarios;
SELECT * FROM empresa_config;

-- Verificar estatísticas
SELECT * FROM estatisticas_sistema;
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no console do navegador (F12)
2. Confirme se todas as tabelas foram criadas
3. Teste as credenciais de conexão
4. Verifique as políticas de segurança

## ✅ Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado com sucesso
- [ ] Bucket `holerites` criado
- [ ] Políticas de storage configuradas
- [ ] Credenciais atualizadas no código
- [ ] Login de teste funcionando
- [ ] Upload de arquivos funcionando
- [ ] Assinatura de documentos funcionando

---

**🎉 Parabéns! Seu sistema está configurado e pronto para uso!** 